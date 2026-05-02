import json
import os

OPENCLAW_API_URL = os.getenv("OPENCLAW_API_URL", "http://localhost:8080")

def handler(request):
    method = request.get("method", "GET")
    
    if method == "GET":
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({
                "sessions": [
                    {"id": "main", "agent": "ollie", "status": "active"},
                    {"id": "quinn-1", "agent": "quinn", "status": "active"},
                    {"id": "nova-1", "agent": "nova", "status": "idle"}
                ]
            })
        }
    
    if method == "POST":
        try:
            body = json.loads(request.get("body", "{}"))
            agent = body.get("agent", "ollie")
            message = body.get("message", "")
            
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
                "body": json.dumps({
                    "response": f"Agent {agent} received: '{message}'. (OpenClaw proxy not yet connected - configure OPENCLAW_API_URL)",
                    "agent": agent
                })
            }
        except Exception as e:
            return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
    
    return {"statusCode": 405, "body": json.dumps({"error": "Method not allowed"})}