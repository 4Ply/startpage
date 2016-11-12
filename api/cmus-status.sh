#!/bin/bash

printf "$(cmus-remote -Q | grep 'tag artist' | cut -d' ' -f3-) - "
printf "$(cmus-remote -Q | grep 'tag title' | cut -d' ' -f3-)"

