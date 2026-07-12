import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = 'C:\\Users\\harsh\\Pictures\\wwebiste';
fs.mkdirSync(OUT_DIR, { recursive: true });

const BASE_URL = 'http://localhost:5173';

async function login(page, role) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const cardText = role === 'employee' ? 'Employee' : 'Manager / Admin';
  await page.locator('button', { hasText: cardText }).first().click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /Sign in to EcoSphere/i }).click();
  await page.waitForTimeout(1000);
}

async function shot(page, name) {
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT_DIR, `${name}.png`), fullPage: true });
  console.log('saved', name);
}

const managerNav = [
  ['dashboard', 'Dashboard'],
  ['environmental', 'Environmental'],
  ['explore-activities', 'Explore Activities'],
  ['governance', 'Governance'],
  ['challenges', 'Challenges'],
  ['simulator', 'Simulator'],
  ['reports', 'Reports'],
  ['settings', 'Settings'],
];

const employeeNav = [
  ['environmental', 'Environmental'],
  ['explore-activities', 'Explore Activities'],
  ['governance', 'Governance'],
  ['challenges', 'Challenges'],
  ['simulator', 'Simulator'],
  ['reports', 'Reports'],
];

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Login page
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await shot(page, '00-login');

  // Manager role
  await login(page, 'manager');
  for (const [slug, label] of managerNav) {
    await page.getByRole('button', { name: new RegExp(`^${label}$`) }).click();
    await shot(page, `manager-${slug}`);
  }

  // Employee role
  await login(page, 'employee');
  for (const [slug, label] of employeeNav) {
    await page.getByRole('button', { name: new RegExp(`^${label}$`) }).click();
    await shot(page, `employee-${slug}`);
  }

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
