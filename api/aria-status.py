#!/usr/bin/python2.7
from __future__ import print_function
import xmlrpclib
import sys

s = xmlrpclib.ServerProxy('http://localhost:6800/rpc')
stats = s.aria2.getGlobalStat()

print('%s active (%s waiting) | %sKB/s' % (stats['numActive'], stats['numWaiting'], (int(stats['downloadSpeed']) / 1000)), end='')
