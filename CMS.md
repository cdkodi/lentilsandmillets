# Content Management System User Guide
## Lentils & Millets Platform

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Card-Based Content Architecture](#card-based-content-architecture)
3. [Content Types](#content-types)
4. [Image Management System](#image-management-system)
5. [Card Position Rules](#card-position-rules)
6. [Article Management](#article-management)
7. [Recipe Management](#recipe-management)
8. [Admin Interface Guide](#admin-interface-guide)
9. [Content Publishing Workflow](#content-publishing-workflow)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

---

## System Overview

The Lentils & Millets CMS uses a **card-based content management system** where every piece of content is assigned to specific card positions across the website. This approach ensures consistent layout, proper content categorization, and easy content management.

### Key Features
- **36 Total Card Positions** across 3 main pages
- **Two Content Types**: Articles and Recipes (separate structures)
- **Smart Content Validation** prevents wrong content in wrong places
- **Visual Grid Management** for easy content assignment
- **Factoid Card Display** for scientific/nutritional content
- **Professional Image Management** with automatic optimization and CDN delivery
- **Cloudflare R2 Storage** for cost-effective, high-performance image hosting

---

## Card-Based Content Architecture

### Page Structure & Card Distribution

**🏠 HOME PAGE (H0-H19) - 20 Cards**
```
Hero Section:        H0, H1, H2, H3        (4 cards)
Lentils Facts:       H4, H5, H6            (3 cards)
Lentils Collection:  H7, H8, H9            (3 cards)
Lentils Recipes:     H10, H11              (2 cards)
Millets Facts:       H12, H13, H14         (3 cards)
Millets Collection:  H15, H16, H17         (3 cards)
Millets Recipes:     H18, H19              (2 cards)
```

**🟤 LENTILS PAGE (L1-L8) - 8 Cards**
```
Lentils Facts:       L1, L2, L3            (3 cards)
Lentils Collection:  L4, L5, L6            (3 cards)
Featured Recipes:    L7, L8                (2 cards)
```

**🟡 MILLETS PAGE (M1-M8) - 8 Cards**
```
Millets Facts:       M1, M2, M3            (3 cards)
Millets Collection:  M4, M5, M6            (3 cards)
Featured Recipes:    M7, M8                (2 cards)
```

---

## Content Types

### Articles
**Purpose**: Educational content, nutritional information, variety guides
**Structure**: Title, rich text content, author, SEO metadata, factoid display options

### Recipes
**Purpose**: Cooking instructions with ingredients, nutrition, and health benefits
**Structure**: Ingredients list, step-by-step instructions, cooking times, nutritional data

---

## Image Management System

The Lentils & Millets CMS features a **professional image management system** that automatically handles image optimization, variant generation, and cloud storage. The system is designed to be completely flexible with input images while ensuring optimal performance across all devices and use cases.

### System Architecture

#### Storage Infrastructure
- **Cloudflare R2 Object Storage**: Cost-effective with zero egress fees
- **Organized Folder Structure**: Automatic categorization by content type
- **CDN Delivery**: Global content delivery for fast loading times
- **Secure Access**: API-based authentication with proper permissions

#### Automatic Processing Pipeline
Every uploaded image is automatically processed through a sophisticated pipeline:

1. **Validation**: File type, size, and dimension checking
2. **Optimization**: Quality and compression optimization  
3. **Variant Generation**: 6 different sizes for different use cases
4. **Format Conversion**: JPEG and WebP versions for browser compatibility
5. **Metadata Extraction**: Dimensions, file size, and technical details
6. **Database Storage**: Organized records with relationships to content

### Image Requirements & Guidelines

#### Input Requirements (Very Flexible)
```
File Formats:     JPEG, PNG, WebP, GIF
Maximum Size:     10 MB
Maximum Dimensions: 5000 x 5000 pixels
Minimum Recommended: 800 x 600 pixels for best quality
```

#### Recommended Source Specifications
```
Hero Images:      1600 x 900 pixels or larger (16:9 ratio)
Recipe Images:    1000 x 1250 pixels or larger (4:5 ratio)  
Article Images:   1200 x 800 pixels or larger (3:2 ratio)
General Content:  1200 x 675 pixels or larger (16:9 ratio)
```

### Automatic Variant Generation

The system automatically creates **6 optimized variants** from every uploaded image:

#### Image Variants Specification
```
🖼️ Hero Large     1200 x 675   (16:9)  Quality: 85%  - Main hero sections
📱 Mobile         800 x 450    (16:9)  Quality: 80%  - Mobile optimization  
🃏 Card Medium    600 x 400    (3:2)   Quality: 80%  - Article cards
🍽️ Recipe Hero    800 x 1000   (4:5)   Quality: 85%  - Recipe cards
📎 Thumbnail      300 x 200    (3:2)   Quality: 75%  - Previews & lists
📱 Social         1200 x 630   (1.9:1) Quality: 85%  - Social media sharing
```

#### Format Generation
- **JPEG Versions**: Progressive JPEG for faster loading
- **WebP Versions**: Modern format for 40-60% smaller file sizes
- **Automatic Fallbacks**: Browser-compatible delivery

### Smart Cropping Strategy

The system uses intelligent cropping to ensure perfect composition:

- **Cover Fitting**: Images fill the target dimensions completely
- **Center Positioning**: Preserves the most important part of the image
- **No Distortion**: Maintains original aspect ratio through cropping
- **Quality Preservation**: Optimized compression without visual loss

### File Organization Structure

Images are automatically organized in Cloudflare R2:

```
lentils-millets-images/
├── lentils/
│   ├── 1704123456_red-lentil-curry.jpg         (original)
│   ├── 1704123456_red-lentil-curry_hero_large.jpg
│   ├── 1704123456_red-lentil-curry_card_medium.jpg
│   ├── 1704123456_red-lentil-curry_thumbnail.jpg
│   ├── 1704123456_red-lentil-curry_mobile.webp
│   ├── 1704123456_red-lentil-curry_social.webp
│   └── 1704123456_red-lentil-curry_recipe_hero.webp
├── millets/
│   └── [same structure for millets content]
└── general/
    └── [same structure for general images]
```

### Image Upload Interface

#### Drag & Drop Upload
```
┌─────────────────────────────────────────────────────────┐
│  [📁] Drag & drop an image here, or click to select     │
│                                                         │
│  Supports JPEG, PNG, WebP, GIF • Max 10MB             │
│                                                         │
│  Alt Text: [_________________________________]          │
│  Category: [Lentils ▼] [Millets] [General]            │
│                                                         │
│                      [Upload Image]                     │
└─────────────────────────────────────────────────────────┘
```

#### Real-time Progress Tracking
- **Visual Progress Bar**: Shows upload percentage
- **Processing Status**: Indicates variant generation progress
- **Error Handling**: Clear error messages with solutions
- **Success Confirmation**: Preview of uploaded image with metadata

### Image Library & Management

#### Library Interface
```
┌─── Image Library ────────────────────────────────────────┐
│ Search: [🔍 Search by name or alt text...] [All ▼] [Grid ⊞] │
├─────────────────────────────────────────────────────────┤
│ [📷]     [📷]     [📷]     [📷]     [📷]             │
│ Recipe   Hero     Lentil   Millet   Product           │
│ Photo    Image    Variety  Grain    Shot              │
│ 1.2MB    850KB    2.1MB    1.5MB    900KB             │
│                                                         │
│ [📷]     [📷]     [📷]     [📷]     [📷]             │
│ Cooking  Food     Harvest  Ancient  Nutrition         │
│ Steps    Styling  Photo    Grains   Facts              │
│ 1.8MB    1.1MB    3.2MB    2.0MB    1.3MB             │
└─────────────────────────────────────────────────────────┘
```

#### Search & Filter Options
- **Text Search**: Search by filename, original name, or alt text
- **Category Filter**: Filter by lentils, millets, or general
- **View Modes**: Grid view or detailed list view
- **Sorting**: By upload date, file size, or name

#### Image Management Actions
- **Preview**: Full-size image preview with metadata
- **Copy URL**: Direct link to optimized variants
- **Edit Details**: Update alt text and category
- **Delete**: Remove image and all variants
- **Select**: Choose for content assignment

### Integration with Content Creation

#### Article & Recipe Forms
When creating articles or recipes, the hero image section provides:

```
┌─── Hero Image Selection ─────────────────────────────────┐
│                                                         │
│ [📷 Current Image Preview]  [Change] [Remove]          │
│ red-lentil-curry.jpg                                   │
│ 1200×675 • 850KB                                       │
│ Alt: Delicious red lentil curry in a pot               │
│                                                         │
│                  - OR -                                 │
│                                                         │
│ [📁] No hero image selected                            │
│                [Select Image]                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Image Manager Modal
Clicking "Select Image" opens a comprehensive modal with:

- **Upload Tab**: Direct upload with immediate processing
- **Library Tab**: Browse existing images with search/filter
- **Category Awareness**: Automatically filters relevant images
- **Instant Preview**: See how image will look in context

### Performance & Optimization

#### Automatic Optimizations Applied
- **Size Reduction**: 40-60% smaller files through compression
- **Format Optimization**: WebP for modern browsers, JPEG fallback
- **Progressive Loading**: JPEG images load progressively
- **Blur Placeholders**: Tiny preview images for instant loading
- **CDN Caching**: 1-year cache headers for optimal performance

#### Browser Compatibility
```html
<!-- Example of automatic format selection -->
<picture>
  <source srcset="image_hero_large.webp" type="image/webp">
  <img src="image_hero_large.jpg" alt="Alt text" loading="lazy">
</picture>
```

### Image Sourcing Best Practices

#### Recommended Sources
1. **Unsplash** (unsplash.com) - Free, high-quality food photography
2. **Pexels** (pexels.com) - Free stock photos with good selection
3. **Your Photography** - Phone cameras work great for food photography
4. **Stock Services** - Shutterstock, Getty Images for premium content

#### Composition Guidelines
- **Center Important Elements**: Keep subjects away from edges
- **Use Good Lighting**: Natural light works best for food photography
- **High Resolution**: Always upload the highest quality available
- **Landscape Orientation**: Works best for most card layouts
- **Clean Backgrounds**: Simple backgrounds highlight the food

#### Quality Standards
- **Minimum Resolution**: 1200px on the longest side
- **Good Contrast**: Ensure text will be readable when overlaid
- **Color Accuracy**: True-to-life colors for food items
- **Sharp Focus**: Crisp, clear images without blur
- **Proper Exposure**: Not too dark or overexposed

### Technical Implementation

#### Database Schema
```sql
cms_images table:
- id (Primary Key)
- filename (Generated unique name)
- original_name (User's original filename)  
- file_size (Bytes)
- mime_type (image/jpeg, image/png, etc.)
- width, height (Original dimensions)
- r2_key (Cloudflare R2 object key)
- public_url (CDN URL for original)
- variants (JSONB with all variant URLs and metadata)
- alt_text (Accessibility description)
- category (lentils/millets/general)
- created_at, updated_at (Timestamps)

Foreign Key Relationships:
- cms_articles.hero_image_id → cms_images.id
- cms_recipes.hero_image_id → cms_images.id
```

#### API Endpoints
```
GET  /api/cms/images              - List all images with pagination
GET  /api/cms/images?category=lentils  - Filter by category  
GET  /api/cms/images?search=curry      - Search images
GET  /api/cms/images/[id]         - Get specific image
POST /api/cms/upload              - Upload new image
DELETE /api/cms/images/[id]       - Delete image and variants
```

---

## Card Position Rules

### Content Type Restrictions

| Card Positions | Allowed Content | Category | Special Rules |
|---|---|---|---|
| **H0-H3** | Articles OR Recipes | Any | Hero showcase |
| **H4-H6** | Articles ONLY | Lentils | Factoid display |
| **H7-H9** | Articles OR Recipes | Lentils | Collection/varieties |
| **H10-H11** | Recipes ONLY | Lentils | Featured only (max 2) |
| **H12-H14** | Articles ONLY | Millets | Factoid display |
| **H15-H17** | Articles OR Recipes | Millets | Collection/varieties |
| **H18-H19** | Recipes ONLY | Millets | Featured only (max 2) |
| **L1-L3** | Articles ONLY | Lentils | Factoid display |
| **L4-L6** | Articles OR Recipes | Lentils | Collection/varieties |
| **L7-L8** | Recipes ONLY | Lentils | Featured recipes |
| **M1-M3** | Articles ONLY | Millets | Factoid display |
| **M4-M6** | Articles OR Recipes | Millets | Collection/varieties |
| **M7-M8** | Recipes ONLY | Millets | Featured recipes |

### Featured Content Limits
- **Lentils Featured Recipes**: Maximum 2 per page (H10-H11, L7-L8)
- **Millets Featured Recipes**: Maximum 2 per page (H18-H19, M7-M8)
- System prevents exceeding these limits with validation

---

## Article Management

### Creating a New Article

#### 1. Basic Information
```
Title: "The Complete Guide to Red Lentils"
Slug: "complete-guide-red-lentils" (auto-generated)
Category: [Dropdown] Lentils | Millets
Author: "Dr. Sarah Johnson"
Status: [Dropdown] Draft | Published | Archived
```

#### 2. Content Creation
```
Excerpt: Brief summary for previews and SEO
Content: [Rich Text Editor]
- Support for headings, bold, italic, lists
- Nutritional data tables
```

#### 3. Hero Image Selection
The hero image system provides professional image management:

```
Hero Image: [Image Management Interface]

Option 1: Image Selected
┌─── Current Selection ─────────────────────────────────┐
│ [📷 Preview]  red-lentil-nutrition.jpg               │
│ 🟤 lentils   1200×675 • 850KB                       │  
│ Alt: Complete nutrition facts for red lentils        │
│              [Change Image] [Remove Image]           │
└─────────────────────────────────────────────────────┘

Option 2: No Image Selected  
┌─── Hero Image Selection ──────────────────────────────┐
│ [📁] No hero image selected                          │
│                                                      │
│              [Select Image]                          │
│   Opens Image Manager with upload/library options    │
└─────────────────────────────────────────────────────┘
```

**Image Manager Features**:
- **Upload Tab**: Drag-and-drop new images with instant processing
- **Library Tab**: Browse existing images with search and category filters  
- **Automatic Optimization**: 6 variants generated automatically
- **Smart Suggestions**: Category-filtered suggestions (lentils/millets)

#### 4. Factoid Card Display (Optional)
*For articles assigned to factoid positions (H4-H6, H12-H14, L1-L3, M1-M3)*

```
☑ Display as Factoid Card

Factoid Title: "Red Lentils: Quick-Cooking Protein Powerhouse"
(Override default article title for card display)

Primary Statistic:
  Value: "25g"
  Label: "Protein per 100g"

Secondary Statistic:
  Value: "15min" 
  Label: "Cook Time"

Icon Type: [Dropdown]
  • Protein (chart icon)
  • Health (heart icon)
  • Nutrition (leaf icon)
  • Sustainability (earth icon)

Highlights (3 bullet points):
  • "Complete amino acid profile"
  • "High in folate & iron"
  • "Naturally gluten-free"
```

#### 5. Card Assignment & Display
```
Card Position: [Smart Dropdown - filtered by category]
  For Lentils Articles: H0-H11, L1-L8 available
  For Millets Articles: H0-H3, H12-H19, M1-M8 available

Display Pages: [Checkboxes]
  ☑ Home Page
  ☑ Lentils Page  
  ☑ Millets Page
  
(Same article can appear on multiple pages)
```

#### 6. SEO & Metadata
```
Meta Title: "Red Lentils: Complete Nutrition & Cooking Guide"
Meta Description: 160-character description for search results
Tags: ["red lentils", "protein", "nutrition", "cooking guide"]
```

### Factoid vs Full Article Display

**Factoid Card Display**: Shows condensed info with stats and highlights
- Used in: Nutritional Facts sections
- Click action: Opens full article

**Full Article Display**: Complete content with rich text
- Used when: User clicks on factoid card or direct article link
- Includes: Full content, author info, related articles

---

## Recipe Management

### Creating a New Recipe

#### 1. Basic Recipe Information
```
Title: "Spiced Red Lentil Curry"
Slug: "spiced-red-lentil-curry" (auto-generated)
Description: Brief overview of the recipe
Category: [Dropdown] Lentils | Millets
Status: [Dropdown] Draft | Published | Archived
```

#### 2. Recipe Timing & Difficulty
```
Prep Time: 10 (minutes)
Cook Time: 25 (minutes)
Total Time: 35 (auto-calculated)
Servings: 4
Difficulty: [Dropdown] Easy | Medium | Hard
```

#### 3. Ingredients Builder
```
[Add Ingredient Button]

Ingredient 1:
  Item: "Red lentils"
  Amount: "1 cup"
  Notes: "rinsed and drained"

Ingredient 2:
  Item: "Coconut oil"
  Amount: "2 tbsp"
  Notes: ""

[+ Add Another Ingredient]
```

#### 4. Instructions Builder
```
[Add Step Button]

Step 1:
  Instruction: "Heat coconut oil in a large pot over medium heat"
  Time: 2 (minutes - optional)

Step 2:
  Instruction: "Add onions and cook until translucent"  
  Time: 5 (minutes - optional)

[+ Add Another Step]
```

#### 5. Nutritional Information
```
Calories per Serving: 245
Protein (grams): 12.5
Fiber (grams): 8.2

Nutritional Highlights: [Add bullet points]
  • "High in plant-based protein"
  • "Rich in dietary fiber"
  • "Good source of folate"

Health Benefits: [Add bullet points]
  • "Supports heart health"
  • "Aids in digestion"
  • "Helps stabilize blood sugar"
```

#### 6. Categorization & Tags
```
Meal Type: [Dropdown] Breakfast | Lunch | Dinner | Snack
Dietary Tags: [Multi-select checkboxes]
  ☑ Vegan
  ☑ Gluten-Free
  ☑ High-Protein
  ☐ Low-Carb
  ☐ Keto-Friendly
```

#### 7. Card Assignment & Featured Status
```
Card Position: [Smart Dropdown - filtered by category]
  For Lentils Recipes: H0-H3, H7-H11, L4-L8 available
  For Millets Recipes: H0-H3, H15-H19, M4-M8 available

☑ Mark as Featured Recipe
(Only available if featured slots not full)

Display Pages: [Checkboxes]
  ☑ Home Page
  ☑ Lentils Page
  ☐ Millets Page
```

#### 8. Hero Image & SEO
```
Hero Image: [Image Management Interface]
- Same professional image selection as articles
- Recipe-optimized variants (including 4:5 aspect ratio)
- Category-aware suggestions for relevant images
- Automatic generation of social sharing variants

Meta Title: "Easy Spiced Red Lentil Curry Recipe"
Meta Description: Recipe summary for search results
```

---

## Admin Interface Guide

### Content Management Dashboard

#### Grid View Layout
The admin interface displays all 36 card positions in a visual grid matching the website layout:

```
🏠 HOME PAGE CONTENT MANAGER
┌─── Hero Section ─────────────────────────────────────────────┐
│ H0: [Dropdown ▼]    H1: [Dropdown ▼]    H2: [Dropdown ▼]    H3: [Dropdown ▼] │
│     Any Content         Any Content         Any Content         Any Content    │
└─────────────────────────────────────────────────────────────────┘

┌─── Lentils Section ──────────────────────────────────────────────┐
│ H4: [Dropdown ▼]    H5: [Dropdown ▼]    H6: [Dropdown ▼]        │
│     Lentils Articles     Lentils Articles     Lentils Articles        │
│                                                                  │
│ H7: [Dropdown ▼]    H8: [Dropdown ▼]    H9: [Dropdown ▼]        │
│     Lentils Art/Recipe   Lentils Art/Recipe   Lentils Art/Recipe    │
│                                                                  │
│ H10: [Dropdown ▼]   H11: [Dropdown ▼]   (2/2 Featured Slots)    │
│      Lentils Recipes     Lentils Recipes                            │
└─────────────────────────────────────────────────────────────────┘

┌─── Millets Section ──────────────────────────────────────────────┐
│ H12: [Dropdown ▼]   H13: [Dropdown ▼]   H14: [Dropdown ▼]       │
│      Millets Articles    Millets Articles    Millets Articles        │
│                                                                  │
│ H15: [Dropdown ▼]   H16: [Dropdown ▼]   H17: [Dropdown ▼]       │
│      Millets Art/Recipe  Millets Art/Recipe  Millets Art/Recipe     │
│                                                                  │
│ H18: [Dropdown ▼]   H19: [Dropdown ▼]   (1/2 Featured Slots)    │
│      Millets Recipes     [Empty Slot]                               │
└─────────────────────────────────────────────────────────────────┘
```

#### Smart Dropdown Behavior
- **Content Type Filtering**: Dropdowns only show valid content types for each position
- **Category Filtering**: Only shows content matching required category (Lentils/Millets)
- **Availability Status**: Shows if featured slots are full or available
- **Empty State**: "[Empty Slot]" indicates unassigned positions

#### Real-time Feedback
- **Slot Counters**: "2/2 Featured Slots" shows availability status
- **Validation Messages**: Immediate feedback when attempting invalid assignments
- **Auto-save**: Changes save automatically when dropdown selection changes

### Content Creation Flow

#### 1. Choose Content Type
```
[+ Create New Content]
  • Create Article
  • Create Recipe
```

#### 2. Content Form
Based on content type, appropriate form loads with relevant fields

#### 3. Card Assignment
During creation or editing:
- Select card position from filtered dropdown
- Choose display pages  
- System validates assignment rules

#### 4. Preview & Publish
- Preview content in card format
- Review placement on target pages
- Publish when ready

---

## Content Publishing Workflow

### Draft → Review → Publish

#### 1. Draft Stage
- Content creators work on articles/recipes
- Not visible on website
- Can be saved and edited multiple times
- No card position assignment required

#### 2. Review Stage
- Content ready for publication
- Card position assigned
- Display pages selected
- Preview functionality available

#### 3. Published Stage
- Content live on website
- Appears in assigned card positions
- Indexed by search engines
- Can still be edited (creates new version)

### Publishing Controls

```
Status: [Dropdown]
  • Draft - Not visible, work in progress
  • Published - Live on website  
  • Archived - Removed from website, kept in system

Published Date: [Date Picker]
  • Schedule future publication
  • Track publication history

Author: [Dropdown] Content team members
```

---

## Best Practices

### Content Strategy

#### Article Guidelines
- **Factoid Articles**: Focus on scientific data, nutrition facts, health benefits
- **Variety Articles**: Highlight unique characteristics, culinary uses, cooking tips
- **Educational Content**: Include credible sources, nutritional data, health benefits

#### Recipe Guidelines
- **Clear Instructions**: Step-by-step with timing where helpful
- **Accurate Nutrition**: Calculate nutritional values accurately
- **Dietary Information**: Tag dietary restrictions clearly
- **Quality Images**: Use the integrated image management system for optimization

### Card Assignment Strategy

#### Home Page Planning
- **Hero Section (H0-H3)**: Showcase bestsellers, seasonal content, new additions
- **Facts Sections**: Educational content that builds trust and authority
- **Collection Sections**: Product varieties with cooking suggestions
- **Featured Recipes**: High-performing, popular recipes

#### Page-Specific Content
- **Lentils Page**: Deep-dive lentil varieties, advanced cooking techniques
- **Millets Page**: Ancient grain education, sustainability messaging
- **Cross-page Strategy**: Same content can appear on multiple pages

### Content Maintenance

#### Regular Reviews
- **Monthly**: Review featured content performance
- **Quarterly**: Update nutritional data, refresh images
- **Seasonally**: Rotate featured recipes, add seasonal content

#### Performance Tracking
- Monitor which card positions get most engagement
- A/B test different content in same positions
- Track conversion from factoid cards to full articles

### Image Management Best Practices

#### Image Selection Strategy
- **Hero Images**: Choose high-impact, appetizing food photography
- **Consistency**: Maintain similar lighting and style across content
- **Accessibility**: Always include descriptive alt text for screen readers
- **Performance**: Let the system handle optimization - upload highest quality available

#### Content-Image Pairing
- **Articles**: Use educational/informational images that support the content
- **Recipes**: Use finished dish photos that show the expected result
- **Factoid Cards**: Choose images that highlight the key nutritional benefit
- **Cross-reference**: Same image can be used across multiple related articles

#### Library Organization
- **Consistent Naming**: Use descriptive filenames before upload
- **Category Accuracy**: Assign correct categories for easy filtering
- **Regular Cleanup**: Remove unused images to maintain organization
- **Quality Control**: Replace low-quality images with better alternatives

### SEO Optimization

#### Article SEO
- Target specific keywords: "red lentil nutrition", "how to cook millets"
- Use descriptive, benefit-focused titles
- Include nutritional data in structured format
- Link between related articles
- **Image SEO**: Use descriptive alt text that includes relevant keywords

#### Recipe SEO  
- Include cooking time, difficulty, servings in metadata
- Use schema markup for recipe structured data
- Target cooking-related keywords
- Include ingredient lists in searchable format
- **Image SEO**: Alt text should describe the finished dish appetizingly

---

## Troubleshooting

### Common Issues

#### Content Management Issues

##### "Featured slot full" Error
**Problem**: Trying to mark 3rd recipe as featured
**Solution**: Use replacement dialog to choose which existing featured recipe to replace

##### Content not appearing
**Problem**: Published content not showing on website
**Solution**: Check card position assignment and display page selection

##### Wrong content type in dropdown
**Problem**: Can't find recipe in article-only dropdown
**Solution**: Check card position rules - some positions only allow specific content types

#### Image Management Issues

##### Upload fails with "File too large" error
**Problem**: Image file exceeds 10MB limit
**Solution**: 
- Compress image before upload using online tools
- Resize image to maximum 2000x2000 pixels
- Convert to JPEG format which is more compressed

##### Upload fails with "Unsupported format" error
**Problem**: Trying to upload unsupported file type
**Solution**: 
- Convert to supported format: JPEG, PNG, WebP, or GIF
- Check file extension matches actual format
- Remove any special characters from filename

##### Images not loading on website
**Problem**: Images show broken links or don't display
**Solution**:
- Verify Cloudflare R2 bucket permissions are set to public read
- Check R2_PUBLIC_URL environment variable is correct
- Confirm R2 credentials are valid and not expired

##### Image variants not generating
**Problem**: Only original image uploads, no optimized variants
**Solution**:
- Check Sharp processing is working (see server logs)
- Verify sufficient server memory for image processing
- Ensure R2 upload permissions include write access

##### Slow image upload/processing
**Problem**: Upload takes very long or times out
**Solution**:
- Use smaller source images (under 5MB recommended)
- Check internet connection stability
- Try uploading during off-peak hours
- Compress images before upload

### Admin Interface Issues

#### Dropdown shows no options
**Problem**: No content available for selection
**Solution**: Create content of appropriate type/category first

#### Changes not saving
**Problem**: Card assignments not persisting
**Solution**: Check browser console for validation errors

#### Image Manager not opening
**Problem**: "Select Image" button doesn't respond
**Solution**:
- Check browser console for JavaScript errors
- Ensure proper network connection
- Try refreshing the page and attempting again
- Clear browser cache if problems persist

#### Image Library shows empty/loading forever
**Problem**: Library tab shows no images or loading spinner indefinitely
**Solution**:
- Verify R2 API credentials are correctly configured
- Check network connection and R2 service status
- Confirm database contains image records
- Check browser developer tools for API errors

---

## Technical Notes

### Database Structure
- **cms_articles** table: Standard article fields + factoid display data + hero_image_id FK
- **cms_recipes** table: Recipe-specific fields with ingredients/instructions as JSON + hero_image_id FK
- **cms_images** table: Complete image management with variants, metadata, and R2 integration
- **Card positions**: Stored as strings (H0-H19, L1-L8, M1-M8)
- **Display pages**: Array field allowing multi-page display
- **Foreign Keys**: Articles and recipes link to images via hero_image_id

### API Endpoints

#### Content Management
- `GET /api/content/cards?page=home` - Fetch all home page card content
- `GET /api/content/cards/{position}` - Fetch specific card content
- `POST /api/cms/articles` - Create new article
- `POST /api/cms/recipes` - Create new recipe
- `PUT /api/content/assign` - Assign content to card position

#### Image Management
- `GET /api/cms/images` - List all images with pagination and filtering
- `GET /api/cms/images?category=lentils` - Filter images by category
- `GET /api/cms/images?search=curry` - Search images by name/alt text
- `GET /api/cms/images/[id]` - Get specific image with all variants
- `POST /api/cms/upload` - Upload new image with automatic processing
- `DELETE /api/cms/images/[id]` - Delete image and all variants from R2 and database

### Performance Considerations
- Card content cached for fast page loads
- **Images optimized automatically**: 40-60% size reduction through compression
- **CDN delivery via Cloudflare R2**: Global edge caching for fast image loading
- **Responsive image delivery**: Appropriate variant served based on device/context
- **Modern format support**: WebP for compatible browsers, JPEG fallback
- **Progressive loading**: JPEG images with blur placeholders for perceived performance
- Search indexing for recipe ingredients and article content

### Environment Configuration

#### Required Environment Variables
```bash
# Cloudflare R2 Configuration
R2_ACCESS_KEY_ID=your_r2_access_key_here
R2_SECRET_ACCESS_KEY=your_r2_secret_key_here  
R2_BUCKET_NAME=lentils-millets-images
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_PUBLIC_URL=https://your-bucket.your-account.r2.dev

# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database
```

#### Image Processing Requirements
- **Sharp library**: Installed for server-side image processing
- **Memory requirements**: Minimum 512MB available for large image processing
- **Storage permissions**: R2 bucket configured for public read, API write access

---

*This guide covers the complete content management system for the Lentils & Millets platform. For technical implementation details, refer to the development documentation.*