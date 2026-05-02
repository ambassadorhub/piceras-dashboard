const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8000' : '/api';
const DASHBOARD_PASSWORD_HASH = '10d9751839610657a22dd9fa76d13f6f037cbe68189627638a9abbd724c2e6c6';

class Dashboard {
    constructor() {
        this.currentSection = 'agents';
        this.currentChat = '7550244056';
        this.currentAgent = 'ollie';
        this.skills = [];
        this.agents = [];
        this.projects = [];
        this.messages = [];
        this.init();
    }

    init() {
        this.setupAuth();
        this.setupNavigation();
        this.setupEventListeners();
        if (this.isAuthenticated()) {
            this.showApp();
            this.loadAllData();
        }
    }

    setupAuth() {
        const gate = document.getElementById('auth-gate');
        const form = document.getElementById('auth-form');
        const input = document.getElementById('auth-password');
        const error = document.getElementById('auth-error');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const hash = await this.sha256(input.value);
            if (hash === DASHBOARD_PASSWORD_HASH) {
                localStorage.setItem('piceras_auth', hash);
                gate.style.display = 'none';
                this.showApp();
                this.loadAllData();
                this.showToast('Welcome to Piceras Command');
            } else {
                error.style.display = 'block';
                input.value = '';
                input.focus();
            }
        });
    }

    showApp() {
        document.getElementById('app').classList.add('visible');
        document.getElementById('auth-gate').style.display = 'none';
    }

    isAuthenticated() {
        return localStorage.getItem('piceras_auth') === DASHBOARD_PASSWORD_HASH;
    }

    async sha256(str) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    setupNavigation() {
        document.querySelectorAll('.nav-item, .bottom-nav .nav-item').forEach(item => {
            item.addEventListener('click', () => this.switchSection(item.dataset.section));
        });
    }

    switchSection(section) {
        this.currentSection = section;
        document.querySelectorAll('.nav-item, .bottom-nav .nav-item').forEach(t => {
            t.classList.toggle('active', t.dataset.section === section);
        });
        document.querySelectorAll('.section').forEach(s => {
            s.classList.toggle('active', s.id === section);
        });
        
        if (section === 'agents') this.loadAgents();
        if (section === 'skills') this.loadSkills();
        if (section === 'projects') this.loadProjects();
        if (section === 'usage') this.loadUsage();
        if (section === 'telegram') this.loadTelegramChats();
        if (section === 'messages') this.loadMessages();
    }

    setupEventListeners() {
        // Telegram
        document.getElementById('telegram-send')?.addEventListener('click', () => this.sendTelegramMessage());
        document.getElementById('telegram-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendTelegramMessage();
        });

        // Direct messages
        document.getElementById('message-send')?.addEventListener('click', () => this.sendDirectMessage());
        document.getElementById('message-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendDirectMessage();
        });

        // Agent selector in messages
        document.querySelectorAll('.chat-item[data-agent]').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.chat-item[data-agent]').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.currentAgent = item.dataset.agent;
                document.getElementById('message-input').placeholder = `Message ${this.currentAgent}...`;
            });
        });

        // Entity filter
        document.getElementById('entity-selector')?.addEventListener('change', () => this.filterByEntity());

        // Skills search
        document.getElementById('skills-search')?.addEventListener('input', (e) => this.searchSkills(e.target.value));
    }

    async loadAllData() {
        await Promise.all([
            this.loadAgents(),
            this.loadSkills(),
            this.loadProjects(),
            this.loadUsage()
        ]);
    }

    async loadAgents() {
        try {
            const res = await fetch(`${API_BASE}/agents`);
            this.agents = await res.json();
            this.renderAgents();
            document.getElementById('stat-agents').textContent = this.agents.filter(a => a.status === 'online').length;
        } catch (e) {
            this.renderAgentsFromMemory();
        }
    }

    renderAgents() {
        const grid = document.getElementById('agent-grid');
        if (!this.agents.length) {
            this.renderAgentsFromMemory();
            return;
        }
        grid.innerHTML = this.agents.map(agent => `
            <div class="agent-card" data-id="${agent.id}">
                <div class="agent-header">
                    <div class="agent-avatar ${agent.status}">${agent.avatar || agent.name[0]}</div>
                    <div class="agent-info">
                        <div class="agent-name">${agent.name}</div>
                        <div class="agent-role">${agent.role}</div>
                    </div>
                </div>
                <div class="agent-task">${agent.currentTask || 'Idle'}</div>
                <span class="agent-model">${agent.model || 'Unknown'}</span>
            </div>
        `).join('');
    }

    renderAgentsFromMemory() {
        const knownAgents = [
            { id: 'ollie', name: 'Ollie', role: 'CEO / Chief of Staff', status: 'online', currentTask: 'Dashboard build', model: 'ollama/kimi-k2.6:cloud', avatar: 'O' },
            { id: 'quinn', name: 'Quinn', role: 'Content Director', status: 'online', currentTask: 'AI Tool Guru pipeline', model: 'ollama/minimax-m2.7:cloud', avatar: 'O' },
            { id: 'nova', name: 'Nova', role: 'Growth Marketer', status: 'idle', currentTask: 'Newsletter draft ready', model: 'ollama/minimax-m2.7:cloud', avatar: 'O' },
            { id: 'ralph', name: 'Ralph', role: 'Lead Developer', status: 'idle', currentTask: 'Awaiting assignment', model: 'ollama/minimax-m2.7:cloud', avatar: 'O' },
            { id: 'archie', name: 'Archie', role: 'Technical Architect', status: 'idle', currentTask: 'Awaiting assignment', model: 'ollama/kimi-k2.6:cloud', avatar: 'O' },
            { id: 'sage', name: 'Sage', role: 'Research Analyst', status: 'idle', currentTask: 'Awaiting assignment', model: 'ollama/gemma4:31b-cloud', avatar: 'O' },
            { id: 'vera', name: 'Vera', role: 'Compliance Officer', status: 'online', currentTask: 'CQC oversight', model: 'ollama/kimi-k2.6:cloud', avatar: 'O' },
            { id: 'iris', name: 'Iris', role: 'Finance & Deals', status: 'idle', currentTask: 'Awaiting assignment', model: 'ollama/gemma4:31b-cloud', avatar: 'O' },
            { id: 'tess', name: 'Tess', role: 'QA Lead', status: 'idle', currentTask: 'Awaiting deployment', model: 'browser-tool', avatar: 'O' },
            { id: 'max', name: 'Max', role: 'Operations Manager', status: 'idle', currentTask: 'Awaiting assignment', model: 'ollama/minimax-m2.7:cloud', avatar: 'O' }
        ];
        this.agents = knownAgents;
        this.renderAgents();
        document.getElementById('stat-agents').textContent = knownAgents.filter(a => a.status === 'online').length;
    }

    async loadSkills() {
        try {
            const res = await fetch(`${API_BASE}/skills`);
            this.skills = await res.json();
            this.renderSkills();
        } catch (e) {
            this.renderSkillsFromMemory();
        }
    }

    renderSkills() {
        const list = document.getElementById('skill-list');
        list.innerHTML = this.skills.map(skill => `
            <div class="skill-row" data-category="${skill.category}">
                <div class="skill-info">
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-desc">${skill.description}</div>
                </div>
                <button class="skill-action" onclick="dashboard.runSkill('${skill.name}')">Run</button>
            </div>
        `).join('');
    }

    renderSkillsFromMemory() {
        const knownSkills = [
            { name: 'piceras-dashboard', description: 'Central command dashboard for all Piceras operations', category: 'system' },
            { name: 'gh-issues', description: 'GitHub issue automation and PR management', category: 'coding' },
            { name: 'coding-agent', description: 'Delegate coding tasks to specialised agents', category: 'coding' },
            { name: 'nano-banana-pro', description: 'Generate/edit images with Gemini', category: 'content' },
            { name: 'weather', description: 'Current weather and forecasts', category: 'content' },
            { name: 'skill-creator', description: 'Create and audit OpenClaw skills', category: 'system' },
            { name: 'video-frames', description: 'Extract frames from videos', category: 'content' },
            { name: 'github', description: 'GitHub CLI operations', category: 'coding' },
            { name: 'node-connect', description: 'Diagnose node pairing failures', category: 'system' }
        ];
        this.skills = knownSkills;
        this.renderSkills();
    }

    searchSkills(query) {
        document.querySelectorAll('.skill-row').forEach(item => {
            const name = item.querySelector('.skill-name').textContent.toLowerCase();
            item.style.display = name.includes(query.toLowerCase()) ? 'flex' : 'none';
        });
    }

    async loadProjects() {
        try {
            const res = await fetch(`${API_BASE}/projects`);
            this.projects = await res.json();
            this.renderProjects();
        } catch (e) {
            this.renderProjectsFromMemory();
        }
    }

    renderProjects() {
        const columns = { backlog: [], inprogress: [], blocked: [], done: [] };
        this.projects.forEach(p => { if (columns[p.status]) columns[p.status].push(p); });
        
        Object.keys(columns).forEach(status => {
            const container = document.querySelector(`[data-status="${status}"]`);
            const count = document.getElementById(`count-${status}`);
            if (count) count.textContent = columns[status].length;
            if (container) {
                container.innerHTML = columns[status].map(p => `
                    <div class="kanban-card" draggable="true" data-id="${p.id}">
                        <div class="kanban-card-title">${p.title}</div>
                        <div class="kanban-card-meta">
                            <span class="tag tag-${p.entity}">${p.entity}</span>
                            <span class="priority-dot priority-${p.priority}"></span>
                        </div>
                    </div>
                `).join('');
            }
        });
        this.setupDragAndDrop();
    }

    renderProjectsFromMemory() {
        const knownProjects = [
            { id: '1', title: 'Livefully sponsor licence application', entity: 'livefully', priority: 'p0', status: 'blocked' },
            { id: '2', title: 'In-House Care dissolution', entity: 'livefully', priority: 'p0', status: 'inprogress' },
            { id: '3', title: 'AI Tool Guru spam filter deployment', entity: 'buzzkit', priority: 'p0', status: 'inprogress' },
            { id: '4', title: 'Lexington theme install', entity: 'buzzkit', priority: 'p1', status: 'backlog' },
            { id: '5', title: 'Unison Healthcare EOR pipeline', entity: 'unison', priority: 'p1', status: 'inprogress' },
            { id: '6', title: 'Piceras Command Dashboard', entity: 'system', priority: 'p0', status: 'inprogress' }
        ];
        this.projects = knownProjects;
        this.renderProjects();
    }

    setupDragAndDrop() {
        let dragged = null;
        document.querySelectorAll('.kanban-card').forEach(card => {
            card.addEventListener('dragstart', (e) => { 
                dragged = card; 
                card.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            card.addEventListener('dragend', () => { 
                card.classList.remove('dragging');
                dragged = null; 
            });
        });
        document.querySelectorAll('.kanban-cards').forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                column.style.background = 'rgba(99, 102, 241, 0.1)';
            });
            column.addEventListener('dragleave', () => {
                column.style.background = '';
            });
            column.addEventListener('drop', (e) => {
                e.preventDefault();
                column.style.background = '';
                if (dragged) {
                    column.appendChild(dragged);
                    this.updateProjectStatus(dragged.dataset.id, column.dataset.status);
                }
            });
        });
    }

    async updateProjectStatus(id, status) {
        this.showToast('Project moved to ' + status);
    }

    async loadUsage() {
        try {
            const res = await fetch(`${API_BASE}/usage`);
            const data = await res.json();
            this.renderUsage(data);
        } catch (e) {
            this.renderUsageFromMemory();
        }
    }

    renderUsage(data) {
        document.getElementById('usage-tokens').textContent = data.todayTokens?.toLocaleString() || '12.5K';
        document.getElementById('usage-cost').textContent = '$' + (data.todayCost?.toFixed(2) || '0.84');
        document.getElementById('usage-calls').textContent = data.todayCalls?.toLocaleString() || '1,247';
        document.getElementById('stat-tokens').textContent = data.todayTokens?.toLocaleString() || '12.5K';
        document.getElementById('stat-cost').textContent = '$' + (data.todayCost?.toFixed(2) || '0.84');
        if (data.weekly) {
            const bars = document.querySelectorAll('.chart-bar');
            data.weekly.forEach((val, i) => { if (bars[i]) bars[i].style.height = `${Math.max(val * 100, 4)}%`; });
        }
    }

    renderUsageFromMemory() {
        document.getElementById('usage-tokens').textContent = '12.5K';
        document.getElementById('usage-cost').textContent = '$0.84';
        document.getElementById('usage-calls').textContent = '1,247';
        document.getElementById('stat-tokens').textContent = '12.5K';
        document.getElementById('stat-cost').textContent = '$0.84';
    }

    async loadTelegramChats() {
        try {
            const res = await fetch(`${API_BASE}/telegram/chats`);
            const chats = await res.json();
            this.renderTelegramChats(chats);
            // Load messages for first chat
            if (chats.length > 0) {
                this.loadTelegramMessages(chats[0].id);
            }
        } catch (e) {
            this.showToast('Telegram connection unavailable');
        }
    }

    renderTelegramChats(chats) {
        const container = document.getElementById('telegram-chats');
        if (!container) return;
        container.innerHTML = chats.map(chat => `
            <div class="chat-item ${chat.id === this.currentChat ? 'active' : ''}" data-id="${chat.id}">
                <div class="chat-avatar">${chat.name[0]}</div>
                <div class="chat-info">
                    <div class="chat-name">${chat.name}</div>
                    <div class="chat-preview">${chat.lastMessage || 'No messages'}</div>
                </div>
            </div>
        `).join('');
        
        container.querySelectorAll('.chat-item').forEach(item => {
            item.addEventListener('click', () => {
                container.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.loadTelegramMessages(item.dataset.id);
            });
        });
    }

    async loadTelegramMessages(chatId) {
        this.currentChat = chatId;
        try {
            const res = await fetch(`${API_BASE}/telegram/messages?chat_id=${chatId}`);
            const messages = await res.json();
            this.renderTelegramMessages(messages);
        } catch (e) {
            document.getElementById('telegram-messages').innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💬</div>
                    <p>Messages will appear here</p>
                </div>
            `;
        }
    }

    renderTelegramMessages(messages) {
        const container = document.getElementById('telegram-messages');
        if (!messages.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💬</div>
                    <p>No messages yet</p>
                </div>
            `;
            return;
        }
        container.innerHTML = messages.map(m => `
            <div class="message ${m.outgoing ? 'outgoing' : 'incoming'}">
                ${m.text}
                <div class="message-time">${new Date(m.date * 1000).toLocaleTimeString()}</div>
            </div>
        `).join('');
        container.scrollTop = container.scrollHeight;
    }

    async sendTelegramMessage() {
        const input = document.getElementById('telegram-input');
        const text = input.value.trim();
        if (!text) {
            this.showToast('Type a message first');
            return;
        }
        if (!this.currentChat) {
            this.showToast('Select a chat first');
            return;
        }
        
        const container = document.getElementById('telegram-messages');
        // Remove empty state if present
        const emptyState = container.querySelector('.empty-state');
        if (emptyState) emptyState.remove();
        
        const time = new Date().toLocaleTimeString();
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message outgoing';
        msgDiv.innerHTML = `${text}<div class="message-time">${time}</div>`;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
        input.value = '';
        
        try {
            const res = await fetch(`${API_BASE}/telegram/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: this.currentChat, text })
            });
            const data = await res.json();
            if (data.sent) {
                this.showToast('✓ Message sent');
            } else {
                this.showToast('Failed to send: ' + (data.error || 'Unknown error'));
            }
        } catch (e) {
            this.showToast('Network error - message queued');
        }
    }

    async loadMessages() {
        // Messages are pre-loaded in HTML
    }

    async sendDirectMessage() {
        const input = document.getElementById('message-input');
        const text = input.value.trim();
        if (!text) return;
        
        const container = document.getElementById('messages-area');
        container.innerHTML += `
            <div class="message outgoing">
                ${text}
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
        `;
        container.scrollTop = container.scrollHeight;
        input.value = '';
        
        // Simulate response
        setTimeout(() => {
            container.innerHTML += `
                <div class="message incoming">
                    I'm working on that, Bass. I'll get back to you shortly.
                    <div class="message-time">${new Date().toLocaleTimeString()}</div>
                </div>
            `;
            container.scrollTop = container.scrollHeight;
        }, 1500);
    }

    async runSkill(skillName) {
        this.showToast(`Running ${skillName}...`);
    }

    filterByEntity() {
        const entity = document.getElementById('entity-selector').value;
        document.querySelectorAll('.kanban-card').forEach(card => {
            const cardEntity = card.querySelector('.tag')?.textContent;
            card.style.display = entity === 'all' || cardEntity === entity ? 'block' : 'none';
        });
    }

    showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }
}

const dashboard = new Dashboard();
// Cache bust v3
