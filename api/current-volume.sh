#!/bin/bash

echo -n `pacmd list-sinks | grep -e 'name:' -e 'index' -e 'volume' | grep -e 'index: 7' -A 2 | grep volume | awk '{ print $3 }'`
