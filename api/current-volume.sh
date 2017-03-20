#!/bin/bash

echo -n `pacmd list-sinks | grep -e 'name:' -e 'index' -e 'volume' | grep -e 'surround-51' -A 1 | grep volume | awk '{ print $3 }'`
