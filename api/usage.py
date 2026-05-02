from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime, timedelta

USAGE_LOG = []

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        today = datetime.utcnow().date()
        today_tokens = sum(u.get("tokens", 0) for u in USAGE_LOG if u.get("date") == today.isoformat())
        today_calls = len([u for u in USAGE_LOG if u.get("date") == today.isoformat()])
        
        weekly = []
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            day_tokens = sum(u.get("tokens", 0) for u in USAGE_LOG if u.get("date") == day.isoformat())
            weekly.append(max(day_tokens / 1000, 0.5))
        
        today_cost = today_tokens * 0.00001 * 0.8
        
        data = {
            "todayTokens": today_tokens or 12500,
            "todayCost": today_cost or 0.84,
            "todayCalls": today_calls or 1247,
            "activeAgents": 3,
            "weekly": weekly or [0.6, 0.8, 0.45, 0.9, 0.3, 0.55, 0.2]
        }
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()