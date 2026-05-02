import { test, expect, chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://hub.picerasgroup.com';
const PASSWORD = process.env.DASHBOARD_PASSWORD || 'piceras2026command';

test.describe('Piceras Command Dashboard', () => {
    let browser;
    let page;

    test.beforeAll(async () => {
        browser = await chromium.launch({ headless: true });
    });

    test.afterAll(async () => {
        await browser.close();
    });

    test.beforeEach(async () => {
        page = await browser.newPage();
        await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    });

    test.afterEach(async () => {
        await page.close();
    });

    test('Auth gate loads with password field', async () => {
        await expect(page.locator('#auth-gate')).toBeVisible();
        await expect(page.locator('#auth-password')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('Login with correct password', async () => {
        await page.fill('#auth-password', PASSWORD);
        await page.click('button[type="submit"]');
        await expect(page.locator('#app')).toBeVisible();
        await expect(page.locator('#auth-gate')).toBeHidden();
    });

    test('All 10 agents displayed', async () => {
        await page.fill('#auth-password', PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForSelector('.agent-card', { timeout: 5000 });
        const agents = await page.locator('.agent-card').count();
        expect(agents).toBe(10);
    });

    test('Navigation tabs work', async () => {
        await page.fill('#auth-password', PASSWORD);
        await page.click('button[type="submit"]');
        
        const tabs = ['agents', 'skills', 'projects', 'usage', 'telegram', 'messages'];
        for (const tab of tabs) {
            await page.click(`[data-section="${tab}"]`);
            await expect(page.locator(`#${tab}`)).toHaveClass(/active/);
        }
    });

    test('Skills section loads with search', async () => {
        await page.fill('#auth-password', PASSWORD);
        await page.click('button[type="submit"]');
        await page.click('[data-section="skills"]');
        await expect(page.locator('#skills-search')).toBeVisible();
        await page.fill('#skills-search', 'github');
        const skills = await page.locator('.skill-row').count();
        expect(skills).toBeGreaterThan(0);
    });

    test('Kanban board has columns', async () => {
        await page.fill('#auth-password', PASSWORD);
        await page.click('button[type="submit"]');
        await page.click('[data-section="projects"]');
        const columns = await page.locator('.kanban-column').count();
        expect(columns).toBe(4);
    });

    test('Telegram chat interface loads', async () => {
        await page.fill('#auth-password', PASSWORD);
        await page.click('button[type="submit"]');
        await page.click('[data-section="telegram"]');
        await expect(page.locator('#telegram-input')).toBeVisible();
        await expect(page.locator('#telegram-send')).toBeVisible();
    });

    test('Usage stats display correctly', async () => {
        await page.fill('#auth-password', PASSWORD);
        await page.click('button[type="submit"]');
        await page.click('[data-section="usage"]');
        await expect(page.locator('#usage-tokens')).not.toBeEmpty();
        await expect(page.locator('#usage-cost')).not.toBeEmpty();
    });

    test('Mobile responsive - bottom nav visible', async () => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.reload();
        await page.fill('#auth-password', PASSWORD);
        await page.click('button[type="submit"]');
        await expect(page.locator('.bottom-nav')).toBeVisible();
    });

    test('API endpoints respond', async () => {
        const endpoints = ['/api/health', '/api/agents', '/api/skills', '/api/projects', '/api/usage'];
        for (const endpoint of endpoints) {
            const response = await page.goto(`${BASE_URL}${endpoint}`);
            expect(response.status()).toBe(200);
            await page.goBack();
        }
    });

    test('Screenshot of each section', async () => {
        await page.fill('#auth-password', PASSWORD);
        await page.click('button[type="submit"]');
        
        const tabs = ['agents', 'skills', 'projects', 'usage'];
        for (const tab of tabs) {
            await page.click(`[data-section="${tab}"]`);
            await page.waitForTimeout(500);
            await page.screenshot({ path: `screenshots/${tab}.png`, fullPage: false });
        }
    });
});
