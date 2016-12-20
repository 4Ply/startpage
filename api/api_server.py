#!/usr/bin/python2.7

from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import SocketServer
from subprocess import check_output
from urlparse import urlparse, parse_qs
import requests


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

    r = requests.post("http://localhost:43700/download", data={'anime': suffix, 'customName': customName, 'season': season})
    return str(r.status_code)


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
