#!/usr/bin/bash

count=$(echo $(transmission-remote 127.0.0.1 -l | wc -l) - 2 | bc)
printf $count
if test $count -gt 0
then
    stats=$(transmission-remote 127.0.0.1 -l | tail -n 1 | column -t)
    down=$(echo $stats | cut -d " " -f 5 | cut -d '.' -f 1)kbps
    up=$(echo $stats | cut -d " " -f 4 | cut -d '.' -f 1)kpbs
    count="$count items"
    if $(transmission-remote 127.0.0.1 -si | grep 'Enabled turtle' > /dev/null)
    then
        echo "$count @ $down / $up (turtle)"
    else
        echo "$count @ $down / $up"
    fi
fi
