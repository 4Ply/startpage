#!/usr/bin/python2.7

from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import SocketServer
from subprocess import check_output
from urlparse import urlparse, parse_qs
import requests
import os
import json
import spice_api as spice

import MySQLdb

cached_anime_list = 0


class S(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        self.end_headers()

    def do_GET(self):
        self._set_headers()
        x = ""
        if self.path.startswith("/transmission"):
            x = check_output(["./transmission.sh"])
        if self.path.startswith("/aria2"):
            x = check_output(["./aria-status.py"])
        if self.path.startswith("/cmus"):
            x = check_output(["./cmus-status.sh"])
        if self.path.startswith("/anime_size"):
            x = check_output(["anime_size"])
        if self.path.startswith("/download_anime"):
            query_components = parse_qs(urlparse(self.path).query)
            print query_components
            x = download_anime(query_components)
        if self.path.startswith("/watching_anime"):
            x = watching_anime()
            self.wfile.write('{"data":' + x + '}')
            return
        if self.path.startswith("/all_anime"):
            x = get_anime_by_status()
            self.wfile.write('{"data":' + x + '}')
            return
        if self.path.startswith("/add_anime_reason"):
            query_components = parse_qs(urlparse(self.path).query)
            print query_components
            x = add_anime_reason(query_components)

        self.wfile.write('{"data":"' + x + '"}')

    def do_HEAD(self):
        self._set_headers()

    def do_POST(self):
        # Doesn't do anything with posted data
        self._set_headers()
        self.wfile.write("<html><body><h1>POST!</h1></body></html>")


def download_anime(query_components):
    suffix = query_components["suffix"]
    customName = query_components["customName"]
    if "season" in query_components:
        season = query_components["season"]
    else:
        season = ""

    r = requests.post("http://localhost:43700/download",
                      data={'anime': suffix, 'customName': customName, 'season': season})
    return str(r.status_code)


def filter_anime_by_status(anime_list, wanted_status):
    if wanted_status == '':
        return anime_list
    return [anime for anime in anime_list if anime.status == wanted_status]


def get_reasons(db, anime_id):
    cursor = db.cursor()
    cursor.execute("SELECT `reason` FROM watching_reasons WHERE `anime_id` = %s" % anime_id)

    rows = cursor.fetchall()
    for row in rows:
        print row[0]

    cursor.close()
    return [row[0] for row in rows]


def add_anime_reason(query_components):
    anime_id = query_components["anime_id"][0]
    reason = query_components["reason"][0]

    print 'Adding reason:', anime_id, reason
    result = "success"

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO `watching_reasons` (`anime_id`, `reason`) VALUES (%s, %s)", (anime_id, reason))
        db.commit()
    except:
        result = "error"
        db.rollback()
    cursor.close()
    db.close()

    return result


def watching_anime():
    return get_anime_by_status('1')


def plan_to_watch_anime():
    return get_anime_by_status('6')


def get_anime_by_status(status=''):
    mal_user = os.environ['MAL_USER']
    global cached_anime_list
    if cached_anime_list == 0:
        cached_anime_list = spice.get_list(spice.get_medium('anime'), mal_user, spice.init_auth(mal_user, os.environ['MAL_PASS']))

    watching_list = filter_anime_by_status(cached_anime_list.get_mediums(), status)

    db = get_db()
    json_watching_list = []
    for anime in watching_list:
        print anime.title.encode('utf-8'), anime.image_url
        json_watching_list.append({
            'id': anime.id,
            'title': anime.title.encode('utf-8'),
            'image_url': anime.image_url,
            'reasons': get_reasons(db, anime.id),
            'status': anime.status
        })

    db.close()
    json_dump = json.dumps(json_watching_list)
    print json_dump
    return json_dump


def get_db():
    db = MySQLdb.connect(host="192.168.2.140",
                         user=os.environ['ANIWATCH_USER'],
                         passwd=os.environ['ANIWATCH_PASS'],
                         db="anime")
    return db


def run(server_class=HTTPServer, handler_class=S, port=7033):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print 'Starting httpd...'
    httpd.serve_forever()


if __name__ == "__main__":
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()
