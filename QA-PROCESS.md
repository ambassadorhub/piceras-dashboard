# QA Process for Code Deployments

## Rule: Never tell Bass "it's done" until ALL checks pass.

## Pre-Deployment Checklist

Before deploying:
- [ ] All files saved correctly
- [ ] No syntax errors in code
- [ ] Environment variables configured
- [ ] Dependencies listed in requirements/package files

## Post-Deployment QA Checklist

After deploying, BEFORE telling Bass it's done:

### 1. DNS Check
```bash
dig [domain] +short
# Must return expected IP
```

### 2. HTTP Status Check
```bash
curl -sI https://[domain] | grep HTTP
# Must return 200 OK
```

### 3. Content Check
```bash
curl -sL https://[domain] | head -20
# Must return actual HTML/content, not error pages
```

### 4. API Health Check
```bash
curl -s https://[domain]/api/health
# Must return {"status": "ok"}
```

### 5. Functional Test (if applicable)
- Test form submissions
- Test API endpoints with sample data
- Test authentication if enabled
- Test mobile responsiveness (curl user-agent)

### 6. SSL Check
```bash
curl -svI https://[domain] 2>&1 | grep "SSL\|TLS"
# Must show TLS 1.2 or 1.3
```

## What to Do If Checks Fail

1. Do NOT tell Bass it's done
2. Debug the issue
3. Fix and redeploy
4. Run checks again
5. Only report success when ALL checks pass

## Reporting Format to Bass

When everything is verified:

```
**Status: VERIFIED LIVE**

**URL:** https://[domain]
**Password:** [if applicable]

**Checks Passed:**
- [x] DNS resolves to [IP]
- [x] HTTPS 200 OK
- [x] Content loads correctly
- [x] API health check passes
- [x] SSL certificate valid

**What to do next:**
[specific instructions]
```

## Tools to Use

- `dig` for DNS
- `curl -sI` for headers
- `curl -sL` for content
- `browser` tool for visual verification if needed

## Note on QA Agent

Previously we had a QA agent for automated browser testing. If needed, spawn a sub-agent with browser access to run visual and functional tests. For now, use curl-based automated checks first, then browser checks for critical deployments.

---
_This process is mandatory for all code deployments._
