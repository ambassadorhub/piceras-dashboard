from http.server import BaseHTTPRequestHandler
import json

AGENTS = [
    {"id": "ollie", "name": "Ollie", "role": "CEO / Chief of Staff", "status": "online", "currentTask": "Dashboard build", "model": "ollama/kimi-k2.6:cloud", "avatar": "&#129417;"},
    {"id": "quinn", "name": "Quinn", "role": "Content Director", "status": "online", "currentTask": "AI Tool Guru pipeline", "model": "ollama/minimax-m2.7:cloud", "avatar": "&#128220;"},
    {"id": "nova", "name": "Nova", "role": "Growth Marketer", "status": "idle", "currentTask": "Newsletter draft ready", "model": "ollama/minimax-m2.7:cloud", "avatar": "&#128240;"},
    {"id": "ralph", "name": "Ralph", "role": "Lead Developer", "status": "idle", "currentTask": "Awaiting assignment", "model": "ollama/minimax-m2.7:cloud", "avatar": "&#128187;"},
    {"id": "archie", "name": "Archie", "role": "Technical Architect", "status": "idle", "currentTask": "Awaiting assignment", "model": "ollama/kimi-k2.6:cloud", "avatar": "&#127959;"},
    {"id": "sage", "name": "Sage", "role": "Research Analyst", "status": "idle", "currentTask": "Awaiting assignment", "model": "ollama/gemma4:31b-cloud", "avatar": "&#128269;"},
    {"id": "vera", "name": "Vera", "role": "Compliance Officer", "status": "online", "currentTask": "CQC oversight", "model": "ollama/kimi-k2.6:cloud", "avatar": "&#128737;"},
    {"id": "iris", "name": "Iris", "role": "Finance & Deals", "status": "idle", "currentTask": "Awaiting assignment", "model": "ollama/gemma4:31b-cloud", "avatar": "&#128176;"},
    {"id": "tess", "name": "Tess", "role": "QA Lead", "status": "idle", "currentTask": "Awaiting deployment", "model": "browser-tool", "avatar": "&#128270;"},
    {"id": "max", "name": "Max", "role": "Operations Manager", "status": "idle", "currentTask": "Awaiting assignment", "model": "ollama/minimax-m2.7:cloud", "avatar": "&#9881;"}
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