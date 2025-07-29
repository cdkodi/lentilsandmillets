const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to CMS page...');
    await page.goto('http://localhost:3000/cms');
    await page.waitForLoadState('networkidle');
    
    console.log('Taking screenshot...');
    await page.screenshot({ 
      path: 'cms-screenshot.png', 
      fullPage: true 
    });
    
    console.log('Getting page title and content...');
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check if CSS is loading
    const stylesheets = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.map(link => link.href);
    });
    console.log('Stylesheets loaded:', stylesheets);
    
    // Check for any errors
    const errors = await page.evaluate(() => {
      return window.console?.errors || [];
    });
    
    // Get the main content structure
    const mainContent = await page.evaluate(() => {
      const main = document.querySelector('main');
      return main ? main.innerHTML.substring(0, 500) : 'No main content found';
    });
    console.log('Main content preview:', mainContent);
    
    console.log('Screenshot saved as cms-screenshot.png');
    
  } catch (error) {
    console.error('Error accessing CMS:', error);
  } finally {
    await browser.close();
  }
})();