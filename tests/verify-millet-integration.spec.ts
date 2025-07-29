import { test, expect } from '@playwright/test';

test('Verify Millet Articles Integration - Focused Test', async ({ page }) => {
  console.log('🚀 Starting focused millet articles integration test...');
  
  // Navigate to homepage
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Wait for the API call to complete and articles to load
  await page.waitForTimeout(3000);
  
  console.log('✓ Homepage loaded, waiting for millet articles to load');
  
  // Take a full page screenshot
  await page.screenshot({ 
    path: 'test-results/millet-integration-full-page.png',
    fullPage: true 
  });
  
  // Specifically check for "Millet Nutritional Facts" heading
  const milletFactsHeading = page.locator('h1:has-text("Millet Nutritional Facts")');
  await expect(milletFactsHeading).toBeVisible();
  console.log('✓ Found "Millet Nutritional Facts" heading');
  
  // Take a focused screenshot of the Millet Nutritional Facts section
  const milletSection = page.locator('h1:has-text("Millet Nutritional Facts")').locator('..').locator('..');
  await milletSection.screenshot({ 
    path: 'test-results/millet-nutritional-facts-section.png' 
  });
  
  // Check for article cards with nutritional data
  const articleCards = page.locator('.group.cursor-pointer').filter({
    has: page.locator('text=MILLETS')
  });
  
  const cardCount = await articleCards.count();
  console.log(`✓ Found ${cardCount} millet article cards`);
  
  if (cardCount > 0) {
    // Check the first article card for nutritional data
    const firstCard = articleCards.first();
    
    // Look for metric values (like "200mg", "80 mg", etc.)
    const hasMetrics = await firstCard.locator('div').filter({
      hasText: /\d+\s*(mg|g|%)/
    }).count() > 0;
    
    console.log(`✓ First card has nutritional metrics: ${hasMetrics}`);
    
    // Try to click on the first article card and verify navigation
    console.log('🖱️ Attempting to click on first millet article...');
    
    const initialUrl = page.url();
    await firstCard.click();
    
    // Wait for potential navigation or modal
    await page.waitForTimeout(2000);
    
    const newUrl = page.url();
    const hasNavigated = newUrl !== initialUrl;
    
    console.log(`Initial URL: ${initialUrl}`);
    console.log(`New URL: ${newUrl}`);
    console.log(`✓ Navigation occurred: ${hasNavigated}`);
    
    if (hasNavigated) {
      // Take screenshot of the article page
      await page.screenshot({ 
        path: 'test-results/individual-millet-article-page.png',
        fullPage: true 
      });
      console.log('✓ Individual article page screenshot captured');
    } else {
      // Check if a modal or overlay opened instead
      const modal = page.locator('[role="dialog"], .modal, .overlay');
      const hasModal = await modal.count() > 0;
      console.log(`Modal/overlay opened: ${hasModal}`);
    }
  }
  
  // Verify specific nutritional terms are present
  const nutritionalTerms = [
    'protein', 'calcium', 'fiber', 'gluten-free', 
    'iron', 'magnesium', 'antioxidants', 'minerals'
  ];
  
  let foundTerms = [];
  for (const term of nutritionalTerms) {
    const termExists = await page.locator(`text=${term}`).count() > 0;
    if (termExists) {
      foundTerms.push(term);
    }
  }
  
  console.log(`✓ Found nutritional terms: ${foundTerms.join(', ')}`);
  
  // Final summary
  console.log('\n📊 Millet Integration Test Results:');
  console.log(`   ✓ Homepage loads successfully`);
  console.log(`   ✓ Millet Nutritional Facts section visible`);
  console.log(`   ✓ Found ${cardCount} article cards from database`);
  console.log(`   ✓ Nutritional terms present: ${foundTerms.length > 0}`);
  console.log(`   ✓ Screenshots captured for verification`);
  
  // Ensure we have actual content from the database
  expect(cardCount).toBeGreaterThan(0);
  expect(foundTerms.length).toBeGreaterThan(2);
});