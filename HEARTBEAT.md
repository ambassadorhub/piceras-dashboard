# HEARTBEAT.md — Active Checks

## Morning Checklist (Run when heartbeat fires 08:00-12:00)
1. Read `session-state.md` — what's open, what's next
2. Read `memory/YYYY-MM-DD.md` (today) — what happened today so far
3. Check active project boards for blocked items
4. If anything urgent or blocked > 2 days, alert Bass

## Midday Checklist (Run when heartbeat fires 12:00-18:00)
1. Read `session-state.md`
2. Check if any cron jobs failed (look at cron status)
3. Check AI Tool Guru site is responding (curl)
4. If anything needs attention, alert Bass

## Evening Checklist (Run when heartbeat fires 18:00-23:00)
1. Read `session-state.md`
2. Update `session-state.md` with any new open items from today
3. Write end-of-session summary if Bass is done for the day

## Auto-Write Session State
Before going quiet for >30 min, write to `session-state.md`:
- What we just did
- What's open / in progress
- What I need to do next
- Decisions made

## Memory Maintenance (Every 3-4 days)
1. Read recent `memory/YYYY-MM-DD.md` files
2. Update `MEMORY.md` with anything significant
3. Remove outdated info

---
_If nothing needs attention, reply HEARTBEAT_OK_
