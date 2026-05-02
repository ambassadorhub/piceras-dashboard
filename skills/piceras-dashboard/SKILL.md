---
name: piceras-dashboard
description: Build, deploy, and manage the Piceras Group central command dashboard. A unified web interface showing all agents, skills, projects, token usage, and integrated Telegram chat. Use when: (1) deploying or updating the Piceras dashboard, (2) adding new dashboard modules or features, (3) troubleshooting dashboard connectivity, (4) configuring Telegram bot integration, (5) managing dashboard authentication or hosting settings.
---

# Piceras Dashboard

The central command interface for Piceras Group. A single URL where Bass can see everything and do anything.

## Architecture

**Frontend:** Static HTML/CSS/JS (no framework dependency, loads fast on mobile)
**Hosting:** Vercel (same as AI Tool Guru, familiar deployment)
**Domain:** hub.picerasgroup.com
**Backend:** OpenClaw gateway APIs + Telegram Bot API (client-side where possible)
**Authentication:** Simple token-based gate (configurable, see references/auth.md)

## Dashboard Modules

### 1. Agent Command Centre
- Live status of all agents (Ollie, Quinn, Nova, future agents)
- Current task / last activity
- Health indicator (green/yellow/red)
- Quick action: spawn new agent session

### 2. Skills Inventory
- All available skills with descriptions
- Search/filter by category
- One-click trigger (sends command to OpenClaw)

### 3. Project Hub
- Active projects across all Piceras entities
- Kanban-style status (Not Started / In Progress / Blocked / Done)
- Pulls from workspace project boards
- Priority flagging (P0/P1/P2)

### 4. Usage & Credits
- Token consumption by model/platform
- Session count and duration
- Estimated cost tracking
- Visual charts (lightweight Chart.js)

### 5. Communication Centre
- **Telegram Panel:** Send/receive Telegram messages directly
- **OpenClaw Chat:** Embedded chat interface to talk to agents
- Message history for both channels

## Files

- `assets/dashboard/index.html` - Main dashboard UI
- `assets/dashboard/styles.css` - Styling (dark theme, mobile-first)
- `assets/dashboard/app.js` - Frontend logic and API calls
- `scripts/deploy.sh` - Deploy to Vercel
- `references/architecture.md` - Full technical architecture
- `references/auth.md` - Authentication setup guide

## Deployment

```bash
bash scripts/deploy.sh
```

Requires Vercel CLI authenticated. Builds static assets and deploys to hub.picerasgroup.com.

## Configuration

Edit `assets/dashboard/config.js` to set:
- `TELEGRAM_BOT_TOKEN` - For Telegram integration
- `OPENCLAW_API_URL` - Gateway endpoint (default: current host)
- `DASHBOARD_AUTH_TOKEN` - Simple auth passphrase

## Security Notes

- Token is client-side for Telegram API (Bot API is designed for this, token is revokable)
- Add basic auth gate before exposing sensitive business data
- Consider IP allowlisting for additional security
- Never commit config.js with real tokens to public repos

## Future Modules (Backlog)

- Livefully compliance tracker (CQC/UKVI deadlines)
- Financial KPI snapshot (revenue, costs, net worth progress)
- Calendar integration (upcoming events)
- Email quick-view (via Himalaya CLI bridge)
- Voice command interface (push-to-talk)
