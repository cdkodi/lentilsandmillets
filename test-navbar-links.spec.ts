import { test, expect } from '@playwright/test';

test.describe('Production Navbar Links Test', () => {
  const PRODUCTION_URL = 'https://lentilsandmillets.vercel.app';

  test('should navigate to all navbar links successfully', async ({ page }) => {
    // Go to production homepage
    await page.goto(PRODUCTION_URL);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of homepage
    await page.screenshot({ path: 'homepage-production.png', fullPage: true });
    
    console.log('Testing navbar links on production site...');
    
    // Test Lentils link
    await test.step('Test Lentils link', async () => {
      console.log('Testing Lentils link...');
      
      // Find and click the Lentils link
      const lentilsLink = page.locator('nav a[href*="lentils"], nav a:has-text("Lentils")');
      await expect(lentilsLink).toBeVisible();
      
      await lentilsLink.click();
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      // Check if we're on the lentils page
      const currentUrl = page.url();
      console.log(`After clicking Lentils: ${currentUrl}`);
      
      // Take screenshot
      await page.screenshot({ path: 'lentils-page-production.png', fullPage: true });
      
      // Check page content or URL
      if (currentUrl.includes('lentils')) {
        console.log('✅ Lentils page loaded successfully');
      } else {
        console.log('❌ Lentils page did not load correctly');
        // Check if there's any error content
        const bodyText = await page.textContent('body');
        console.log('Page content:', bodyText?.substring(0, 200));
      }
    });
    
    // Go back to homepage
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');
    
    // Test Millets link
    await test.step('Test Millets link', async () => {
      console.log('Testing Millets link...');
      
      const milletsLink = page.locator('nav a[href*="millets"], nav a:has-text("Millets")');
      await expect(milletsLink).toBeVisible();
      
      await milletsLink.click();
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      console.log(`After clicking Millets: ${currentUrl}`);
      
      // Take screenshot
      await page.screenshot({ path: 'millets-page-production.png', fullPage: true });
      
      if (currentUrl.includes('millets')) {
        console.log('✅ Millets page loaded successfully');
      } else {
        console.log('❌ Millets page did not load correctly');
        const bodyText = await page.textContent('body');
        console.log('Page content:', bodyText?.substring(0, 200));
      }
    });
    
    // Go back to homepage
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');
    
    // Test Recipes link
    await test.step('Test Recipes link', async () => {
      console.log('Testing Recipes link...');
      
      const recipesLink = page.locator('nav a[href*="recipes"], nav a:has-text("Recipes")');
      await expect(recipesLink).toBeVisible();
      
      await recipesLink.click();
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      console.log(`After clicking Recipes: ${currentUrl}`);
      
      // Take screenshot
      await page.screenshot({ path: 'recipes-page-production.png', fullPage: true });
      
      if (currentUrl.includes('recipes')) {
        console.log('✅ Recipes page loaded successfully');
      } else {
        console.log('❌ Recipes page did not load correctly');
        const bodyText = await page.textContent('body');
        console.log('Page content:', bodyText?.substring(0, 200));
      }
    });
  });

  test('should inspect navbar structure', async ({ page }) => {
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');
    
    console.log('Inspecting navbar structure...');
    
    // Find all navigation links
    const navLinks = await page.locator('nav a').all();
    
    console.log(`Found ${navLinks.length} navigation links:`);
    
    for (let i = 0; i < navLinks.length; i++) {
      const link = navLinks[i];
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      console.log(`  ${i + 1}. Text: "${text}" | Href: "${href}"`);
    }
    
    // Check if there are any JavaScript errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ JavaScript Error:', msg.text());
      }
    });
    
    // Check for any network failures
    page.on('response', response => {
      if (response.status() >= 400) {
        console.log(`❌ Network Error: ${response.status()} ${response.url()}`);
      }
    });
  });

  test('should check for 404 errors', async ({ page }) => {
    const testUrls = [
      `${PRODUCTION_URL}/lentils`,
      `${PRODUCTION_URL}/millets`, 
      `${PRODUCTION_URL}/recipes`
    ];
    
    for (const url of testUrls) {
      console.log(`Testing direct navigation to: ${url}`);
      
      const response = await page.goto(url);
      const status = response?.status() || 0;
      
      console.log(`Status: ${status}`);
      
      if (status === 404) {
        console.log(`❌ 404 Not Found: ${url}`);
        await page.screenshot({ path: `404-error-${url.split('/').pop()}.png` });
      } else if (status === 200) {
        console.log(`✅ Page loads correctly: ${url}`);
      } else {
        console.log(`⚠️  Unexpected status ${status}: ${url}`);
      }
      
      // Brief wait between requests
      await page.waitForTimeout(1000);
    }
  });
});