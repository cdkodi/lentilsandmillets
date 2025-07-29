# Frontend Card-Based CMS Test Plan

## Test Categories

### 1. Card Position Tests
**Purpose**: Verify articles appear in correct card positions

#### Home Page Card Positions
- [ ] **H4-H6 (Lentils Facts)**: Articles with these positions appear in lentils factoid section
- [ ] **H12-H14 (Millets Facts)**: Articles with these positions appear in millets factoid section  
- [ ] **H7-H9 (Lentils Collection)**: Articles/recipes appear in lentils varieties section
- [ ] **H15-H17 (Millets Collection)**: Articles/recipes appear in millets varieties section
- [ ] **H10-H11 (Lentils Recipes)**: Recipes appear in lentils featured recipes
- [ ] **H18-H19 (Millets Recipes)**: Recipes appear in millets featured recipes

#### Content Exclusion Tests
- [ ] **Research Sections**: Only show articles WITHOUT card_position assignments
- [ ] **No Duplicates**: Articles with card positions don't appear in generic sections

### 2. Navigation & Routing Tests
**Purpose**: Verify all links work correctly

#### Article Navigation
- [ ] **Factoid Card Click**: Opens correct article page
- [ ] **Research Card Click**: Opens correct article page
- [ ] **Article Page Load**: Shows full article content
- [ ] **Article Not Found**: Proper 404 handling for missing articles
- [ ] **Back Navigation**: Return to previous page works

#### Recipe Navigation  
- [ ] **Recipe Card Click**: Opens correct recipe page
- [ ] **Recipe Page Load**: Shows full recipe content
- [ ] **Recipe Not Found**: Proper 404 handling for missing recipes

### 3. Image Integration Tests
**Purpose**: Verify image management system works

#### Image Display
- [ ] **Factoid Cards**: Show optimized hero images
- [ ] **Article Pages**: Display hero images correctly
- [ ] **Image Variants**: Correct variants load for different contexts
- [ ] **Image Fallbacks**: Broken images show proper fallbacks
- [ ] **Loading States**: Images show loading states

#### Image Optimization
- [ ] **WebP Support**: Modern browsers get WebP variants
- [ ] **JPEG Fallback**: Legacy browsers get JPEG variants
- [ ] **Responsive Images**: Correct sizes for different devices

### 4. Content Management Tests
**Purpose**: Verify CMS integration works

#### Data Fetching
- [ ] **API Responses**: All CMS APIs return correct data
- [ ] **Loading States**: Components show loading while fetching
- [ ] **Error Handling**: Network errors handled gracefully
- [ ] **Empty States**: No content scenarios handled properly

#### Content Display
- [ ] **Article Metadata**: Title, author, dates display correctly
- [ ] **Factoid Data**: Statistics and highlights show properly
- [ ] **Recipe Data**: Ingredients, instructions, timing display correctly
- [ ] **Categories**: Lentils/millets content properly categorized

### 5. User Experience Tests  
**Purpose**: Verify smooth user interactions

#### Interactive Elements
- [ ] **Hover States**: Cards show hover effects
- [ ] **Click Feedback**: Buttons provide visual feedback
- [ ] **Scroll Behavior**: Smooth scrolling between sections
- [ ] **Responsive Design**: Works on mobile/tablet/desktop

#### Performance
- [ ] **Page Load Speed**: Pages load within 2 seconds
- [ ] **Image Loading**: Images don't block page rendering
- [ ] **API Response Time**: CMS data loads quickly
- [ ] **Smooth Animations**: No janky transitions

## Automated Test Implementation

### Basic Navigation Test
```javascript
// test-navigation.js
const { chromium } = require('playwright');

async function testBasicNavigation() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Test home page loads
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('domcontentloaded');
  
  // Test millets factoid section
  const milletsSection = await page.locator('text=Millet Nutritional Facts');
  await expect(milletsSection).toBeVisible();
  
  // Test factoid card click
  const factoidCard = await page.locator('.factoid-card').first();
  await factoidCard.click();
  
  // Verify navigation worked
  await page.waitForURL('**/articles/**');
  await expect(page.locator('h1')).toBeVisible();
  
  await browser.close();
}
```

### Article Page Test
```javascript
// test-article-pages.js  
async function testArticlePages() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Test specific article
  await page.goto('http://localhost:3000/articles/the-ancient-grain-powering-modern-health');
  
  // Check article content loads
  await expect(page.locator('h1')).toContainText('Ancient Grain');
  await expect(page.locator('.hero-image')).toBeVisible();
  await expect(page.locator('.article-content')).toBeVisible();
  
  await browser.close();
}
```

### Card Position Test
```javascript
// test-card-positions.js
async function testCardPositions() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  
  // Test H12 position (millets facts)
  const milletsFactsSection = await page.locator('text=Millet Nutritional Facts').locator('..');
  const factoidCards = await milletsFactsSection.locator('.factoid-card').all();
  
  // Verify Pearl Millets appears in factoids (not research)
  let foundInFactoids = false;
  for (const card of factoidCards) {
    const text = await card.textContent();
    if (text.includes('Ancient Grain')) {
      foundInFactoids = true;
      break;
    }
  }
  
  expect(foundInFactoids).toBe(true);
  
  await browser.close();
}
```

## Test Execution Strategy

### Development Workflow
1. **Before Making Changes**: Run relevant tests to establish baseline
2. **After Making Changes**: Run full test suite to verify nothing broke  
3. **Before Committing**: Run critical path tests
4. **CI/CD Pipeline**: Automated test execution on deployments

### Test Prioritization
1. **Critical**: Navigation, article pages, card positions
2. **Important**: Image loading, CMS integration, responsive design  
3. **Nice-to-have**: Animation smoothness, advanced UX features

### Manual Testing Checklist
- [ ] Click every factoid card - should open correct article
- [ ] Check each card position shows correct content
- [ ] Verify images load properly across different screen sizes
- [ ] Test error scenarios (network issues, missing content)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)