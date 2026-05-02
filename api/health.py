import json
import os
from http.server import BaseHTTPRequestHandler

def handler(request):
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        "body": json.dumps({
            "status": "ok",
            "telegram_configured": bool(os.getenv("TELEGRAM_BOT_TOKEN")),
            "timestamp": __import__("datetime").datetime.utcnow().isoformat()
        })
    }