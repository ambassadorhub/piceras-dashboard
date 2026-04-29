# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

### Email

- **Tool:** Himalaya CLI (`~/.local/bin/himalaya`)
- **Account:** ambassador.workspace@gmail.com (Gmail) — reinstated by Google 2026-03-24
- **Config:** `~/.config/himalaya/config.toml`
- **Draft script:** `~/workspace/scripts/email_draft.py`
- **Drafts folder:** `~/workspace/drafts/`
- **Rule:** NEVER send without Telegram approval. See SAFETY.md.

### Voice Transcription

- **Tool:** faster-whisper (local, no OpenAI)
- **Script:** `~/workspace/scripts/transcribe.py <audio_file>`
- **Model:** `base` (CPU, int8) — good balance of speed and accuracy
- **Usage:** `python3 ~/workspace/scripts/transcribe.py <path_to_ogg>`

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Model Configuration

### Current Fallback Chain (Updated 2026-04-26)

```
Primary:       ollama/kimi-k2.6:cloud      (strategic reasoning, compliance, long-context)
Fallback 1:    ollama/minimax-m2.7:cloud   (speed, decisiveness, quick tasks)
Fallback 2:    ollama/minimax-m2.5:cloud   (backup speed)
Fallback 3:    ollama/gemma4:31b-cloud    (massive context 256K, deep documents)
Fallback 4:    ollama/mistral:latest      (reliable backup)
```

### When to Use Each Model

| Model | Best For | Use Case |
|---|---|---|
| **Kimi k2.6** (Primary) | Strategic analysis, compliance-heavy work, multi-step reasoning, risk assessment, anything involving CQC/UKVI | Direct chat with Bass |
| **MiniMax m2.7** | Speed, quick lookups, operational tasks, decisive answers | Subagent for fast tasks |
| **MiniMax m2.5** | Backup speed option | Fallback if m2.7 fails |
| **Gemma4 31B** | Massive context (256K), large documents, financial spreadsheets | Deep document analysis |
| **Mistral** | Reliable backup | Emergency fallback |

### How Routing Works

- **Default:** All direct chat uses Kimi k2.6 (primary)
- **Subagents:** I spawn subagents with the right model for the task:
  ```
  sessions_spawn(task="...", model="ollama/minimax-m2.7:cloud")
  sessions_spawn(task="...", model="ollama/gemma4:31b-cloud")
  ```
- **Fallbacks:** If primary fails, OpenClaw auto-tries Fallback 1, then 2, etc.
- **All cloud:** No local load on ThinkPad. Models run via Ollama cloud.

### Key Points

- Kimi stays primary. I make judgment calls on when to delegate to other models.
- "Co-primary" isn't supported by OpenClaw. One primary, ordered fallbacks.
- If latency becomes an issue with Kimi, spawn a MiniMax subagent for the heavy lifting.
- Config lives in `/home/bass/.openclaw/openclaw.json`. Restart required after changes.

---

Add whatever helps you do your job. This is your cheat sheet.
