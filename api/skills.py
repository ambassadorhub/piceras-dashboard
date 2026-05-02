from http.server import BaseHTTPRequestHandler
import json

SKILLS = [
    {"name": "piceras-dashboard", "description": "Central command dashboard for all Piceras operations", "category": "system", "triggers": 12},
    {"name": "gh-issues", "description": "GitHub issue automation and PR management", "category": "coding", "triggers": 45},
    {"name": "coding-agent", "description": "Delegate coding tasks to specialised agents", "category": "coding", "triggers": 78},
    {"name": "nano-banana-pro", "description": "Generate/edit images with Gemini", "category": "content", "triggers": 23},
    {"name": "weather", "description": "Current weather and forecasts", "category": "content", "triggers": 156},
    {"name": "skill-creator", "description": "Create and audit OpenClaw skills", "category": "system", "triggers": 8},
    {"name": "video-frames", "description": "Extract frames from videos", "category": "content", "triggers": 34},
    {"name": "github", "description": "GitHub CLI operations", "category": "coding", "triggers": 67},
    {"name": "node-connect", "description": "Diagnose node pairing failures", "category": "system", "triggers": 12}
]

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(SKILLS).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()