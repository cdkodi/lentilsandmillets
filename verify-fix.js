const { chromium } = require('playwright');

async function verifyArticleFix() {
  console.log('🔍 Verifying Pearl Millets article fix...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Test 1: Home page loads
    console.log('📖 Loading home page...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000); // Wait for API calls to complete
    
    // Test 2: Look for the Pearl Millets article in factoids
    console.log('🔍 Looking for Pearl Millets in factoid section...');
    
    // Scroll to millets section
    await page.evaluate(() => {
      const headers = document.querySelectorAll('h2');
      for (const header of headers) {
        if (header.textContent.includes('Millet') || header.textContent.includes('Millets')) {
          header.scrollIntoView();
          break;
        }
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Look for any clickable card or link with "Ancient Grain" text
    const cards = await page.locator('div, a, button').filter({ hasText: 'Ancient Grain' }).all();
    
    if (cards.length > 0) {
      console.log(`✅ Found ${cards.length} card(s) with "Ancient Grain" text`);
      
      // Click the first card
      console.log('🖱️ Clicking first Ancient Grain card...');
      
      // Listen for new tabs/pages
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        cards[0].click()
      ]);
      
      if (newPage) {
        console.log('✅ New tab opened successfully');
        
        // Wait for the new page to load
        await newPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
        
        const newUrl = newPage.url();
        console.log(`📍 New tab URL: ${newUrl}`);
        
        if (newUrl.includes('/articles/')) {
          // Check article content
          const articleTitle = await newPage.locator('h1').textContent({ timeout: 5000 });
          const notFound = await newPage.locator('text=Article Not Found').count();
          
          if (notFound > 0) {
            console.log('❌ Article page shows "Article Not Found" error');
          } else {
            console.log(`✅ Article loaded successfully: "${articleTitle}"`);
          }
        } else {
          console.log('⚠️ New tab did not navigate to article page');
        }
        
        await newPage.close();
        
      } else {
        console.log('⚠️ No new tab opened, checking current page...');
        
        // Fallback: check if current page navigated
        const currentUrl = page.url();
        console.log(`📍 Current URL: ${currentUrl}`);
        
        if (currentUrl.includes('/articles/')) {
          const articleTitle = await page.locator('h1').textContent({ timeout: 5000 });
          const notFound = await page.locator('text=Article Not Found').count();
          
          if (notFound > 0) {
            console.log('❌ Article page shows "Article Not Found" error');
          } else {
            console.log(`✅ Article loaded successfully: "${articleTitle}"`);
          }
        } else {
          console.log('⚠️ Did not navigate to article page');
        }
      }
      
    } else {
      console.log('❌ No cards with "Ancient Grain" text found');
    }
    
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

verifyArticleFix().catch(console.error);