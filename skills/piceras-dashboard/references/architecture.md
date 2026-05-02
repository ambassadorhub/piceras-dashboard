# Piceras Dashboard - Technical Architecture

## Overview
Single-page application (SPA), static files only. No server-side runtime required.

## Stack
- **Frontend:** Vanilla HTML5, CSS3, ES6+ (no build step)
- **Styling:** Custom CSS variables for theming, mobile-first responsive
- **Charts:** Chart.js (CDN, lightweight)
- **Icons:** Phosphor Icons or Heroicons (CDN)
- **Hosting:** Vercel Edge Network (global CDN)
- **DNS:** A record or CNAME pointing to Vercel

## Data Flow

```
User Browser
    |
    v
Dashboard SPA (hub.picerasgroup.com)
    |
    |---> Telegram Bot API (HTTPS) ---> Telegram
    |
    |---> OpenClaw Gateway API (WS/HTTP) ---> OpenClaw
    |
    |---> Static JSON files (project data, cached)
```

## API Integrations

### Telegram Bot API
- Endpoint: `https://api.telegram.org/bot<TOKEN>/`
- Methods: `getUpdates`, `sendMessage`, `getChat`
- Polling: Client-side long-polling every 5 seconds
- Security: Token is embedded in client JS (acceptable for Bot API)

### OpenClaw Gateway
- Status endpoint: `/api/status` or similar (check gateway docs)
- Session listing: requires gateway API access
- Token usage: parsed from gateway logs or metrics endpoint

### Project Data
- Source: `~/workspace/projects/` JSON files
- Updated: Manual refresh or file watcher
- Format: Simple JSON with project name, status, priority, last-updated

## Authentication Options

### Option A: Simple Token Gate (Default)
- Password prompt on first load
- Token stored in sessionStorage
- Configured via `config.js`

### Option B: Vercel Password Protection
- Built-in Vercel feature
- No code changes needed
- Set in Vercel dashboard

### Option C: IP Allowlisting
- Vercel Edge Config or middleware
- Restrict to Bass's known IPs

## File Structure (Deployed)

```
/
├── index.html          # Main entry point
├── css/
│   └── styles.css      # All styling
├── js/
│   ├── app.js          # Main application logic
│   ├── config.js       # Configuration (tokens, URLs)
│   ├── telegram.js     # Telegram API wrapper
│   ├── openclaw.js     # OpenClaw API wrapper
│   └── charts.js       # Chart.js initialization
├── data/
│   └── projects.json   # Cached project data
└── icons/              # Phosphor/Heroicon SVGs
```

## Performance Targets
- First paint: < 1s on 4G
- Interactive: < 2s
- Works offline (service worker optional v2)
- Mobile viewport optimised

## Security Considerations
- All API calls over HTTPS only
- Bot token revocable via @BotFather
- No sensitive business data in localStorage
- CSP headers set in Vercel config
- No third-party tracking scripts
