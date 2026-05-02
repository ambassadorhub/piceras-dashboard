from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime

PROJECTS = [
    {"id": "1", "title": "Livefully sponsor licence application", "entity": "livefully", "priority": "p0", "status": "blocked"},
    {"id": "2", "title": "In-House Care dissolution", "entity": "livefully", "priority": "p0", "status": "inprogress"},
    {"id": "3", "title": "AI Tool Guru spam filter deployment", "entity": "buzzkit", "priority": "p0", "status": "inprogress"},
    {"id": "4", "title": "Lexington theme install", "entity": "buzzkit", "priority": "p1", "status": "backlog"},
    {"id": "5", "title": "Unison Healthcare EOR pipeline", "entity": "unison", "priority": "p1", "status": "inprogress"},
    {"id": "6", "title": "Piceras Command Dashboard", "entity": "system", "priority": "p0", "status": "inprogress"}
]

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(PROJECTS).encode())

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        try:
            data = json.loads(body)
            new_project = {
                "id": str(len(PROJECTS) + 1),
                **data,
                "createdAt": datetime.utcnow().isoformat()
            }
            PROJECTS.append(new_project)
            self.send_response(201)
        except Exception as e:
            self.send_response(400)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()