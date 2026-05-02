# Session State — 2 May 2026, 14:58

## What We Just Did

1. Downloaded Carbon theme ZIP from Polar (84.5 MB)
2. Installed and customized the theme for AI Tool Guru:
   - Replaced Lexington branding with "AI Tool Guru"
   - Changed color scheme to amber/orange accent (psychologically proven for conversion)
   - Replaced demo "sites" content with AI tool listings (ChatGPT, Claude, Jasper, Copy.ai, Semrush)
   - Added comprehensive blog content from existing site (small business, healthcare, recruitment, writing, newsletter)
   - Migrated SendGrid contact form and ConvertKit newsletter subscribe API endpoints
   - Updated navigation: Home, AI Tools, Reviews, Advertise
   - Added prominent "Visit Site" and "Get Started Now" affiliate CTAs on tool detail pages
   - Updated SEO metadata for AI Tool Guru branding
3. **Deployed successfully to aitoolguru.co.uk via GitHub &gt; Vercel**
   - Correct workflow: push to GitHub repo ambassadorhub/aitoolguru, Vercel auto-deploys
   - Confirmed: site is live at https://aitoolguru.co.uk with Carbon theme
   - SEO metadata now shows "AI Tool Guru" correctly

## What's Open / In Progress

- [ ] **Add tool screenshots** — currently showing placeholder boxes. Need actual screenshots added to /src/images/sites/
- [ ] **Add affiliate links** to tool detail pages (currently just linking to main sites)
- [ ] **Add affiliate disclosure** footer to all pages
- [ ] **Set environment variables** in Vercel dashboard (SENDGRID_API_KEY, CONVERTKIT_API_SECRET)
- [ ] **Test contact form and newsletter signup** once env vars are set

## What's Next

1. Add tool screenshots — I need to search for high-quality official screenshots or Bass can provide them
2. Configure affiliate links (need Bass's actual affiliate URLs)
3. Set environment variables in Vercel dashboard
4. Test all functionality end-to-end

---

## Piceras Command Dashboard

### Status: LIVE AND WORKING

**Live URL:** https://hub.picerasgroup.com
**GitHub Repo:** https://github.com/ambassadorhub/piceras-dashboard
**Vercel Project:** ambassadorhubs-projects/deploy

### What's Done
- Restructured code for Vercel serverless Python functions
- Created GitHub repo ambassadorhub/piceras-dashboard
- Connected Vercel auto-deploy from GitHub
- Added environment variables: TELEGRAM_BOT_TOKEN, DASHBOARD_AUTH_PASSWORD
- Set custom domain: hub.picerasgroup.com
- **Vercel Deployment Protection disabled**
- **DNS A record added in Namecheap** (hub -> 76.76.21.21, TTL: 30 minutes)
- **DNS propagated** (resolves to 76.76.21.21)
- **SSL certificate issued**
- **Dashboard is live and accessible**

### Test Results
- [x] DNS resolves correctly
- [x] HTTPS working
- [x] Dashboard HTML loads
- [x] API endpoints accessible

### Next Steps
1. Test on your phone: https://hub.picerasgroup.com
2. Enter password: `piceras2026command`
3. Test each section (Agents, Skills, Projects, Usage, Telegram, OpenClaw)
4. Bookmark or "Add to Home Screen" for app-like experience
5. Report any issues or changes needed

### Files
- Local: ~/openclaw/skills/piceras-dashboard/deploy/
- DEPLOYMENT.md: ~/openclaw/skills/piceras-dashboard/DEPLOYMENT.md

## Notes

- Deployment workflow: GitHub &gt; Vercel (Bass's account). Push to ambassadorhub/aitoolguru repo, Vercel auto-deploys.
- Old site is fully replaced. aitoolguru.co.uk now serves Carbon theme.
- Individual tool detail pages may show auth required on preview URLs but work fine on custom domain.
- All changes committed to GitHub repo.
- SEO metadata confirmed working: title="AI Tool Guru", description="Honest AI Tool Reviews for UK Small Businesses"

## Quick Links

- **Live site:** https://aitoolguru.co.uk
- **GitHub repo:** https://github.com/ambassadorhub/aitoolguru
- **Project files:** /home/bass/.openclaw/workspace/aitoolguru-site
