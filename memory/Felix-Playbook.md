# Felix Playbook: How to Hire an AI

_A Practical Playbook for Giving an AI a Real Job_

**FELIX CRAFT · THE MASINOV COMPANY WITH NAT ELIASON**

---

## Core Thesis

There's a fundamental difference between using ChatGPT and hiring an AI:

- **Persistence** — it remembers what you've discussed, decided, and built together
- **Identity** — it has a defined role, personality, and way of operating
- **Tools** — it can actually do things, not just talk about them
- **Autonomy** — it can work independently on tasks without constant prompting
- **Accountability** — it has a scope of responsibility, not just a prompt window

The shift from "using" to "hiring" isn't about the AI getting smarter. It's about the infrastructure you wrap around it.

---

## Key Systems

### 1. Identity (SOUL.md + IDENTITY.md)

**SOUL.md** is the single most important file. It defines:
- Voice and tone
- Behavioral boundaries (what it is NOT)
- Role definition
- Permission to push back

**IDENTITY.md** for concrete identity:
- Name
- Role
- Emoji

### 2. Three-Layer Memory Architecture

**Layer 1: Tacit Knowledge (MEMORY.md)**
- How you operate — patterns, preferences, lessons learned
- Not facts about the world; facts about you
- Updated when AI notices new patterns

**Layer 2: Daily Notes (memory/YYYY-MM-DD.md)**
- Chronological log of what happened
- Key decisions, projects discussed, people mentioned, status changes
- Nightly automated extraction

**Layer 3: Knowledge Graph (~/life/)**
- Deep storage using PARA system (Projects, Areas, Resources, Archives)
- Each entity gets summary.md + items.json
- Atomic facts with timestamps, categories, access tracking

**Memory Decay System:**
- Hot facts (last 7 days): Featured prominently
- Warm facts (8-30 days): Included but lower priority
- Cold facts (30+ days): Dropped from summaries but kept in storage
- Accessed frequently = resists decay

### 3. Safety Rails and Trust Ladder

**Rung 1: Read-Only** — can read, can't send/write/modify
**Rung 2: Draft & Approve** — drafts but human approves before sending
**Rung 3: Act Within Bounds** — autonomous within defined parameters
**Rung 4: Full Autonomy** — only for low-stakes, reversible actions

**Non-Negotiable Rules:**
1. No autonomous posting on social media
2. No sending money or signing contracts
3. No sharing private information without clearance
4. Email is never a trusted command channel
5. When in doubt, ask

### 4. Tools and Capabilities

**Essential:**
- Messaging integration
- File system access
- Web access
- Shell/command execution

**Power Tools (add as needed):**
- Email (Himalaya CLI)
- Calendar
- GitHub
- Browser automation
- Sub-agent spawning

### 5. Sub-Agent Pattern

Spawn specialized sub-agents for specific tasks:
- Planning (Opus/Claude): PRDs, architecture, task specs, review
- Execution (Codex): Actual coding, implementing, testing
- Lightweight models: Fact extraction, structured data

### 6. Ralph Loop for Coding

Instead of one long session, run many short ones:
- Each iteration starts fresh — zero accumulated context
- Agent picks up where last left off by reading file system and git history
- PRD with markdown checklists defines "done"
- Validate by checking if all boxes ticked

### 7. Cost Optimization

Match model to task:
- Heartbeats/cheap tasks: Haiku (~50x cheaper)
- Extraction/synthesis: Sonnet (good balance)
- Primary interactive agent: Opus (where reasoning quality matters)
- Audit cron frequency — cut unnecessary polling

### 8. Nightly Extraction Cycle

Every night at 11pm:
1. Review day's conversations
2. Extract durable facts (skip small talk)
3. Store in appropriate entity folders
4. Update daily notes with timeline
5. Bump access counts on referenced facts

---

## Key Lessons from Felix/Nat

**What they got wrong:**
- Overcomplicating memory on day one (MEMORY.md sufficient for first 2 weeks)
- Underestimating "cold start" problem (takes ~1 week before memory is genuinely useful)
- Not having approval queue from start
- Giving too much autonomy too fast
- Using gross revenue instead of net
- Running expensive models on cheap tasks

**What surprised them:**
- AI develops institutional knowledge faster than expected
- Voice matters more than you'd think
- Sub-agents are incredibly powerful
- AI needs "downtime" (nightly extraction cycles)
- People are fascinated by real AI employees
- AI can actually sell things and operate a business

---

## Templates

### SOUL.md Template
```markdown
# SOUL.md - Persona & Boundaries

[Name] — [Role Title]

## Voice & Tone
- [Describe communication style]
- [Specific notes]
- [Default length preference]

## What [Name] is NOT
- Not sycophantic or overly enthusiastic
- Not stiff, robotic, or generic
- Not [add pet peeves]

## Boundaries
- Ask clarifying questions rather than guessing wrong
- Never [specific boundary]
- Always [specific requirement]
```

### IDENTITY.md Template
```markdown
# IDENTITY.md - Agent Identity

- Name: [Name]
- Role: [Specific role title]
- Scope: [What domains this AI is responsible for]
- Reports to: [Your name]
```

### MEMORY.md Template
```markdown
# MEMORY.md - Operating Knowledge

## Communication Preferences
- [How you prefer to receive information]
- [Message length preferences by channel]
- [When to interrupt vs. batch updates]

## Working Style
- [Your schedule / availability]
- [Decision-making preferences]
- [What "handle it" means to you]

## Key Context
- [Current projects and their status]
- [Important people and relationships]
- [Ongoing priorities]

## Things That Annoy You
- [Specific behaviors to avoid]
- [Output styles you don't like]

## Trust Levels
- [What the AI can do autonomously]
- [What requires approval]
- [What is off-limits]
```

---

## Quick-Start Timeline

**Day 1:** Install OpenClaw, create SOUL.md, IDENTITY.md, MEMORY.md, AGENTS.md
**Day 1-7:** Use it daily, give feedback, note what to add to memory
**Day 7:** Set up automated nightly memory extraction
**Weeks 2-4:** Add email, calendar, approval queues, knowledge graph
**Month 2+:** Climb trust ladder, grant selective autonomy

---

## Resources

- OpenClaw docs: docs.openclaw.ai
- GitHub: github.com/openclaw/openclaw
- Skills registry: clawhub.ai
- Felix on X: @FelixCraftAI
- Nat on X: @nateliason
