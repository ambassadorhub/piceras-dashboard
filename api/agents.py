import json
import os
from http.server import BaseHTTPRequestHandler

AGENTS = [
    {"id": "ollie", "name": "Ollie", "role": "Strategic Partner", "status": "online", "currentTask": "Dashboard build", "model": "ollama/kimi-k2.6:cloud", "avatar": "&#129417;"},
    {"id": "quinn", "name": "Quinn", "role": "Content Lead", "status": "online", "currentTask": "AI Tool Guru pipeline", "model": "ollama/minimax-m2.7:cloud", "avatar": "&#128220;"},
    {"id": "nova", "name": "Nova", "role": "Newsletter Curator", "status": "idle", "currentTask": "Newsletter draft ready", "model": "ollama/gemma4:31b-cloud", "avatar": "&#128240;"}
]

def handler(request):
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        "body": json.dumps(AGENTS)
    }