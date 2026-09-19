#!/bin/bash
# kontakt föyü: $1=webm $2=çıktı png $3=kare sayısı
f="$1"; out="$2"; n=${3:-6}
cnt=$(ffprobe -v error -select_streams v -count_packets -show_entries stream=nb_read_packets -of csv=p=0 "$f")
k=$(( cnt / n )); [ "$k" -lt 1 ] && k=1
ffmpeg -v error -y -i "$f" -vf "select='not(mod(n\,$k))',scale=270:480,tile=${n}x1" -frames:v 1 "$out"
echo "$f frames=$cnt step=$k"
