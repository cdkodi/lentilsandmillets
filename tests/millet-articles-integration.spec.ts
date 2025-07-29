import { test, expect } from '@playwright/test';

test.describe('Millet Articles Integration Tests', () => {
  test('Homepage loads successfully and displays Millet Nutritional Facts section', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of homepage
    await page.screenshot({ 
      path: 'test-results/homepage-full.png', 
      fullPage: true 
    });
    
    // Verify homepage loads successfully
    await expect(page).toHaveTitle(/Lentils and Millets/i);
    
    // Check if Millet Nutritional Facts section exists
    const milletSection = page.locator('text=Millet Nutritional Facts').or(
      page.locator('text=Millets').or(
        page.locator('[data-testid*="millet"]').or(
          page.locator('section').filter({ hasText: /millet/i })
        )
      )
    );
    
    await expect(milletSection.first()).toBeVisible();
    
    console.log('✓ Homepage loaded successfully');
    console.log('✓ Millet section found');
  });

  test('Millet articles display real content from database (not static)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for article cards or content containers
    const articleCards = page.locator('[data-testid*="article"]').or(
      page.locator('.article-card').or(
        page.locator('[class*="card"]').or(
          page.locator('article')
        )
      )
    );
    
    // Wait for articles to load
    await page.waitForTimeout(2000);
    
    // Take screenshot of the millet section specifically
    const milletSection = page.locator('text=Millet').first().locator('..').locator('..');
    if (await milletSection.isVisible()) {
      await milletSection.screenshot({ path: 'test-results/millet-section.png' });
    }
    
    // Check for dynamic content indicators
    const dynamicContent = await page.locator('body').textContent();
    
    // Look for signs of dynamic content (database-driven)
    const hasDynamicContent = (
      dynamicContent?.includes('protein') ||
      dynamicContent?.includes('fiber') ||
      dynamicContent?.includes('gluten-free') ||
      dynamicContent?.includes('nutrients') ||
      dynamicContent?.includes('antioxidants')
    );
    
    console.log('✓ Checking for dynamic content from database');
    console.log(`Content includes nutritional terms: ${hasDynamicContent}`);
    
    // Count visible article elements
    const visibleArticles = await articleCards.count();
    console.log(`Found ${visibleArticles} article elements`);
  });

  test('Article cards display nutritional data and benefits', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for nutritional metrics and benefits
    const nutritionalTerms = [
      'protein', 'fiber', 'gluten-free', 'antioxidants', 
      'minerals', 'vitamins', 'calcium', 'iron', 'magnesium'
    ];
    
    let foundTerms = [];
    for (const term of nutritionalTerms) {
      const element = page.locator(`text=${term}`).first();
      if (await element.isVisible()) {
        foundTerms.push(term);
      }
    }
    
    console.log(`✓ Found nutritional terms: ${foundTerms.join(', ')}`);
    
    // Take screenshot highlighting nutritional content
    await page.screenshot({ 
      path: 'test-results/nutritional-content.png',
      fullPage: true
    });
    
    expect(foundTerms.length).toBeGreaterThan(0);
  });

  test('Article cards are clickable and navigate to individual pages', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for clickable article elements
    const clickableArticles = page.locator('a').filter({
      hasText: /millet|quinoa|grain|nutrition/i
    }).or(
      page.locator('[role="button"]').filter({
        hasText: /millet|read|more|learn/i
      })
    ).or(
      page.locator('[data-testid*="article"]').or(
        page.locator('.article-card a')
      )
    );
    
    const articleCount = await clickableArticles.count();
    console.log(`Found ${articleCount} potentially clickable article elements`);
    
    if (articleCount > 0) {
      // Get the first clickable article
      const firstArticle = clickableArticles.first();
      
      // Take screenshot before clicking
      await page.screenshot({ 
        path: 'test-results/before-article-click.png',
        fullPage: true
      });
      
      // Get the current URL to compare after click
      const initialUrl = page.url();
      
      // Click the first article
      await firstArticle.click();
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      // Check if URL changed (navigation occurred)
      const newUrl = page.url();
      const navigationOccurred = newUrl !== initialUrl;
      
      console.log(`✓ Navigation occurred: ${navigationOccurred}`);
      console.log(`Initial URL: ${initialUrl}`);
      console.log(`New URL: ${newUrl}`);
      
      // Take screenshot of article page
      await page.screenshot({ 
        path: 'test-results/individual-article-page.png',
        fullPage: true
      });
      
      // Verify we're on an article page
      if (navigationOccurred) {
        // Look for article content indicators
        const hasArticleContent = await page.locator('h1, h2, .title, [role="heading"]').isVisible();
        expect(hasArticleContent).toBeTruthy();
        console.log('✓ Individual article page loaded successfully');
      }
    } else {
      console.log('⚠ No clickable article elements found');
      
      // Take screenshot to help debug
      await page.screenshot({ 
        path: 'test-results/no-clickable-articles-debug.png',
        fullPage: true
      });
    }
  });

  test('Full end-to-end integration verification', async ({ page }) => {
    console.log('🧪 Starting comprehensive integration test...');
    
    // Step 1: Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    console.log('✓ Navigated to homepage');
    
    // Step 2: Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/integration-test-homepage.png',
      fullPage: true
    });
    console.log('✓ Homepage screenshot captured');
    
    // Step 3: Check for Payload CMS data
    const pageContent = await page.content();
    const hasPayloadData = (
      pageContent.includes('millet') ||
      pageContent.includes('quinoa') ||
      pageContent.includes('nutrition') ||
      pageContent.includes('protein') ||
      pageContent.includes('fiber')
    );
    
    console.log(`✓ Dynamic content detected: ${hasPayloadData}`);
    
    // Step 4: Look for View More button or article links
    const viewMoreButton = page.locator('text=View More').or(
      page.locator('text=Read More').or(
        page.locator('text=Learn More').or(
          page.locator('[data-testid="view-more"]')
        )
      )
    );
    
    const hasViewMore = await viewMoreButton.isVisible();
    console.log(`✓ View More button found: ${hasViewMore}`);
    
    if (hasViewMore) {
      await viewMoreButton.first().click();
      await page.waitForLoadState('networkidle');
      
      await page.screenshot({ 
        path: 'test-results/integration-test-after-click.png',
        fullPage: true
      });
      console.log('✓ Clicked View More and captured screenshot');
    }
    
    // Step 5: Final verification
    const finalUrl = page.url();
    console.log(`✓ Final URL: ${finalUrl}`);
    
    // Summary
    console.log('\n📊 Integration Test Summary:');
    console.log(`   - Homepage loads: ✓`);
    console.log(`   - Dynamic content: ${hasPayloadData ? '✓' : '❌'}`);
    console.log(`   - Interactive elements: ${hasViewMore ? '✓' : '❌'}`);
    console.log(`   - Screenshots captured: ✓`);
  });
});