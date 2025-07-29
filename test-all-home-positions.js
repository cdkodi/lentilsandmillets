const { chromium } = require('playwright');

async function testAllHomePagePositions() {
  console.log('🏠 Testing all Home Page content positions for API readiness...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for all network requests to track API calls
  const apiCalls = [];
  page.on('request', request => {
    if (request.url().includes('/api/cms/')) {
      apiCalls.push({
        url: request.url(),
        method: request.method()
      });
    }
  });
  
  // Listen for API responses
  const apiResponses = [];
  page.on('response', response => {
    if (response.url().includes('/api/cms/')) {
      apiResponses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for all API calls to complete
    console.log('⏳ Waiting for API calls to complete...');
    await page.waitForTimeout(8000);
    
    console.log('\n📊 API Calls Made:');
    const uniquePositions = new Set();
    
    apiCalls.forEach((call, index) => {
      console.log(`${index + 1}. ${call.method} ${call.url}`);
      
      // Extract card position from URL
      const positionMatch = call.url.match(/card_position=([^&]+)/);
      if (positionMatch) {
        uniquePositions.add(positionMatch[1]);
      }
    });
    
    console.log('\n📋 Card Positions Being Queried:');
    const sortedPositions = Array.from(uniquePositions).sort();
    sortedPositions.forEach(position => {
      console.log(`  - ${position}`);
    });
    
    console.log('\n🌐 API Response Status:');
    apiResponses.forEach((response, index) => {
      const status = response.status === 200 ? '✅' : '❌';
      console.log(`${status} ${response.status} - ${response.url}`);
    });
    
    // Test specific positions that should be called
    const expectedPositions = {
      'Lentils Facts': ['H4', 'H5', 'H6'],
      'Millets Facts': ['H12', 'H13', 'H14'],
      'Lentils Collection': ['H7', 'H8', 'H9', 'H10', 'H11'],
      'Millets Collection': ['H15', 'H16', 'H17', 'H18', 'H19']
    };
    
    console.log('\n🎯 Expected vs Actual Position Coverage:');
    for (const [section, positions] of Object.entries(expectedPositions)) {
      console.log(`\n${section}:`);
      positions.forEach(pos => {
        const isCalled = sortedPositions.includes(pos);
        const status = isCalled ? '✅' : '⚠️ ';
        console.log(`  ${status} ${pos} ${isCalled ? '(API called)' : '(not called yet)'}`);
      });
    }
    
    // Check for any sections that might be missing API integration
    console.log('\n🔍 Checking for sections without CMS integration...');
    
    // Look for sections that might be using hardcoded data
    const sections = await page.locator('section, div[class*="section"]').all();
    let hardcodedSections = 0;
    
    for (let i = 0; i < Math.min(sections.length, 10); i++) {
      const sectionText = await sections[i].textContent();
      if (sectionText && sectionText.length > 100) {
        const hasStaticData = sectionText.includes('Quick-Cooking') || 
                             sectionText.includes('Fiber Champion') ||
                             sectionText.includes('Climate-Resilient');
        if (hasStaticData && !sectionText.includes('Ancient Grain')) {
          hardcodedSections++;
        }
      }
    }
    
    console.log(`📊 Found ${hardcodedSections} sections potentially using hardcoded data`);
    
    // Summary
    console.log('\n📈 SUMMARY:');
    console.log(`✅ Total API calls made: ${apiCalls.length}`);
    console.log(`✅ Unique positions queried: ${uniquePositions.size}`);
    console.log(`✅ Successful responses: ${apiResponses.filter(r => r.status === 200).length}`);
    console.log(`⚠️  Failed responses: ${apiResponses.filter(r => r.status !== 200).length}`);
    
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testAllHomePagePositions().catch(console.error);