#!/usr/bin/env python3
"""
Email draft management for Ollie.
Creates a draft file and returns its ID for approval tracking.

Usage: python3 email_draft.py create <to> <subject> <body>
       python3 email_draft.py list
       python3 email_draft.py send <draft_id>
       python3 email_draft.py discard <draft_id>
"""

import sys
import os
import json
import uuid
from datetime import datetime

DRAFTS_DIR = os.path.expanduser("~/.openclaw/workspace/drafts")

def create_draft(to, subject, body):
    draft_id = str(uuid.uuid4())[:8]
    draft = {
        "id": draft_id,
        "to": to,
        "subject": subject,
        "body": body,
        "created_at": datetime.utcnow().isoformat(),
        "status": "pending"
    }
    path = os.path.join(DRAFTS_DIR, f"{draft_id}.json")
    with open(path, "w") as f:
        json.dump(draft, f, indent=2)
    print(draft_id)

def list_drafts():
    drafts = []
    for f in os.listdir(DRAFTS_DIR):
        if f.endswith(".json"):
            with open(os.path.join(DRAFTS_DIR, f)) as fh:
                d = json.load(fh)
                if d.get("status") == "pending":
                    drafts.append(d)
    print(json.dumps(drafts, indent=2))

def send_draft(draft_id):
    path = os.path.join(DRAFTS_DIR, f"{draft_id}.json")
    with open(path) as f:
        draft = json.load(f)
    
    # Build email and send via himalaya
    eml = f"""To: {draft['to']}
Subject: {draft['subject']}
Content-Type: text/plain; charset=utf-8

{draft['body']}"""
    
    import subprocess
    result = subprocess.run(
        [os.path.expanduser("~/.local/bin/himalaya"), "message", "send"],
        input=eml.encode(),
        capture_output=True
    )
    
    if result.returncode == 0:
        draft["status"] = "sent"
        draft["sent_at"] = datetime.utcnow().isoformat()
        with open(path, "w") as f:
            json.dump(draft, f, indent=2)
        print(f"Sent: {draft['subject']} → {draft['to']}")
    else:
        print(f"Error: {result.stderr.decode()}")
        sys.exit(1)

def discard_draft(draft_id):
    path = os.path.join(DRAFTS_DIR, f"{draft_id}.json")
    with open(path) as f:
        draft = json.load(f)
    draft["status"] = "discarded"
    with open(path, "w") as f:
        json.dump(draft, f, indent=2)
    print(f"Discarded draft {draft_id}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    
    cmd = sys.argv[1]
    if cmd == "create" and len(sys.argv) == 5:
        create_draft(sys.argv[2], sys.argv[3], sys.argv[4])
    elif cmd == "list":
        list_drafts()
    elif cmd == "send" and len(sys.argv) == 3:
        send_draft(sys.argv[2])
    elif cmd == "discard" and len(sys.argv) == 3:
        discard_draft(sys.argv[2])
    else:
        print(__doc__)
        sys.exit(1)
