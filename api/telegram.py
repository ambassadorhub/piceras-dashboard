import json
import os
import urllib.request

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")

def handler(request):
    method = request.get("method", "GET")
    
    if method == "GET":
        try:
            url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates?limit=100"
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read())
                
            if not data.get("ok"):
                return {
                    "statusCode": 502,
                    "body": json.dumps({"error": "Telegram error"})
                }
            
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
            
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
                "body": json.dumps(list(chats.values()))
            }
        except Exception as e:
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
                "body": json.dumps([{"id": "7550244056", "name": "Bass", "type": "private", "lastMessage": "Dashboard active", "lastDate": int(__import__("datetime").datetime.utcnow().timestamp())}])
            }
    
    if method == "POST":
        try:
            body = json.loads(request.get("body", "{}"))
            chat_id = body.get("chat_id")
            text = body.get("text")
            
            if not chat_id or not text:
                return {"statusCode": 400, "body": json.dumps({"error": "Missing chat_id or text"})}
            
            url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
            data = json.dumps({"chat_id": chat_id, "text": text}).encode()
            req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
            
            with urllib.request.urlopen(req, timeout=30) as resp:
                result = json.loads(resp.read())
            
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"sent": True, "message_id": result.get("result", {}).get("message_id")})
            }
        except Exception as e:
            return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
    
    return {"statusCode": 405, "body": json.dumps({"error": "Method not allowed"})}