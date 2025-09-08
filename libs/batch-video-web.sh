#!/usr/bin/env bash
set -euo pipefail

# batch-video-web.sh
# Make 3 web-ready outputs per input:
#  - H.264 MP4 (universal)
#  - HEVC MP4 (Safari-friendly, smaller)
#  - AV1 WebM (Chrome/Firefox-friendly, smallest)
#
# Defaults: 1080p @ 24 fps, muted.
#
# Usage:
#   ./batch-video-web.sh ./videos               # a directory
#   ./batch-video-web.sh a.mp4 b.mov -o ./out   # specific files + output dir
#
# Optional flags:
#   -o, --out DIR     Output directory (default: ./out)
#   --height N        Target height (default: 1080)
#   --fps N           Frame rate (default: 24)
#   --crf-h264 N      CRF for H.264 (default: 21)
#   --crf-hevc N      CRF for HEVC (default: 28)
#   --crf-av1 N       CRF for AV1  (default: 32)
#   --av1-speed N     libaom-av1 -cpu-used (default: 4; lower = slower/better)

OUT="./out"
HEIGHT=1080
FPS=24
CRF_H264=21
CRF_HEVC=28
CRF_AV1=32
AV1_SPEED=4

# --- parse args ---
inputs=()
while (( "$#" )); do
  case "$1" in
    -o|--out) OUT="${2:-}"; shift 2 ;;
    --height) HEIGHT="${2:-}"; shift 2 ;;
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

# expand directories to video files
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
VF="scale=-2:${HEIGHT}:flags=lanczos,fps=${FPS}"

echo "Output: $OUT | ${HEIGHT}p @ ${FPS}fps | H.264 CRF ${CRF_H264}, HEVC CRF ${CRF_HEVC}, AV1 CRF ${CRF_AV1} (speed ${AV1_SPEED})"
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
    "${stem}_1080p_h264.mp4"

  # 2) HEVC MP4 (Apple-optimized)
  ffmpeg -y -i "$IN" \
    -vf "$VF" \
    -c:v libx265 -preset slow -crf "$CRF_HEVC" -pix_fmt yuv420p -tag:v hvc1 \
    -movflags +faststart -an \
    "${stem}_1080p_hevc.mp4"

  # 3) AV1 WebM (Chrome/Firefox-optimized)
  ffmpeg -y -i "$IN" \
    -vf "$VF" \
    -c:v libaom-av1 -crf "$CRF_AV1" -b:v 0 -row-mt 1 -cpu-used "$AV1_SPEED" -pix_fmt yuv420p10le \
    -an \
    "${stem}_1080p_av1.webm"

  echo
done

echo "✅ Done."
