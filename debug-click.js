const { chromium } = require('playwright');

async function debugClick() {
  console.log('🐛 Debugging factoid card click...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for console logs and errors
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // Look for factoid cards specifically
    console.log('🔍 Looking for factoid cards...');
    
    // Find cards in the factoid sections
    const factoidCards = await page.locator('.factoid-card, [data-testid="factoid-card"], .group.relative.overflow-hidden.rounded-2xl.cursor-pointer').all();
    console.log(`Found ${factoidCards.length} potential factoid cards`);
    
    if (factoidCards.length > 0) {
      // Get text from first few cards to see what we're clicking
      for (let i = 0; i < Math.min(3, factoidCards.length); i++) {
        const cardText = await factoidCards[i].textContent();
        console.log(`Card ${i + 1}: ${cardText?.substring(0, 100)}...`);
      }
      
      // Try clicking the first card
      console.log('🖱️ Clicking first factoid card...');
      
      // Add a click event listener to the page to see what happens
      await page.evaluate(() => {
        window.addEventListener('click', (e) => {
          console.log('Click detected on:', e.target);
          console.log('Click event target classes:', e.target.className);
        });
      });
      
      await factoidCards[0].click();
      
      console.log('✅ Click completed, waiting for navigation...');
      await page.waitForTimeout(5000);
      
      const currentUrl = page.url();
      console.log(`Current URL: ${currentUrl}`);
      
    } else {
      console.log('❌ No factoid cards found');
    }
    
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugClick().catch(console.error);