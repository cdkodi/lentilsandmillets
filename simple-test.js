const { chromium } = require('playwright');

async function simpleTest() {
  console.log('🚀 Testing article page directly...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate directly to the article page
    await page.goto('http://localhost:3000/articles/the-ancient-grain-powering-modern-health', { waitUntil: 'networkidle' });
    
    // Check if we get "Article not found" or actual content
    const notFoundText = await page.locator('text=Article Not Found').count();
    const articleTitle = await page.locator('h1').count();
    
    if (notFoundText > 0) {
      console.log('❌ Article shows "Article Not Found" error');
    } else if (articleTitle > 0) {
      const title = await page.locator('h1').textContent();
      console.log(`✅ Article loaded successfully: "${title}"`);
    } else {
      console.log('⚠️ Unclear article state');
    }
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'article-test.png' });
    console.log('📸 Screenshot saved as article-test.png');
    
    await page.waitForTimeout(5000); // Keep browser open for manual inspection
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

simpleTest().catch(console.error);