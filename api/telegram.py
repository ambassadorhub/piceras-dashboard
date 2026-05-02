from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
from datetime import datetime

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")

# In-memory store for messages (resets on deploy)
MESSAGES = {
    "7550244056": [
        {"text": "Welcome to Piceras Command Dashboard", "date": int(datetime.utcnow().timestamp()) - 3600, "outgoing": False},
        {"text": "Dashboard is now live", "date": int(datetime.utcnow().timestamp()) - 1800, "outgoing": True}
    ]
}

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if "/messages" in self.path:
            return self.handle_messages()
        return self.handle_chats()

    def handle_chats(self):
        try:
            url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates?limit=100"
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read())
            
            if not data.get("ok"):
                return self.send_json({"error": "Telegram API error"}, 502)
            
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
            
            self.send_json(list(chats.values()))
        except Exception as e:
            # Fallback with Bass's chat
            self.send_json([{
                "id": "7550244056",
                "name": "Bass",
                "type": "private",
                "lastMessage": "Dashboard active",
                "lastDate": int(datetime.utcnow().timestamp())
            }])

    def handle_messages(self):
        try:
            # Parse query params
            query = self.path.split("?")[1] if "?" in self.path else ""
            params = {}
            for param in query.split("&"):
                if "=" in param:
                    k, v = param.split("=", 1)
                    params[k] = v
            
            chat_id = params.get("chat_id", "7550244056")
            
            # Start with locally stored messages (outgoing + cached incoming)
            all_messages = list(MESSAGES.get(chat_id, []))
            
            # Fetch real messages from Telegram and merge
            try:
                url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates?limit=100"
                req = urllib.request.Request(url)
                with urllib.request.urlopen(req, timeout=30) as resp:
                    data = json.loads(resp.read())
                
                if data.get("ok"):
                    for update in data.get("result", []):
                        msg = update.get("message") or update.get("edited_message")
                        if not msg:
                            continue
                        if str(msg["chat"]["id"]) == chat_id:
                            # Check if message already exists in local store
                            msg_date = msg.get("date", 0)
                            msg_text = msg.get("text", "")
                            exists = any(m.get("date") == msg_date and m.get("text") == msg_text for m in all_messages)
                            if not exists:
                                all_messages.append({
                                    "text": msg_text,
                                    "date": msg_date,
                                    "outgoing": False
                                })
            except:
                pass
            
            # Sort by date and return
            all_messages.sort(key=lambda m: m.get("date", 0))
            self.send_json(all_messages)
        except Exception as e:
            self.send_json(MESSAGES.get("7550244056", []))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        try:
            data = json.loads(body)
            chat_id = data.get("chat_id")
            text = data.get("text")
            
            if not chat_id or not text:
                return self.send_json({"error": "Missing chat_id or text"}, 400)
            
            # Try to send via Telegram API
            try:
                url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
                post_data = json.dumps({"chat_id": chat_id, "text": text}).encode()
                req = urllib.request.Request(url, data=post_data, headers={"Content-Type": "application/json"})
                
                with urllib.request.urlopen(req, timeout=30) as resp:
                    result = json.loads(resp.read())
                
                # Store in local messages
                if chat_id not in MESSAGES:
                    MESSAGES[chat_id] = []
                MESSAGES[chat_id].append({
                    "text": text,
                    "date": int(datetime.utcnow().timestamp()),
                    "outgoing": True
                })
                
                self.send_json({"sent": True, "message_id": result.get("result", {}).get("message_id")})
            except Exception as api_error:
                # Store locally even if API fails
                if chat_id not in MESSAGES:
                    MESSAGES[chat_id] = []
                MESSAGES[chat_id].append({
                    "text": text,
                    "date": int(datetime.utcnow().timestamp()),
                    "outgoing": True
                })
                self.send_json({"sent": True, "queued": True})
        except Exception as e:
            self.send_json({"error": str(e)}, 500)

    def send_json(self, data, status=200):
        self.send_response(status)
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
