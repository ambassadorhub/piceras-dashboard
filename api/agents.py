from http.server import BaseHTTPRequestHandler
import json

AGENTS = [
    {"id": "ollie", "name": "Ollie", "role": "Strategic Partner", "status": "online", "currentTask": "Dashboard build", "model": "ollama/kimi-k2.6:cloud", "avatar": "&#129417;"},
    {"id": "quinn", "name": "Quinn", "role": "Content Lead", "status": "online", "currentTask": "AI Tool Guru pipeline", "model": "ollama/minimax-m2.7:cloud", "avatar": "&#128220;"},
    {"id": "nova", "name": "Nova", "role": "Newsletter Curator", "status": "idle", "currentTask": "Newsletter draft ready", "model": "ollama/gemma4:31b-cloud", "avatar": "&#128240;"},
    {"id": "tess", "name": "Tess", "role": "QA Agent", "status": "idle", "currentTask": "Awaiting deployment", "model": "browser-tool", "avatar": "&#128270;"}
]

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(AGENTS).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()