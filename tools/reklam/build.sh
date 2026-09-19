#!/bin/bash
# $1 = varyant harfi (A|B), $2 = çıktı adı ; /tmp/ad-<X><n>.webm → segment → concat → müzik miks → h264 mp4
set -e
V="$1"; OUT="$2"; MUSIC=/tmp/v2-music.wav
cd /tmp
rm -f seg-$V*.mp4 list-$V.txt
for f in $(ls ad-$V[0-9].webm | sort); do
  n=${f%.webm}; n=${n#ad-}
  ffmpeg -v error -y -i "$f" -vf "fps=30,fade=t=in:st=0:d=0.07:color=white,eq=saturation=1.3" -af "aresample=async=1:first_pts=0" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 160k -ar 48000 "seg-$n.mp4"
  echo "file 'seg-$n.mp4'" >> list-$V.txt
done
ffmpeg -v error -y -f concat -safe 0 -i list-$V.txt -c copy cat-$V.mp4
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 cat-$V.mp4)
FO=$(python3 -c "print(max(0,float('$DUR')-1.2))")
ffmpeg -v error -y -i cat-$V.mp4 -i "$MUSIC" -filter_complex "[0:a]volume=0.9[s];[1:a]atrim=0:$DUR,afade=t=out:st=$FO:d=1.2,volume=0.95[m];[s][m]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[a]" -map 0:v -map "[a]" -c:v libx264 -preset medium -crf 19 -r 30 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of compact "$OUT"
