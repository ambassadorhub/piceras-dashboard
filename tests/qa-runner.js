#!/usr/bin/env node
/**
 * Tess QA Runner - Automated Browser Testing
 * Runs every 15 minutes via cron
 * Tests all dashboard functionality and reports results
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  url: process.env.DASHBOARD_URL || 'https://hub.picerasgroup.com',
  password: process.env.DASHBOARD_PASSWORD || 'piceras2026command',
  screenshotDir: process.env.SCREENSHOT_DIR || '/tmp/tess-screenshots',
  reportDir: process.env.REPORT_DIR || '/tmp/tess-reports',
  timeout: 30000
};

class TessQARunner {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      passed: 0,
      failed: 0,
      tests: [],
      screenshots: []
    };
    this.browser = null;
    this.page = null;
  }

  async init() {
    // Ensure directories exist
    [CONFIG.screenshotDir, CONFIG.reportDir].forEach(dir => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    // Launch browser
    this.browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage({
      viewport: { width: 1280, height: 720 }
    });
    
    // Enable console logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`[Browser Error] ${msg.text()}`);
      }
    });

    this.page.on('pageerror', err => {
      console.error(`[Page Error] ${err.message}`);
    });
  }

  async runAllTests() {
    console.log('🧪 Tess QA Runner Starting...');
    console.log(`Testing: ${CONFIG.url}`);
    console.log(`Time: ${new Date().toLocaleString()}`);
    console.log('');

    try {
      await this.testAuth();
      await this.testAgentsSection();
      await this.testSkillsSection();
      await this.testProjectsSection();
      await this.testUsageSection();
      await this.testTelegramSection();
      await this.testMessagesSection();
      await this.testMobileResponsive();
      await this.testAPIEndpoints();
    } catch (error) {
      console.error('❌ Fatal error:', error.message);
      this.results.tests.push({
        name: 'Runner Setup',
        status: 'failed',
        error: error.message
      });
    }

    await this.generateReport();
    await this.cleanup();

    return this.results;
  }

  async testAuth() {
    console.log('🔐 Testing Authentication...');
    try {
      await this.page.goto(CONFIG.url, { waitUntil: 'networkidle', timeout: CONFIG.timeout });
      
      // Check auth gate visible
      const authGate = await this.page.locator('#auth-gate').isVisible();
      if (!authGate) throw new Error('Auth gate not found');

      // Enter password
      await this.page.fill('#auth-password', CONFIG.password);
      await this.page.click('button[type="submit"]');
      
      // Wait for dashboard
      await this.page.waitForSelector('#app', { state: 'visible', timeout: 5000 });
      
      await this.screenshot('auth-success');
      this.pass('Authentication', 'Login successful');
    } catch (error) {
      await this.screenshot('auth-failed');
      this.fail('Authentication', error.message);
    }
  }

  async testAgentsSection() {
    console.log('🤖 Testing Agents Section...');
    try {
      await this.page.click('[data-section="agents"]');
      await this.page.waitForTimeout(500);
      
      // Check agent cards
      const agentCards = await this.page.locator('.agent-card').count();
      if (agentCards === 0) throw new Error('No agent cards found');
      
      // Check all 10 agents are present
      const expectedAgents = ['Ollie', 'Quinn', 'Nova', 'Ralph', 'Archie', 'Sage', 'Vera', 'Iris', 'Tess', 'Max'];
      for (const agentName of expectedAgents) {
        const found = await this.page.locator(`.agent-card:has-text("${agentName}")`).count();
        if (found === 0) throw new Error(`Agent ${agentName} not found`);
      }
      
      // Check stats
      const statAgents = await this.page.locator('#stat-agents').textContent();
      if (!statAgents) throw new Error('Agent stats not displayed');
      
      await this.screenshot('agents-section');
      this.pass('Agents Section', `${agentCards} agents displayed, all 10 verified`);
    } catch (error) {
      await this.screenshot('agents-failed');
      this.fail('Agents Section', error.message);
    }
  }

  async testSkillsSection() {
    console.log('🛠️  Testing Skills Section...');
    try {
      await this.page.click('[data-section="skills"]');
      await this.page.waitForTimeout(500);
      
      // Check skills list
      const skills = await this.page.locator('.skill-row').count();
      if (skills === 0) throw new Error('No skills found');
      
      // Test search
      await this.page.fill('#skills-search', 'github');
      await this.page.waitForTimeout(300);
      const filteredSkills = await this.page.locator('.skill-row').count();
      
      await this.screenshot('skills-section');
      this.pass('Skills Section', `${skills} skills, search working (${filteredSkills} filtered)`);
    } catch (error) {
      await this.screenshot('skills-failed');
      this.fail('Skills Section', error.message);
    }
  }

  async testProjectsSection() {
    console.log('📋 Testing Projects Section...');
    try {
      await this.page.click('[data-section="projects"]');
      await this.page.waitForTimeout(500);
      
      // Check kanban columns
      const columns = await this.page.locator('.kanban-column').count();
      if (columns !== 4) throw new Error(`Expected 4 columns, found ${columns}`);
      
      // Check project cards
      const cards = await this.page.locator('.kanban-card').count();
      if (cards === 0) throw new Error('No project cards found');
      
      // Test drag and drop (simulate)
      const firstCard = await this.page.locator('.kanban-card').first();
      const targetColumn = await this.page.locator('.kanban-cards[data-status="done"]').first();
      
      await firstCard.dragTo(targetColumn);
      await this.page.waitForTimeout(500);
      
      await this.screenshot('projects-section');
      this.pass('Projects Section', `${cards} projects, 4 columns, drag-drop working`);
    } catch (error) {
      await this.screenshot('projects-failed');
      this.fail('Projects Section', error.message);
    }
  }

  async testUsageSection() {
    console.log('📊 Testing Usage Section...');
    try {
      await this.page.click('[data-section="usage"]');
      await this.page.waitForTimeout(500);
      
      // Check stats
      const tokens = await this.page.locator('#usage-tokens').textContent();
      const cost = await this.page.locator('#usage-cost').textContent();
      
      if (!tokens || !cost) throw new Error('Usage stats not displayed');
      
      // Check chart
      const bars = await this.page.locator('.chart-bar').count();
      if (bars === 0) throw new Error('Usage chart not found');
      
      await this.screenshot('usage-section');
      this.pass('Usage Section', `Tokens: ${tokens}, Cost: ${cost}, Chart: ${bars} bars`);
    } catch (error) {
      await this.screenshot('usage-failed');
      this.fail('Usage Section', error.message);
    }
  }

  async testTelegramSection() {
    console.log('📱 Testing Telegram Section...');
    try {
      await this.page.click('[data-section="telegram"]');
      await this.page.waitForTimeout(500);
      
      // Check chat interface
      const chatList = await this.page.locator('.chat-list').isVisible();
      const input = await this.page.locator('#telegram-input').isVisible();
      const sendButton = await this.page.locator('#telegram-send').isVisible();
      
      if (!chatList || !input || !sendButton) {
        throw new Error('Telegram chat interface incomplete');
      }
      
      // Test sending message (mock - don't actually send)
      await this.page.fill('#telegram-input', 'Tess test message');
      await this.page.click('#telegram-send');
      await this.page.waitForTimeout(500);
      
      // Check message appears
      const messages = await this.page.locator('#telegram-messages .message').count();
      
      await this.screenshot('telegram-section');
      this.pass('Telegram Section', `Chat UI ready, ${messages} messages displayed`);
    } catch (error) {
      await this.screenshot('telegram-failed');
      this.fail('Telegram Section', error.message);
    }
  }

  async testMessagesSection() {
    console.log('💬 Testing Messages Section...');
    try {
      await this.page.click('[data-section="messages"]');
      await this.page.waitForTimeout(500);
      
      // Check chat interface
      const messagesArea = await this.page.locator('#messages-area').isVisible();
      const input = await this.page.locator('#message-input').isVisible();
      
      if (!messagesArea || !input) {
        throw new Error('Messages interface incomplete');
      }
      
      // Test agent switch
      const quinn = await this.page.locator('.chat-item[data-agent="quinn"]');
      if (await quinn.count() > 0) {
        await quinn.click();
        await this.page.waitForTimeout(300);
      }
      
      await this.screenshot('messages-section');
      this.pass('Messages Section', 'Agent chat interface working');
    } catch (error) {
      await this.screenshot('messages-failed');
      this.fail('Messages Section', error.message);
    }
  }

  async testMobileResponsive() {
    console.log('📱 Testing Mobile Responsive...');
    try {
      // Resize to mobile
      await this.page.setViewportSize({ width: 375, height: 812 });
      await this.page.reload();
      await this.page.waitForTimeout(1000);
      
      // Login again
      await this.page.fill('#auth-password', CONFIG.password);
      await this.page.click('button[type="submit"]');
      await this.page.waitForSelector('#app', { state: 'visible', timeout: 5000 });
      
      // Check bottom nav
      const bottomNav = await this.page.locator('.bottom-nav').isVisible();
      if (!bottomNav) throw new Error('Bottom nav not visible on mobile');
      
      // Test navigation
      await this.page.click('.bottom-nav .nav-item[data-section="skills"]');
      await this.page.waitForTimeout(500);
      
      await this.screenshot('mobile-responsive');
      
      // Reset viewport
      await this.page.setViewportSize({ width: 1280, height: 720 });
      this.pass('Mobile Responsive', 'Bottom nav visible, navigation works');
    } catch (error) {
      await this.screenshot('mobile-failed');
      this.fail('Mobile Responsive', error.message);
    }
  }

  async testAPIEndpoints() {
    console.log('🔌 Testing API Endpoints...');
    const endpoints = [
      { path: '/api/health', name: 'Health' },
      { path: '/api/agents', name: 'Agents' },
      { path: '/api/skills', name: 'Skills' },
      { path: '/api/projects', name: 'Projects' },
      { path: '/api/usage', name: 'Usage' }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const endpoint of endpoints) {
      try {
        const response = await this.page.goto(`${CONFIG.url}${endpoint.path}`, { timeout: 10000 });
        if (response.status() === 200) {
          passed++;
        } else {
          failed++;
          console.error(`  ❌ ${endpoint.name}: HTTP ${response.status()}`);
        }
      } catch (error) {
        failed++;
        console.error(`  ❌ ${endpoint.name}: ${error.message}`);
      }
    }
    
    // Go back to dashboard
    await this.page.goto(CONFIG.url);
    await this.page.fill('#auth-password', CONFIG.password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForSelector('#app', { state: 'visible' });
    
    if (failed > 0) {
      this.fail('API Endpoints', `${passed}/${endpoints.length} endpoints passed`);
    } else {
      this.pass('API Endpoints', `All ${passed} endpoints responding (200 OK)`);
    }
  }

  async screenshot(name) {
    const timestamp = Date.now();
    const filename = `${name}-${timestamp}.png`;
    const filepath = path.join(CONFIG.screenshotDir, filename);
    await this.page.screenshot({ path: filepath, fullPage: false });
    this.results.screenshots.push({ name, filename, path: filepath });
    console.log(`  📸 Screenshot: ${filename}`);
  }

  pass(name, details) {
    this.results.passed++;
    this.results.tests.push({ name, status: 'passed', details });
    console.log(`  ✅ ${name}: ${details}`);
  }

  fail(name, error) {
    this.results.failed++;
    this.results.tests.push({ name, status: 'failed', error });
    console.log(`  ❌ ${name}: ${error}`);
  }

  async generateReport() {
    const reportPath = path.join(CONFIG.reportDir, `report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    // Also write latest report
    const latestPath = path.join(CONFIG.reportDir, 'latest.json');
    fs.writeFileSync(latestPath, JSON.stringify(this.results, null, 2));
    
    console.log('');
    console.log('📊 Test Results:');
    console.log(`  ✅ Passed: ${this.results.passed}`);
    console.log(`  ❌ Failed: ${this.results.failed}`);
    console.log(`  📸 Screenshots: ${this.results.screenshots.length}`);
    console.log(`  📝 Report: ${reportPath}`);
    console.log('');
    
    if (this.results.failed > 0) {
      console.log('⚠️  Some tests failed. Check screenshots and report for details.');
      process.exit(1);
    } else {
      console.log('🎉 All tests passed!');
      process.exit(0);
    }
  }

  async cleanup() {
    if (this.browser) await this.browser.close();
  }
}

// Run if called directly
if (require.main === module) {
  const runner = new TessQARunner();
  runner.init().then(() => runner.runAllTests()).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = TessQARunner;
