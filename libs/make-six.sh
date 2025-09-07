#!/usr/bin/env bash
set -euo pipefail

# make-six.sh — produce 6 deliverables from one input:
# 1) Portrait  864x1536  HEVC 2-pass @ ~480k  (Safari-friendly MP4)
# 2) Portrait  864x1536  AV1  2-pass @ ~480k  (WebM)
# 3) Landscape 1920x1080 HEVC CRF 26         (MP4)
# 4) Landscape 1920x1080 AV1  CRF 32         (WebM)
# 5) Landscape 3840x2160 HEVC CRF 22         (MP4, crisp on XXL)
# 6) Landscape 3840x2160 AV1  CRF 28         (WebM)
#
# Usage:
#   ./make-six.sh /path/to/input.mp4 [-o ./out]
#
# Notes:
# - We normalize to 24 fps for web friendliness.
# - HEVC MP4s are tagged hvc1 for Safari.
# - We attempt 10-bit where available; auto-fallback to 8-bit if not.

### Args
IN="${1:-}"
[[ -n "${IN}" && -f "${IN}" ]] || { echo "Usage: $0 /path/to/input.(mp4|mov|mkv) [-o ./out]"; exit 1; }
shift || true
OUT="./out"
while (( "$#" )); do
  case "$1" in
    -o|--out) OUT="${2:-./out}"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done
mkdir -p "$OUT"

### Tools check
command -v ffmpeg >/dev/null || { echo "ffmpeg not found"; exit 1; }

### Derive names
BASENAME="$(basename -- "$IN")"
STEM="${BASENAME%.*}"

P_HEVC="$OUT/${STEM}_portrait_864x1536_hevc_480k_2pass.mp4"
P_AV1="$OUT/${STEM}_portrait_864x1536_av1_480k_2pass.webm"
M_HEVC="$OUT/${STEM}_landscape_1920x1080_hevc_crf26.mp4"
M_AV1="$OUT/${STEM}_landscape_1920x1080_av1_crf32.webm"
H_HEVC="$OUT/${STEM}_landscape_3840x2160_hevc_crf22.mp4"
H_AV1="$OUT/${STEM}_landscape_3840x2160_av1_crf28.webm"

### Pixel format auto-detects (10-bit if encoder supports it)
PFMT_X265="yuv420p10le"
if ! ffmpeg -hide_banner -h encoder=libx265 2>/dev/null | grep -qi 'Main 10'; then
  PFMT_X265="yuv420p"
fi
PFMT_AV1="yuv420p10le"  # libaom-av1 generally accepts 10-bit; fallback if needed on error.

echo "==> Output dir: $OUT"
echo "==> Portrait HEVC @ ~480k → $P_HEVC"
echo "==> Portrait AV1  @ ~480k → $P_AV1"
echo "==> 1080p HEVC (CRF26)    → $M_HEVC"
echo "==> 1080p AV1  (CRF32)    → $M_AV1"
echo "==> 4K HEVC   (CRF22)     → $H_HEVC"
echo "==> 4K AV1    (CRF28)     → $H_AV1"

############################################
# 1–2) PORTRAIT 864x1536 @ ~480k (2-pass)
############################################
# Gentle denoise helps the low bitrate without visible loss
VF_PORTRAIT='hqdn3d=1.2:1.2:6:6,scale=-2:1536:flags=lanczos,crop=864:1536,fps=24'

# HEVC 2-pass (better quality than hardware ABR at the same size)
PLOG1="$OUT/${STEM}_p_hevc_480k_passlog"
ffmpeg -y -i "$IN" -vf "$VF_PORTRAIT" \
  -c:v libx265 -preset slow -b:v 480k -maxrate 520k -bufsize 1040k \
  -pass 1 -passlogfile "$PLOG1" -pix_fmt "$PFMT_X265" \
  -x265-params "aq-mode=3" -an -f mp4 /dev/null
ffmpeg -y -i "$IN" -vf "$VF_PORTRAIT" \
  -c:v libx265 -preset slow -b:v 480k -maxrate 520k -bufsize 1040k \
  -pass 2 -passlogfile "$PLOG1" -pix_fmt "$PFMT_X265" \
  -x265-params "aq-mode=3" -tag:v hvc1 -movflags +faststart -an "$P_HEVC"
rm -f "${PLOG1}"*

# AV1 2-pass (same target size, Chrome/Firefox-optimized)
PLOG2="$OUT/${STEM}_p_av1_480k_passlog"
ffmpeg -y -i "$IN" -vf "$VF_PORTRAIT" \
  -c:v libaom-av1 -b:v 480k -maxrate 520k -bufsize 1040k \
  -pass 1 -passlogfile "$PLOG2" -pix_fmt "$PFMT_AV1" \
  -row-mt 1 -cpu-used 3 -an -f webm /dev/null
ffmpeg -y -i "$IN" -vf "$VF_PORTRAIT" \
  -c:v libaom-av1 -b:v 480k -maxrate 520k -bufsize 1040k \
  -pass 2 -passlogfile "$PLOG2" -pix_fmt "$PFMT_AV1" \
  -row-mt 1 -cpu-used 3 -an "$P_AV1"
rm -f "${PLOG2}"*

############################################
# 3–4) LANDSCAPE 1080p (CRF targets)
############################################
VF_1080='scale=1920:1080:force_original_aspect_ratio=decrease:flags=lanczos,fps=24,pad=1920:1080:(ow-iw)/2:(oh-ih)/2'
ffmpeg -y -i "$IN" -vf "$VF_1080" \
  -c:v libx265 -preset slow -crf 26 -pix_fmt "$PFMT_X265" \
  -x265-params "profile=main10:aq-mode=3:sao=0:strong-intra-smoothing=0" \
  -tag:v hvc1 -movflags +faststart -an "$M_HEVC"

ffmpeg -y -i "$IN" -vf "$VF_1080" \
  -c:v libaom-av1 -crf 32 -b:v 0 -row-mt 1 -cpu-used 4 -pix_fmt "$PFMT_AV1" \
  -an "$M_AV1"

############################################
# 5–6) LANDSCAPE up to 4K (CRF targets)
############################################
VF_4K='scale=3840:2160:force_original_aspect_ratio=decrease:flags=lanczos,fps=24,pad=3840:2160:(ow-iw)/2:(oh-ih)/2'
ffmpeg -y -i "$IN" -vf "$VF_4K" \
  -c:v libx265 -preset slower -crf 22 -pix_fmt "$PFMT_X265" \
  -x265-params "profile=main10:aq-mode=3:sao=0:strong-intra-smoothing=0" \
  -tag:v hvc1 -movflags +faststart -an "$H_HEVC"

ffmpeg -y -i "$IN" -vf "$VF_4K" \
  -c:v libaom-av1 -crf 28 -b:v 0 -row-mt 1 -cpu-used 3 -pix_fmt "$PFMT_AV1" \
  -an "$H_AV1"

############################################
# Done — print sizes and HTML snippet
############################################
echo
echo "==> File sizes:"
du -h "$P_HEVC" "$P_AV1" "$M_HEVC" "$M_AV1" "$H_HEVC" "$H_AV1" | sort -h

# Write/print HTML snippets (portrait + landscape)
SNIPPET="$OUT/${STEM}_video_sources.html"
cat >"$SNIPPET" <<HTML
<!-- Portrait 9:16 -->
<video controls playsinline preload="metadata" poster="/path/to/poster_portrait.jpg">
  <source src="$(basename "$P_AV1")" type="video/webm">
  <source src="$(basename "$P_HEVC")" type='video/mp4; codecs="hvc1"'>
  <!-- Optional ultimate fallback -->
  <!-- <source src="/path/to/landscape_h264.mp4" type='video/mp4; codecs="avc1'"> -->
</video>

<!-- Landscape -->
<video controls playsinline preload="metadata" poster="/path/to/poster_landscape.jpg">
  <source src="$(basename "$H_AV1")" type="video/webm">
  <source src="$(basename "$H_HEVC")" type='video/mp4; codecs="hvc1"'>
</video>

<!-- Landscape (1080p mid) -->
<video controls playsinline preload="metadata" poster="/path/to/poster_landscape_mid.jpg">
  <source src="$(basename "$M_AV1")" type="video/webm">
  <source src="$(basename "$M_HEVC")" type='video/mp4; codecs="hvc1"'>
</video>
HTML

echo
echo "==> HTML <video> snippet written to: $SNIPPET"
echo "   (paths are basenames; adjust to your deployed URLs as needed)"
