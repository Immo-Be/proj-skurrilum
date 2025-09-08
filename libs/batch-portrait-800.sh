#!/usr/bin/env bash
set -euo pipefail

# batch-portrait-800.sh
# Make portrait (9:16) videos at 800px height:
#   - H.264 MP4  (universal)
#   - HEVC  MP4  (Safari-friendly, smaller)
#   - AV1  WebM  (Chrome/Firefox, smallest)
#
# Defaults: crop to 9:16, height=800, 24fps, muted, crisp downscale (lanczos).
#
# Usage:
#   ./batch-portrait-800.sh ./videos               # a directory
#   ./batch-portrait-800.sh clip1.mp4 clip2.mov -o ./out
#
# Flags:
#   -o, --out DIR     Output dir (default: ./out)
#   --height N        Portrait height (default: 800)
#   --fps N           Frame rate (default: 24)
#   --mode MODE       crop | pad   (default: crop)
#   --crf-h264 N      H.264 CRF (default: 23)
#   --crf-hevc N      HEVC  CRF (default: 28)
#   --crf-av1 N       AV1   CRF (default: 34)
#   --av1-speed N     libaom-av1 -cpu-used (default: 4)
#   --denoise         Gentle denoise (hqdn3d) before scale (smaller files)
#   --sharpen         Mild unsharp after scale (adds “bite”)

OUT="../static/videos/portrait"
H=800
FPS=24
MODE="crop"
CRF_H264=23
CRF_HEVC=28
CRF_AV1=34
AV1_SPEED=4
DENOISE=0
SHARPEN=0

inputs=()
while (( "$#" )); do
  case "$1" in
    -o|--out) OUT="${2:-}"; shift 2 ;;
    --height) H="${2:-}"; shift 2 ;;
    --fps) FPS="${2:-}"; shift 2 ;;
    --mode) MODE="${2:-}"; shift 2 ;;
    --crf-h264) CRF_H264="${2:-}"; shift 2 ;;
    --crf-hevc) CRF_HEVC="${2:-}"; shift 2 ;;
    --crf-av1)  CRF_AV1="${2:-}";  shift 2 ;;
    --av1-speed) AV1_SPEED="${2:-}"; shift 2 ;;
    --denoise) DENOISE=1; shift ;;
    --sharpen) SHARPEN=1; shift ;;
    -h|--help) sed -n '1,120p' "$0"; exit 0 ;;
    *) inputs+=("$1"); shift ;;
  esac
done

[[ ${#inputs[@]} -gt 0 ]] || { echo "No inputs. Pass files or a directory."; exit 1; }
command -v ffmpeg >/dev/null || { echo "ffmpeg not found"; exit 1; }
mkdir -p "$OUT"

# Expand directories to files
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

# Derived width for strict 9:16
W=$(( H * 9 / 16 ))  # e.g., 800 -> 450

# Build filter chain
pre=""
post=""
[[ $DENOISE -eq 1 ]] && pre="hqdn3d=1.0:1.0:4:4,"
[[ $SHARPEN -eq 1 ]] && post=",unsharp=5:5:0.6:5:5:0.4"

if [[ "$MODE" == "crop" ]]; then
  VF="${pre}scale=-2:${H}:flags=lanczos,crop=${W}:${H},fps=${FPS}${post}"
elif [[ "$MODE" == "pad" ]]; then
  VF="${pre}scale=${W}:-2:flags=lanczos,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2,fps=${FPS}${post}"
else
  echo "Invalid --mode (use crop|pad)"; exit 1
fi

# x265 10-bit if available
PFMT_X265="yuv420p10le"
if ! ffmpeg -hide_banner -h encoder=libx265 2>/dev/null | grep -qi 'Main 10'; then
  PFMT_X265="yuv420p"
fi

echo "Output: $OUT | ${W}x${H} portrait @ ${FPS}fps | mode=${MODE}"
echo "CRFs → H.264:${CRF_H264}  HEVC:${CRF_HEVC}  AV1:${CRF_AV1} (speed ${AV1_SPEED})"
echo

for IN in "${expanded[@]}"; do
  [[ -f "$IN" ]] || { echo "Skip (not a file): $IN"; continue; }
  base="$(basename "${IN%.*}")"
  stem="$OUT/${base}_portrait_${W}x${H}"

  echo "==> $IN"

  # 1) H.264 MP4 (universal)
  ffmpeg -y -i "$IN" \
    -vf "$VF" \
    -c:v libx264 -preset slow -crf "$CRF_H264" -pix_fmt yuv420p \
    -movflags +faststart -an \
    "${stem}_h264.mp4"

  # 2) HEVC MP4 (Safari-friendly)
  ffmpeg -y -i "$IN" \
    -vf "$VF" \
    -c:v libx265 -preset slow -crf "$CRF_HEVC" -pix_fmt "$PFMT_X265" -tag:v hvc1 \
    -movflags +faststart -an \
    "${stem}_hevc.mp4"

  # 3) AV1 WebM (Chrome/Firefox)
  ffmpeg -y -i "$IN" \
    -vf "$VF" \
    -c:v libaom-av1 -crf "$CRF_AV1" -b:v 0 -row-mt 1 -cpu-used "$AV1_SPEED" -pix_fmt yuv420p10le \
    -an \
    "${stem}_av1.webm"

  echo
done

echo "✅ Done."
