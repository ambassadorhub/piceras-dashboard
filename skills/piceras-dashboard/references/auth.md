# Dashboard Authentication Setup

## Current Setup: Simple Token Gate

The dashboard uses a lightweight password prompt before revealing any content.

### How It Works
1. User loads hub.picerasgroup.com
2. Full-screen overlay prompts for access token
3. Token verified against `config.js` `DASHBOARD_AUTH_TOKEN`
4. On success: overlay fades, dashboard loads
5. On fail: shake animation, retry

### Setting the Token

Edit `assets/dashboard/js/config.js`:

```javascript
const CONFIG = {
    DASHBOARD_AUTH_TOKEN: 'your-secret-passphrase-here',
    TELEGRAM_BOT_TOKEN: '8753183278:AAEKwl3RHhg8sj3uD7u6vemeaWkXlH4b0KA',
    OPENCLAW_API_URL: 'https://openclaw.picerasgroup.com',
    // ... other config
};
```

**Recommended token format:** 4+ random words or a passphrase you remember.
Example: `bass-ollie-2026-command`

### Vercel Password Protection (Alternative)

If you prefer Vercel-native auth:

1. Go to Vercel Dashboard -> Project Settings -> Deployment Protection
2. Enable "Vercel Authentication" or "Password Protection"
3. Set a password
4. No code changes needed

### IP Allowlisting (Advanced)

For maximum security, restrict by IP:

Create `vercel.json`:
```json
{
  "middleware": [
    {
      "source": "/(.*)",
      "function": "middleware"
    }
  ]
}
```

Then `middleware.js`:
```javascript
export default function middleware(request) {
    const allowedIPs = ['YOUR_HOME_IP', 'YOUR_MOBILE_IP'];
    const clientIP = request.ip || request.headers.get('x-forwarded-for');
    
    if (!allowedIPs.includes(clientIP)) {
        return new Response('Unauthorized', { status: 403 });
    }
}
```

## Rotating the Telegram Bot Token

If the token is ever compromised:

1. Message @BotFather on Telegram
2. Send `/revoke`
3. Select your bot
4. BotFather issues new token
5. Update `config.js` and redeploy

## Security Checklist

- [ ] Token is not committed to public GitHub repo
- [ ] Domain uses HTTPS (Vercel provides this)
- [ ] Dashboard is behind at least one auth layer
- [ ] Bot token is revocable and has no admin privileges
- [ ] No sensitive data in browser localStorage/sessionStorage
- [ ] CSP headers configured in Vercel
