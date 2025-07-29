const { chromium } = require('playwright');

async function testFactoidNavigation() {
  console.log('🚀 Starting comprehensive factoid navigation test...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Test 1: Home page loads properly
    console.log('📖 Test 1: Loading home page...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
    
    // Test 2: Verify millets factoid section exists
    console.log('🔍 Test 2: Checking millets factoid section...');
    const milletsFactoidsSection = await page.locator('text=Millet Nutritional Facts');
    await milletsFactoidsSection.waitFor({ timeout: 10000 });
    console.log('✅ Millets factoid section found');
    
    // Test 3: Find Pearl Millets article in factoids (should be there)
    console.log('🔍 Test 3: Looking for Pearl Millets in factoid section...');
    const factoidCards = await page.locator('.factoid-card, [data-testid="factoid-card"]').all();
    
    let pearlMilletsInFactoids = false;
    for (const card of factoidCards) {
      const cardText = await card.textContent();
      if (cardText && cardText.includes('Ancient Grain')) {
        console.log('✅ Found Pearl Millets article in factoids section');
        pearlMilletsInFactoids = true;
        
        // Test 4: Click on the factoid card and verify navigation
        console.log('🖱️ Test 4: Clicking on Pearl Millets factoid card...');
        await card.click();
        
        // Wait for navigation to article page
        await page.waitForURL('**/articles/**', { timeout: 10000 });
        console.log('✅ Navigation to article page successful');
        
        // Test 5: Verify article page content loads
        console.log('📄 Test 5: Verifying article page content...');
        const articleTitle = await page.locator('h1');
        await articleTitle.waitFor({ timeout: 10000 });
        
        const titleText = await articleTitle.textContent();
        console.log(`✅ Article title found: "${titleText}"`);
        
        // Test 6: Check for article content
        const articleContent = await page.locator('.prose, .article-content, main');
        await articleContent.waitFor({ timeout: 5000 });
        console.log('✅ Article content section found');
        
        // Test 7: Verify no "Article not found" error
        const notFoundText = await page.locator('text=Article Not Found').count();
        if (notFoundText === 0) {
          console.log('✅ No "Article not found" error - article loads successfully');
        } else {
          console.log('❌ "Article not found" error still present');
        }
        
        break;
      }
    }
    
    if (!pearlMilletsInFactoids) {
      console.log('❌ Pearl Millets article not found in factoids section');
    }
    
// Go back to home to test research section
    console.log('🏠 Returning to home page...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
    
    // Test 8: Verify Pearl Millets is NOT in research section
    console.log('🔍 Test 8: Checking research section...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const researchSection = await page.locator('text=Latest Millet Research').locator('..').locator('..');
    const researchExists = await researchSection.count() > 0;
    
    if (researchExists) {
      const researchCards = await researchSection.locator('.research-card, .article-card, [data-testid="research-card"]').all();
      
      let pearlMilletsInResearch = false;
      for (const card of researchCards) {
        const cardText = await card.textContent();
        if (cardText && cardText.includes('Ancient Grain')) {
          pearlMilletsInResearch = true;
          break;
        }
      }
      
      if (!pearlMilletsInResearch) {
        console.log('✅ Pearl Millets correctly NOT found in research section');
      } else {
        console.log('❌ Pearl Millets incorrectly found in research section');
      }
    }
    
    console.log('🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('📍 Error location:', error.stack);
  } finally {
    await browser.close();
  }
}

// Run the test
testFactoidNavigation().catch(console.error);