from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates?limit=100"
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read())
            
            if not data.get("ok"):
                self.send_response(502)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Telegram error"}).encode())
                return
            
            chats = {}
            for update in data.get("result", []):
                msg = update.get("message") or update.get("edited_message")
                if not msg:
                    continue
                chat = msg["chat"]
                chat_id = str(chat["id"])
                if chat_id not in chats:
                    chats[chat_id] = {
                        "id": chat_id,
                        "name": chat.get("title") or chat.get("first_name", "Unknown"),
                        "type": chat.get("type", "private"),
                        "lastMessage": (msg.get("text", "") or "")[:50],
                        "lastDate": msg.get("date", 0)
                    }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(list(chats.values())).encode())
        except Exception as e:
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps([{
                "id": "7550244056",
                "name": "Bass",
                "type": "private",
                "lastMessage": "Dashboard active",
                "lastDate": int(datetime.utcnow().timestamp())
            }]).encode())

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        try:
            data = json.loads(body)
            chat_id = data.get("chat_id")
            text = data.get("text")
            
            if not chat_id or not text:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Missing chat_id or text"}).encode())
                return
            
            url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
            post_data = json.dumps({"chat_id": chat_id, "text": text}).encode()
            req = urllib.request.Request(url, data=post_data, headers={"Content-Type": "application/json"})
            
            with urllib.request.urlopen(req, timeout=30) as resp:
                result = json.loads(resp.read())
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"sent": True, "message_id": result.get("result", {}).get("message_id")}).encode())
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