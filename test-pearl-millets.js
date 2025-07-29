const { chromium } = require('playwright');

async function testPearlMillets() {
  console.log('🔍 Testing Pearl Millets article specifically...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for console logs and errors
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000); // Wait longer for API calls
    
    console.log('🔍 Looking specifically for Pearl Millets/Ancient Grain content...');
    
    // Wait for millets section to load
    await page.locator('h2:has-text("Millet Nutritional Facts")').first().waitFor({ timeout: 10000 });
    
    // Look for cards containing "Ancient" in the millets section
    const ancientCards = await page.locator('div:has-text("Ancient Grain")').all();
    console.log(`Found ${ancientCards.length} cards with "Ancient Grain" text`);
    
    if (ancientCards.length > 0) {
      // Check which card is clickable and contains the full title
      for (let i = 0; i < ancientCards.length; i++) {
        const card = ancientCards[i];
        const cardText = await card.textContent();
        const isClickable = await card.evaluate(el => {
          const style = window.getComputedStyle(el);
          return style.cursor === 'pointer' || el.onclick !== null;
        });
        
        console.log(`Card ${i + 1}: Clickable: ${isClickable}`);
        console.log(`Text: ${cardText?.substring(0, 150)}...`);
        
        if (isClickable) {
          console.log(`🖱️ Clicking clickable card ${i + 1}...`);
          
          // Try to capture the click and any navigation
          const navigationPromise = page.waitForNavigation({ timeout: 5000 }).catch(() => null);
          await card.click();
          
          const navigation = await navigationPromise;
          if (navigation) {
            console.log(`✅ Navigated to: ${page.url()}`);
            
            // Check if article loads properly
            const notFound = await page.locator('text=Article Not Found').count();
            if (notFound > 0) {
              console.log('❌ Article shows "Article Not Found" error');
            } else {
              const title = await page.locator('h1').textContent({ timeout: 5000 });
              console.log(`✅ Article loaded: "${title}"`);
            }
          } else {
            console.log('⚠️ No navigation occurred');
            
            // Check if a new tab opened
            const pages = await browser.pages();
            if (pages.length > 1) {
              console.log('✅ New tab detected');
              const newPage = pages[pages.length - 1];
              await newPage.waitForLoadState('domcontentloaded');
              
              const newUrl = newPage.url();
              console.log(`New tab URL: ${newUrl}`);
              
              if (newUrl.includes('/articles/')) {
                const notFound = await newPage.locator('text=Article Not Found').count();
                if (notFound > 0) {
                  console.log('❌ Article shows "Article Not Found" error');
                } else {
                  const title = await newPage.locator('h1').textContent({ timeout: 5000 });
                  console.log(`✅ Article loaded in new tab: "${title}"`);
                }
              }
            }
          }
          break;
        }
      }
    } else {
      console.log('❌ No cards with "Ancient Grain" text found');
      
      // Look for any CMS content
      const cmsCards = await page.locator('[data-card-position], .factoid-card').all();
      console.log(`Found ${cmsCards.length} CMS cards`);
    }
    
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testPearlMillets().catch(console.error);