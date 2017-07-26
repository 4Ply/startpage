#!/bin/python2

from __future__ import print_function
import urllib, urllib2, cookielib, json, os

username = os.environ['AFRIHOST_USER']
password = os.environ['AFRIHOST_PASS']

cj = cookielib.CookieJar()
opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
login_data = urllib.urlencode({'_username' : username, '_password' : password})
opener.open('https://clientzone.afrihost.com/en/login_check', login_data)
resp = opener.open('https://clientzone.afrihost.com/en/api/connectivity/dataoverview')
result = json.loads(resp.read())

data_used = float(result['usage_data']['data_used'])
projected_usage = float(result['usage_data']['projected_monthly'])

gb_used = float(data_used / 1024 / 1024 / 1024)
tb_used = float(gb_used / 1024)
projected_tb = float(projected_usage / 1024 / 1024 / 1024 / 1024)

print('%.0f GB (%.2f TB) - [Projected: %.2f TB]' % (gb_used, tb_used, projected_tb), end='')
