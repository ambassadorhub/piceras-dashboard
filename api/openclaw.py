from http.server import BaseHTTPRequestHandler
import json
import os

OPENCLAW_API_URL = os.getenv("OPENCLAW_API_URL", "http://localhost:8080")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        data = {
            "sessions": [
                {"id": "main", "agent": "ollie", "status": "active"},
                {"id": "quinn-1", "agent": "quinn", "status": "active"},
                {"id": "nova-1", "agent": "nova", "status": "idle"}
            ]
        }
        self.wfile.write(json.dumps(data).encode())

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        try:
            data = json.loads(body)
            agent = data.get("agent", "ollie")
            message = data.get("message", "")
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {
                "response": f"Agent {agent} received: '{message}'. (OpenClaw proxy not yet connected)",
                "agent": agent
            }
            self.wfile.write(json.dumps(response).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()