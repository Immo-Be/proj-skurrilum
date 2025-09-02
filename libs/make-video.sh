#!/usr/bin/env bash
set -euo pipefail

# make-video.sh — smallest-file-first encoder
# Default: WebM (AV1 + Opus), 10-bit, very slow encode for best compression.
# Usage:
#   ./make-video.sh input.mp4
#   ./make-video.sh input.mp4 --mode pad --desk-h 1080 --port-h 1920
# Options:
#   --mode [crop|pad|blur]    Portrait strategy (default: crop)
#   --desk-h <px>             Desktop height target (default: 1080)
#   --port-h <px>             Portrait height target (default: 1920)
#   --crf-desktop <n>         AV1 CRF desktop (default: 34)
#   --crf-portrait <n>        AV1 CRF portrait (default: 36)
#   --bitdepth [8|10]         Output bit depth (default: 10)
#   --fps <n>                 Force output fps (default: source fps)
#   --speech                  Audio tuned for speech: mono @ 56k
#   --codec [av1|vp9]         Codec (default: av1)
#   --outdir <path>           Output dir (default: ./out)

MODE="crop"
DESK_H=1080
PORT_H=1920
CRF_DESK=34
CRF_PORT=36
BITDEPTH=10
FORCE_FPS=""
SPEECH=0
CODEC="av1"
OUTDIR="./out"
SPEED=2   # default libaom-av1 speed (0 = slowest, 4 = balanced, 8 = fastest)

die(){ echo "Error: $*" >&2; exit 1; }
have(){ command -v "$1" >/dev/null 2>&1; }

INPUT="${1:-}"; [[ -n "${INPUT}" ]] || die "Usage: $0 input.(mp4|mov|mkv) [options]"
shift || true

while (( "$#" )); do
  case "$1" in
    --mode) MODE="${2:-}"; shift 2 ;;
    --desk-h) DESK_H="${2:-}"; shift 2 ;;
    --port-h) PORT_H="${2:-}"; shift 2 ;;
    --crf-desktop) CRF_DESK="${2:-}"; shift 2 ;;
    --crf-portrait) CRF_PORT="${2:-}"; shift 2 ;;
    --bitdepth) BITDEPTH="${2:-}"; shift 2 ;;
    --fps) FORCE_FPS="${2:-}"; shift 2 ;;
    --speech) SPEECH=1; shift ;;
    --codec) CODEC="${2:-}"; shift 2 ;;
    --outdir) OUTDIR="${2:-}"; shift 2 ;;
    --speed) SPEED="${2:-4}"; shift 2 ;;
    -h|--help) sed -n '1,80p' "$0"; exit 0 ;;
    *) die "Unknown flag: $1" ;;
  esac
done

[[ -f "$INPUT" ]] || die "Input not found: $INPUT"
have ffmpeg || die "ffmpeg required (brew install ffmpeg)"
have ffprobe || die "ffprobe required (brew install ffmpeg)"

mkdir -p "$OUTDIR"
BASENAME="$(basename -- "$INPUT")"
STEM="${BASENAME%.*}"

# Probe FPS
SRC_FPS_RAW="$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=nw=1:nk=1 "$INPUT" || echo "0/1")"
FPS="$(awk -v r="$SRC_FPS_RAW" 'BEGIN{n=split(r,a,"/"); if(n==2&&a[2]!=0) printf("%.3f", a[1]/a[2]); else print "25.000"}')"
[[ -n "$FORCE_FPS" ]] && FPS="$FORCE_FPS"
# Longer GOP = smaller files (~5s)
KEYINT="$(awk -v f="$FPS" 'BEGIN{ printf("%d", (f*5)+0.5) }')"

# Audio
if [[ $SPEECH -eq 1 ]]; then
  AOPTS=(-c:a libopus -application voip -b:a 56k -ac 1)
else
  AOPTS=(-c:a libopus -application audio -b:a 80k)
fi

# Video encoder
case "$CODEC" in
  av1)
    VENC=(-c:v libaom-av1)
    PFMT=$([[ "$BITDEPTH" -eq 10 ]] && echo yuv420p10le || echo yuv420p)
    COMMON_V=(
      -pix_fmt "$PFMT"
      -cpu-used 0
      -row-mt 1
      -aq-mode 1
      -lag-in-frames 35
      -enable-ref-frame-mvs 1
      -g "$KEYINT"
      -tiles 1x1
      -b:v 0
    )
    EXT="webm"
    ;;
  vp9)
    VENC=(-c:v libvpx-vp9)
    COMMON_V=(
      -pix_fmt yuv420p
      -row-mt 1
      -g "$KEYINT"
      -b:v 0
      -speed 0
      -quality good
      -aq-mode 1
      -threads 4
    )
    EXT="webm"
    ;;
  *)
    die "Unsupported --codec (use av1 or vp9)"
    ;;
esac

COMMON_MISC=()
[[ -n "$FORCE_FPS" ]] && COMMON_MISC+=(-r "$FORCE_FPS")

echo "==> FPS: $FPS | Keyint: $KEYINT | Codec: $CODEC | Bitdepth: ${BITDEPTH}-bit"
echo "==> Desktop: ${DESK_H}p | Portrait: ${PORT_H} (${MODE})"
echo "==> Out dir: $OUTDIR"

# 1) Desktop
DESK_OUT="${OUTDIR}/${STEM}_desktop_${DESK_H}p.${EXT}"
echo "--> Writing $DESK_OUT"
ffmpeg -y -i "$INPUT" \
  -vf "scale=-2:${DESK_H}:flags=lanczos" \
  "${VENC[@]}" "${COMMON_V[@]}" -crf "$CRF_DESK" \
  "${AOPTS[@]}" ${COMMON_MISC[@]+"${COMMON_MISC[@]}"} \
  "$DESK_OUT"

# 2) Portrait
PORT_W=$(( PORT_H * 9 / 16 ))
PORT_OUT="${OUTDIR}/${STEM}_portrait_${PORT_W}x${PORT_H}_${MODE}.${EXT}"

case "$MODE" in
  crop)
    VF="scale=-2:${PORT_H}:flags=lanczos,crop=${PORT_W}:${PORT_H}"
    ;;
  pad)
    VF="scale=${PORT_W}:-2:flags=lanczos,pad=${PORT_W}:${PORT_H}:(ow-iw)/2:(oh-ih)/2"
    ;;
  blur)
    # single, simple, safely-quoted filter string
    VF_COMPLEX="[0:v]scale=${PORT_W}:${PORT_H},boxblur=luma_radius=20:luma_power=1:chroma_radius=10[bg];[0:v]scale=-2:${PORT_H}[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p"
    ;;
  *)
    die "Invalid --mode (crop|pad|blur)"
    ;;
esac

echo "--> Writing $PORT_OUT"
if [[ "$MODE" == "blur" ]]; then
  ffmpeg -y -i "$INPUT" \
    -filter_complex "$VF_COMPLEX" \
    "${VENC[@]}" "${COMMON_V[@]}" -crf "$CRF_PORT" \
    "${AOPTS[@]}" ${COMMON_MISC[@]+"${COMMON_MISC[@]}"} \
    "$PORT_OUT"
else
  ffmpeg -y -i "$INPUT" \
    -vf "$VF" \
    "${VENC[@]}" "${COMMON_V[@]}" -crf "$CRF_PORT" \
    "${AOPTS[@]}" ${COMMON_MISC[@]+"${COMMON_MISC[@]}"} \
    "$PORT_OUT"
fi

echo "✅ Done."
echo "Desktop:  $DESK_OUT"
echo "Portrait: $PORT_OUT"
