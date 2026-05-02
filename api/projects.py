import json
import os

PROJECTS = [
    {"id": "1", "title": "Livefully sponsor licence application", "entity": "livefully", "priority": "p0", "status": "blocked"},
    {"id": "2", "title": "In-House Care dissolution", "entity": "livefully", "priority": "p0", "status": "inprogress"},
    {"id": "3", "title": "AI Tool Guru spam filter deployment", "entity": "buzzkit", "priority": "p0", "status": "inprogress"},
    {"id": "4", "title": "Lexington theme install", "entity": "buzzkit", "priority": "p1", "status": "backlog"},
    {"id": "5", "title": "Unison Healthcare EOR pipeline", "entity": "unison", "priority": "p1", "status": "inprogress"},
    {"id": "6", "title": "Piceras Command Dashboard", "entity": "system", "priority": "p0", "status": "inprogress"}
]

def handler(request):
    method = request.get("method", "GET")
    
    if method == "GET":
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps(PROJECTS)
        }
    
    if method == "POST":
        try:
            body = json.loads(request.get("body", "{}"))
            new_project = {
                "id": str(len(PROJECTS) + 1),
                **body,
                "createdAt": __import__("datetime").datetime.utcnow().isoformat()
            }
            PROJECTS.append(new_project)
            return {
                "statusCode": 201,
                "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
                "body": json.dumps(new_project)
            }
        except Exception as e:
            return {"statusCode": 400, "body": json.dumps({"error": str(e)})}
    
    return {"statusCode": 405, "body": json.dumps({"error": "Method not allowed"})}