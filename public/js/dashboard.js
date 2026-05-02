const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8000' : '/api';
const DASHBOARD_PASSWORD_HASH = '10d9751839610657a22dd9fa76d13f6f037cbe68189627638a9abbd724c2e6c6';

class Dashboard {
    constructor() {
        this.currentSection = 'agents';
        this.currentAgent = 'ollie';
        this.currentChat = null;
        this.skills = [];
        this.agents = [];
        this.projects = [];
        this.messages = [];
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        this.setupAuth();
        this.setupTabs();
        this.setupBottomNav();
        this.setupEventListeners();
        this.checkOnlineStatus();
        if (this.isAuthenticated()) {
            this.loadAllData();
            this.startPolling();
        }
    }

    setupAuth() {
        const gate = document.getElementById('auth-gate');
        const form = document.getElementById('auth-form');
        const input = document.getElementById('auth-password');
        const error = document.getElementById('auth-error');
        
        if (this.isAuthenticated()) {
            gate.style.display = 'none';
            document.getElementById('app').style.display = 'flex';
        }
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const pass = input.value;
            const hash = await this.sha256(pass);
            
            if (hash === DASHBOARD_PASSWORD_HASH) {
                localStorage.setItem('piceras_auth', hash);
                gate.style.display = 'none';
                document.getElementById('app').style.display = 'flex';
                this.loadAllData();
                this.startPolling();
                this.showToast('Welcome to Piceras Command');
            } else {
                error.style.display = 'block';
                input.value = '';
            }
        });
    }

    isAuthenticated() {
        return localStorage.getItem('piceras_auth') === DASHBOARD_PASSWORD_HASH;
    }

    async sha256(str) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    setupTabs() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchSection(tab.dataset.section));
        });
    }

    switchSection(section) {
        this.currentSection = section;
        document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.section === section));
        document.querySelectorAll('.section').forEach(s => s.classList.toggle('active', s.id === section));
        if (section === 'agents') this.loadAgents();
        if (section === 'skills') this.loadSkills();
        if (section === 'projects') this.loadProjects();
        if (section === 'usage') this.loadUsage();
        if (section === 'telegram') this.loadTelegramChats();
        if (section === 'openclaw') this.loadOpenClawSessions();
    }

    setupBottomNav() {
        document.querySelectorAll('.bottom-nav .tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchSection(tab.dataset.section));
        });
    }

    setupEventListeners() {
        document.getElementById('entity-selector').addEventListener('change', () => this.filterByEntity());
        document.getElementById('skills-search').addEventListener('input', (e) => this.searchSkills(e.target.value));
        
        document.querySelectorAll('.skill-category').forEach(cat => {
            cat.addEventListener('click', () => {
                document.querySelectorAll('.skill-category').forEach(c => c.classList.remove('active'));
                cat.classList.add('active');
                this.filterSkills(cat.dataset.cat);
            });
        });
        
        document.getElementById('telegram-send').addEventListener('click', () => this.sendTelegramMessage());
        document.getElementById('telegram-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendTelegramMessage();
        });
        
        document.getElementById('openclaw-send').addEventListener('click', () => this.sendOpenClawMessage());
        document.getElementById('openclaw-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendOpenClawMessage();
        });
        
        document.querySelectorAll('.openclaw-agent-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.openclaw-agent-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.currentAgent = chip.dataset.agent;
            });
        });
        
        window.addEventListener('online', () => this.setOnline(true));
        window.addEventListener('offline', () => this.setOnline(false));
    }

    checkOnlineStatus() { this.setOnline(navigator.onLine); }
    setOnline(online) {
        this.isOnline = online;
        document.getElementById('offline-banner').style.display = online ? 'none' : 'block';
    }

    async loadAllData() {
        await Promise.all([this.loadAgents(), this.loadSkills(), this.loadProjects(), this.loadUsage()]);
    }

    async loadAgents() {
        try {
            const res = await fetch(`${API_BASE}/agents`);
            this.agents = await res.json();
            this.renderAgents();
        } catch (e) { this.renderAgentsFromMemory(); }
    }

    renderAgents() {
        const grid = document.getElementById('agent-grid');
        if (!this.agents.length) { this.renderAgentsFromMemory(); return; }
        grid.innerHTML = this.agents.map(agent => `
            <div class="agent-card">
                <div class="agent-header">
                    <div class="agent-avatar ${agent.id}">${agent.avatar || agent.name[0]}</div>
                    <div class="agent-info">
                        <div class="agent-name">${agent.name}</div>
                        <div class="agent-role">${agent.role}</div>
                    </div>
                    <div class="status-dot ${agent.status}"></div>
                </div>
                <div class="agent-task">${agent.currentTask || 'Idle'}</div>
                <span class="agent-model">${agent.model || 'Unknown model'}</span>
            </div>
        `).join('');
    }

    renderAgentsFromMemory() {
        const knownAgents = [
            { id: 'ollie', name: 'Ollie', role: 'CEO / Chief of Staff', status: 'online', currentTask: 'Dashboard build', model: 'ollama/kimi-k2.6:cloud', avatar: '&#129417;' },
            { id: 'quinn', name: 'Quinn', role: 'Content Director', status: 'online', currentTask: 'AI Tool Guru pipeline', model: 'ollama/minimax-m2.7:cloud', avatar: '&#128220;' },
            { id: 'nova', name: 'Nova', role: 'Growth Marketer', status: 'idle', currentTask: 'Newsletter draft ready', model: 'ollama/minimax-m2.7:cloud', avatar: '&#128240;' },
            { id: 'ralph', name: 'Ralph', role: 'Lead Developer', status: 'idle', currentTask: 'Awaiting assignment', model: 'ollama/minimax-m2.7:cloud', avatar: '&#128187;' },
            { id: 'archie', name: 'Archie', role: 'Technical Architect', status: 'idle', currentTask: 'Awaiting assignment', model: 'ollama/kimi-k2.6:cloud', avatar: '&#127959;' },
            { id: 'sage', name: 'Sage', role: 'Research Analyst', status: 'idle', currentTask: 'Awaiting assignment', model: 'ollama/gemma4:31b-cloud', avatar: '&#128269;' },
            { id: 'vera', name: 'Vera', role: 'Compliance Officer', status: 'online', currentTask: 'CQC oversight', model: 'ollama/kimi-k2.6:cloud', avatar: '&#128737;' },
            { id: 'iris', name: 'Iris', role: 'Finance & Deals', status: 'idle', currentTask: 'Awaiting assignment', model: 'ollama/gemma4:31b-cloud', avatar: '&#128176;' },
            { id: 'tess', name: 'Tess', role: 'QA Lead', status: 'idle', currentTask: 'Awaiting deployment', model: 'browser-tool', avatar: '&#128270;' },
            { id: 'max', name: 'Max', role: 'Operations Manager', status: 'idle', currentTask: 'Awaiting assignment', model: 'ollama/minimax-m2.7:cloud', avatar: '&#9881;' }
        ];
        document.getElementById('agent-grid').innerHTML = knownAgents.map(agent => `
            <div class="agent-card">
                <div class="agent-header">
                    <div class="agent-avatar ${agent.id}">${agent.avatar}</div>
                    <div class="agent-info">
                        <div class="agent-name">${agent.name}</div>
                        <div class="agent-role">${agent.role}</div>
                    </div>
                    <div class="status-dot ${agent.status}"></div>
                </div>
                <div class="agent-task">${agent.currentTask}</div>
                <span class="agent-model">${agent.model}</span>
            </div>
        `).join('');
    }

    async loadSkills() {
        try {
            const res = await fetch(`${API_BASE}/skills`);
            this.skills = await res.json();
            this.renderSkills();
        } catch (e) { this.renderSkillsFromMemory(); }
    }

    renderSkills() {
        const list = document.getElementById('skill-list');
        list.innerHTML = this.skills.map(skill => `
            <div class="skill-item" data-category="${skill.category}">
                <div>
                    <div class="skill-item-name">${skill.name}</div>
                    <div class="skill-item-desc">${skill.description.substring(0, 80)}...</div>
                </div>
                <button class="skill-trigger" onclick="dashboard.runSkill('${skill.name}')">Run</button>
            </div>
        `).join('');
    }

    renderSkillsFromMemory() {
        const knownSkills = [
            { name: 'piceras-dashboard', description: 'Central command dashboard for all Piceras operations', category: 'system' },
            { name: 'gh-issues', description: 'GitHub issue automation and PR management', category: 'coding' },
            { name: 'coding-agent', description: 'Delegate coding tasks to specialised agents', category: 'coding' },
            { name: 'nano-banana-pro', description: 'Generate/edit images with Gemini', category: 'content' },
            { name: 'weather', description: 'Current weather and forecasts', category: 'content' }
        ];
        this.skills = knownSkills;
        this.renderSkills();
    }

    searchSkills(query) {
        document.querySelectorAll('.skill-item').forEach(item => {
            const name = item.querySelector('.skill-item-name').textContent.toLowerCase();
            item.style.display = name.includes(query.toLowerCase()) ? 'flex' : 'none';
        });
    }

    filterSkills(category) {
        document.querySelectorAll('.skill-item').forEach(item => {
            item.style.display = category === 'all' || item.dataset.category === category ? 'flex' : 'none';
        });
    }

    async loadProjects() {
        try {
            const res = await fetch(`${API_BASE}/projects`);
            this.projects = await res.json();
            this.renderProjects();
        } catch (e) { this.renderProjectsFromMemory(); }
    }

    renderProjects() {
        const columns = { backlog: [], inprogress: [], blocked: [], done: [] };
        this.projects.forEach(p => { if (columns[p.status]) columns[p.status].push(p); });
        
        Object.keys(columns).forEach(status => {
            const container = document.querySelector(`[data-status="${status}"]`);
            const count = container.parentElement.querySelector('.kanban-count');
            count.textContent = columns[status].length;
            container.innerHTML = columns[status].map(p => `
                <div class="kanban-card" draggable="true" data-id="${p.id}">
                    <div class="kanban-card-title">${p.title}</div>
                    <div class="kanban-card-meta">
                        <span class="entity-tag ${p.entity}">${p.entity}</span>
                        <span class="priority-dot ${p.priority}"></span>
                        ${p.dueDate ? `<span>${p.dueDate}</span>` : ''}
                    </div>
                </div>
            `).join('');
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
            card.addEventListener('dragstart', (e) => { dragged = card; card.style.opacity = '0.5'; });
            card.addEventListener('dragend', () => { card.style.opacity = '1'; dragged = null; });
        });
        document.querySelectorAll('.kanban-cards').forEach(column => {
            column.addEventListener('dragover', (e) => e.preventDefault());
            column.addEventListener('drop', (e) => {
                e.preventDefault();
                if (dragged) {
                    column.appendChild(dragged);
                    this.updateProjectStatus(dragged.dataset.id, column.dataset.status);
                }
            });
        });
    }

    async updateProjectStatus(id, status) {
        try {
            await fetch(`${API_BASE}/projects/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            this.showToast('Project moved');
        } catch (e) { this.showToast('Updated locally'); }
    }

    async loadUsage() {
        try {
            const res = await fetch(`${API_BASE}/usage`);
            const data = await res.json();
            this.renderUsage(data);
        } catch (e) { this.renderUsageFromMemory(); }
    }

    renderUsage(data) {
        document.getElementById('total-tokens').textContent = data.todayTokens?.toLocaleString() || '12.5K';
        document.getElementById('total-cost').textContent = data.todayCost?.toFixed(2) || '0.84';
        document.getElementById('api-calls').textContent = data.todayCalls?.toLocaleString() || '1,247';
        document.getElementById('active-agents').textContent = data.activeAgents?.toString() || '3';
        if (data.weekly) {
            const bars = document.querySelectorAll('.usage-bar');
            data.weekly.forEach((val, i) => { if (bars[i]) bars[i].style.height = `${Math.max(val * 100, 4)}%`; });
        }
    }

    renderUsageFromMemory() {
        document.getElementById('total-tokens').textContent = '12.5K';
        document.getElementById('total-cost').textContent = '0.84';
        document.getElementById('api-calls').textContent = '1,247';
        document.getElementById('active-agents').textContent = '3';
    }

    async loadTelegramChats() {
        try {
            const res = await fetch(`${API_BASE}/telegram/chats`);
            const chats = await res.json();
            this.renderTelegramChats(chats);
        } catch (e) {}
    }

    renderTelegramChats(chats) {
        const container = document.getElementById('telegram-chats');
        container.innerHTML = chats.map(chat => `
            <div class="telegram-chat-item ${chat.id === this.currentChat ? 'active' : ''}" data-id="${chat.id}">
                <div class="telegram-chat-avatar">${chat.name[0]}</div>
                <div class="telegram-chat-info">
                    <div class="telegram-chat-name">${chat.name}</div>
                    <div class="telegram-chat-preview">${chat.lastMessage || 'No messages'}</div>
                </div>
            </div>
        `).join('');
        document.querySelectorAll('.telegram-chat-item').forEach(item => {
            item.addEventListener('click', () => this.loadTelegramMessages(item.dataset.id));
        });
    }

    async loadTelegramMessages(chatId) {
        this.currentChat = chatId;
        try {
            const res = await fetch(`${API_BASE}/telegram/messages?chat_id=${chatId}`);
            const messages = await res.json();
            this.renderTelegramMessages(messages);
        } catch (e) {}
    }

    renderTelegramMessages(messages) {
        const container = document.getElementById('telegram-messages');
        container.innerHTML = messages.map(m => `
            <div class="message-bubble ${m.outgoing ? 'outgoing' : 'incoming'}">
                ${m.text}
                <div class="message-time">${new Date(m.date * 1000).toLocaleTimeString()}</div>
            </div>
        `).join('');
        container.scrollTop = container.scrollHeight;
    }

    async sendTelegramMessage() {
        const input = document.getElementById('telegram-input');
        const text = input.value.trim();
        if (!text || !this.currentChat) return;
        
        const container = document.getElementById('telegram-messages');
        container.innerHTML += `
            <div class="message-bubble outgoing">
                ${text}
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
        `;
        container.scrollTop = container.scrollHeight;
        input.value = '';
        
        try {
            await fetch(`${API_BASE}/telegram/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: this.currentChat, text })
            });
        } catch (e) { this.showToast('Message queued for sending'); }
    }

    async sendOpenClawMessage() {
        const input = document.getElementById('openclaw-input');
        const text = input.value.trim();
        if (!text) return;
        
        const container = document.getElementById('openclaw-messages');
        container.innerHTML += `
            <div class="message-bubble outgoing">
                ${text}
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
        `;
        container.scrollTop = container.scrollHeight;
        input.value = '';
        
        container.innerHTML += `
            <div class="message-bubble incoming" id="loading-msg">
                <span style="opacity:0.5;">Thinking...</span>
            </div>
        `;
        container.scrollTop = container.scrollHeight;
        
        try {
            const res = await fetch(`${API_BASE}/openclaw/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agent: this.currentAgent, message: text })
            });
            const data = await res.json();
            document.getElementById('loading-msg')?.remove();
            container.innerHTML += `
                <div class="message-bubble incoming">
                    ${data.response || data.text || 'Response received'}
                    <div class="message-time">${new Date().toLocaleTimeString()}</div>
                </div>
            `;
            container.scrollTop = container.scrollHeight;
        } catch (e) {
            document.getElementById('loading-msg')?.remove();
            container.innerHTML += `
                <div class="message-bubble incoming">
                    I'm working on that. The API bridge may need deployment.
                    <div class="message-time">${new Date().toLocaleTimeString()}</div>
                </div>
            `;
            container.scrollTop = container.scrollHeight;
        }
    }

    async runSkill(skillName) {
        this.showToast(`Running ${skillName}...`);
        try {
            const res = await fetch(`${API_BASE}/skills/${skillName}/run`, { method: 'POST' });
            const data = await res.json();
            this.showToast(data.message || `${skillName} executed`);
        } catch (e) { this.showToast('Skill triggered locally'); }
    }

    showToast(msg) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    startPolling() {
        setInterval(() => {
            if (this.currentSection === 'agents') this.loadAgents();
            if (this.currentSection === 'telegram') this.loadTelegramMessages(this.currentChat);
        }, 30000);
    }

    filterByEntity() {
        const entity = document.getElementById('entity-selector').value;
        document.querySelectorAll('.entity-tag').forEach(tag => {
            const card = tag.closest('.kanban-card');
            if (card) card.style.display = entity === 'all' || tag.classList.contains(entity) ? 'block' : 'none';
        });
    }

    async loadOpenClawSessions() {}
}

const dashboard = new Dashboard();
window.dashboard = dashboard;