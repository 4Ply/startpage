#!/bin/bash

#host="http://127.0.0.1:9091/Node1"
host="http://127.0.0.1:$1/$2"
auth="-n $2:oh"
count=$(echo $(transmission-remote $host $auth -l | wc -l) - 2 | bc)
if test $count -gt 0
then
    stats=$(transmission-remote $host $auth -l | tail -n 1 | column -t)
    down=$(echo $stats | cut -d " " -f 4 | cut -d '.' -f 1)kbps
    up=$(echo $stats | cut -d " " -f 3 | cut -d '.' -f 1)kpbs
    count="$count torrents"
    if $(transmission-remote $host $auth -si | grep 'Enabled turtle' > /dev/null)
    then
        printf "$count | $down / $up (turtle)"
    else
        printf "$count | $down / $up"
    fi
else
    printf "0 torrents"
fi
