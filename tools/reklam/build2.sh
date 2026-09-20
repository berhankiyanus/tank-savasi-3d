#!/bin/bash
# build2.sh <çıktı.mp4> <segment adı...>   — /tmp/ad-<seg>.webm dosyalarını birleştirir, müzik miksler (9:16 1080×1920 30fps h264/aac)
# Türevler: build2.sh --deriv <in.mp4>  → _16x9 (blur-pad), _1x1 (merkez kırpma 420..1500), _4x5 (285..1635)
set -e
MUSIC=${MUSIC:-/tmp/v2-music.wav}
if [ "$1" = "--deriv" ]; then
  IN="$2"; B="${IN%.mp4}"
  ffmpeg -v error -y -i "$IN" -filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=24:6,eq=brightness=-0.18[bg];[0:v]scale=-2:1080[fg];[bg][fg]overlay=(W-w)/2:0" -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a copy -movflags +faststart "${B}_16x9.mp4"
  ffmpeg -v error -y -i "$IN" -vf "crop=1080:1080:0:420" -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a copy -movflags +faststart "${B}_1x1.mp4"
  ffmpeg -v error -y -i "$IN" -vf "crop=1080:1350:0:285" -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a copy -movflags +faststart "${B}_4x5.mp4"
  for f in "${B}_16x9.mp4" "${B}_1x1.mp4" "${B}_4x5.mp4"; do ffprobe -v error -show_entries stream=width,height:format=duration -of csv=p=0 "$f" | tr '\n' ' '; echo " $f"; done
  exit 0
fi
OUT="$1"; shift
cd /tmp; LIST=list-$$.txt; rm -f $LIST
for seg in "$@"; do
  f="ad-$seg.webm"; [ -f "$f" ] || { echo "eksik: $f"; exit 1; }
  ffmpeg -v error -y -i "$f" -vf "fps=30,fade=t=in:st=0:d=0.07:color=white,eq=saturation=1.25" -af "aresample=async=1:first_pts=0" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 160k -ar 48000 "seg2-$seg.mp4"
  echo "file 'seg2-$seg.mp4'" >> $LIST
done
ffmpeg -v error -y -f concat -safe 0 -i $LIST -c copy cat2-$$.mp4
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 cat2-$$.mp4)
FO=$(python3 -c "print(max(0,float('$DUR')-1.2))")
if [ -f "$MUSIC" ]; then
  ffmpeg -v error -y -i cat2-$$.mp4 -stream_loop -1 -i "$MUSIC" -filter_complex "[0:a]volume=0.9[s];[1:a]atrim=0:$DUR,afade=t=in:st=0:d=0.3,afade=t=out:st=$FO:d=1.2,volume=0.9[m];[s][m]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[a]" -map 0:v -map "[a]" -c:v libx264 -preset medium -crf 19 -r 30 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "$OUT"
else
  ffmpeg -v error -y -i cat2-$$.mp4 -c:v libx264 -preset medium -crf 19 -r 30 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "$OUT"
fi
rm -f $LIST cat2-$$.mp4
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of compact "$OUT"
