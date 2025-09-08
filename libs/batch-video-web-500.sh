#!/usr/bin/env bash
set -euo pipefail

# batch-video-web-500.sh
# Produce 3 web-ready outputs per input, optimized for ~500px display width:
#  - H.264 MP4 (universal)
#  - HEVC MP4 (Safari-friendly, smaller)
#  - AV1 WebM (Chrome/Firefox-friendly, smallest; slower)
#
# Defaults: width 500, 24 fps, muted.
#
# Usage:
#   ./batch-video-web-500.sh ./videos               # a directory
#   ./batch-video-web-500.sh clip1.mp4 -o ./out     # specific files + out dir
#
# Flags:
#   -o, --out DIR     Output dir (default: ./out)
#   --width N         Target width (default: 500)
#   --fps N           Frame rate (default: 24)
#   --crf-h264 N      H.264 CRF (default: 24)
#   --crf-hevc N      HEVC  CRF (default: 30)
#   --crf-av1 N       AV1   CRF (default: 36)
#   --av1-speed N     libaom-av1 -cpu-used (default: 4)

OUT="./out"
WIDTH=500
FPS=24
CRF_H264=24
CRF_HEVC=30
CRF_AV1=36
AV1_SPEED=4

inputs=()
while (( "$#" )); do
  case "$1" in
    -o|--out) OUT="${2:-}"; shift 2 ;;
    --width) WIDTH="${2:-}"; shift 2 ;;
    --fps) FPS="${2:-}"; shift 2 ;;
    --crf-h264) CRF_H264="${2:-}"; shift 2 ;;
    --crf-hevc) CRF_HEVC="${2:-}"; shift 2 ;;
    --crf-av1) CRF_AV1="${2:-}"; shift 2 ;;
    --av1-speed) AV1_SPEED="${2:-}"; shift 2 ;;
    -h|--help) sed -n '1,120p' "$0"; exit 0 ;;
    *) inputs+=("$1"); shift ;;
  esac
done

[[ ${#inputs[@]} -gt 0 ]] || { echo "No inputs. Pass files or a directory."; exit 1; }
command -v ffmpeg >/dev/null || { echo "ffmpeg not found"; exit 1; }

# Expand directories to video files
expanded=()
for arg in "${inputs[@]}"; do
  if [[ -d "$arg" ]]; then
    while IFS= read -r -d '' f; do
      expanded+=("$f")
    done < <(find "$arg" -maxdepth 1 -type f \( -iname "*.mp4" -o -iname "*.mov" -o -iname "*.mkv" -o -iname "*.m4v" -o -iname "*.avi" -o -iname "*.webm" \) -print0)
  else
    expanded+=("$arg")
  fi
done

mkdir -p "$OUT"
# Keep aspect ratio; ensure even height. Lanczos for crisp downscale.
VF="scale=${WIDTH}:-2:flags=lanczos,fps=${FPS}"

echo "Output: $OUT | ${WIDTH}px @ ${FPS}fps"
echo "CRFs → H.264:${CRF_H264}  HEVC:${CRF_HEVC}  AV1:${CRF_AV1} (speed ${AV1_SPEED})"
echo

for IN in "${expanded[@]}"; do
  [[ -f "$IN" ]] || { echo "Skip (not a file): $IN"; continue; }
  base="$(basename "${IN%.*}")"
  stem="$OUT/$base"

  echo "==> $IN"

  # 1) H.264 MP4 (universal)
  ffmpeg -y -i "$IN" \
    -vf "$VF" \
    -c:v libx264 -preset slow -crf "$CRF_H264" -pix_fmt yuv420p \
    -movflags +faststart -an \
    "${stem}_w${WIDTH}_h264.mp4"

  # 2) HEVC MP4 (Apple-optimized)
  ffmpeg -y -i "$IN" \
    -vf "$VF" \
    -c:v libx265 -preset slow -crf "$CRF_HEVC" -pix_fmt yuv420p -tag:v hvc1 \
    -movflags +faststart -an \
    "${stem}_w${WIDTH}_hevc.mp4"

  # 3) AV1 WebM (Chrome/Firefox-optimized)
  ffmpeg -y -i "$IN" \
    -vf "$VF" \
    -c:v libaom-av1 -crf "$CRF_AV1" -b:v 0 -row-mt 1 -cpu-used "$AV1_SPEED" -pix_fmt yuv420p10le \
    -an \
    "${stem}_w${WIDTH}_av1.webm"

  echo
done

echo "✅ Done."
