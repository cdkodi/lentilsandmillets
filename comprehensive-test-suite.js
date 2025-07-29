const { chromium } = require('playwright');

// Test data for articles and recipes
const testArticles = {
  // Lentils Articles (L1-L6)
  L1: {
    title: "Red Lentils: Complete Nutritional Guide",
    excerpt: "Discover the protein-packed powerhouse of red lentils with 25g protein per 100g and quick 15-minute cooking time.",
    content: "Red lentils are one of the most versatile and nutritious legumes available. With their vibrant orange-red color and quick cooking time, they're perfect for busy weeknights and nutritious meals. Rich in plant protein, fiber, and essential minerals, red lentils support heart health and provide sustained energy.",
    author: "Dr. Sarah Nutrition",
    category: "lentils",
    card_position: "L1",
    factoid_data: {
      icon: "protein",
      primary_stat: { value: "25g", label: "Protein per 100g" },
      secondary_stat: { value: "15min", label: "Cook Time" },
      highlights: ["Complete amino acids", "High in folate", "Heart healthy"]
    }
  },
  L2: {
    title: "Green Lentils: The Fiber Champion",
    excerpt: "Explore green lentils with exceptional fiber content and hearty texture perfect for salads and stews.",
    content: "Green lentils, also known as French lentils, maintain their shape beautifully when cooked. They're packed with dietary fiber, supporting digestive health and providing lasting satiety. Their earthy, nutty flavor makes them ideal for salads, soups, and side dishes.",
    author: "Chef Maria Healthy",
    category: "lentils", 
    card_position: "L2"
  },
  L3: {
    title: "Black Beluga Lentils: Gourmet Nutrition",
    excerpt: "Premium black beluga lentils with caviar-like appearance and rich mineral content for sophisticated dishes.",
    content: "Black beluga lentils are the caviar of the legume world. These small, glossy black lentils hold their shape perfectly and have a rich, earthy flavor. They're particularly high in anthocyanins, powerful antioxidants that give them their dark color.",
    author: "Chef Antoine Gourmet",
    category: "lentils",
    card_position: "L3"
  },
  L4: {
    title: "Brown Lentils: Kitchen Staple Guide",
    excerpt: "Master the versatile brown lentil - perfect for beginners with mild flavor and reliable cooking results.",
    content: "Brown lentils are the most common variety and perfect for those new to lentil cooking. They have a mild, earthy flavor and hold their shape well in most dishes. Excellent source of protein and fiber.",
    author: "Home Cook Helper",
    category: "lentils",
    card_position: "L4"
  },
  L5: {
    title: "Yellow Split Lentils: Dal Excellence",
    excerpt: "Traditional yellow lentils perfect for authentic Indian dal with quick cooking and creamy texture.",
    content: "Yellow split lentils are essential for traditional Indian cuisine. They cook quickly into a creamy, smooth texture perfect for dal. High in protein and easy to digest.",
    author: "Indian Cuisine Expert",
    category: "lentils",
    card_position: "L5"
  },
  L6: {
    title: "French Green Lentils: Le Puy Premium",
    excerpt: "Discover the premium French green lentils from Le Puy with unique peppery flavor and firm texture.",
    content: "French green lentils from Le Puy are considered the finest lentils in the world. They have a unique peppery flavor and maintain their shape beautifully, making them perfect for salads and sophisticated dishes.",
    author: "French Culinary Institute",
    category: "lentils",
    card_position: "L6"
  },
  
  // Millets Articles (M1-M6)
  M1: {
    title: "Pearl Millet: Climate-Resilient Superfood",
    excerpt: "Discover pearl millet's drought-resistant properties and exceptional nutritional profile for sustainable farming.",
    content: "Pearl millet is nature's answer to climate change. This ancient grain thrives in arid conditions with minimal water, making it crucial for food security. Rich in protein, iron, and zinc.",
    author: "Sustainability Expert",
    category: "millets",
    card_position: "M1",
    factoid_data: {
      icon: "climate",
      primary_stat: { value: "200mm", label: "Min Rainfall" },
      secondary_stat: { value: "46°C", label: "Heat Tolerance" },
      highlights: ["Drought-resistant", "Carbon-negative farming", "High protein"]
    }
  },
  M2: {
    title: "Finger Millet: Calcium Powerhouse",
    excerpt: "Explore finger millet's superior calcium content - higher than dairy products for strong bones and teeth.",
    content: "Finger millet contains more calcium than most dairy products, making it essential for bone health. This ancient grain is also rich in amino acids and has a low glycemic index.",
    author: "Nutrition Research Team",
    category: "millets",
    card_position: "M2"
  },
  M3: {
    title: "Foxtail Millet: Diabetes-Friendly Grain",
    excerpt: "Learn how foxtail millet's low glycemic index helps manage blood sugar levels naturally.",
    content: "Foxtail millet is perfect for managing diabetes with its low glycemic index. Rich in protein and fiber, it provides sustained energy without blood sugar spikes.",
    author: "Diabetes Nutrition Specialist",
    category: "millets",
    card_position: "M3"
  },
  M4: {
    title: "Little Millet: Big Nutrition in Small Grains",
    excerpt: "Discover the concentrated nutrition of little millet with high fiber and antioxidant content.",
    content: "Don't let the name fool you - little millet packs big nutrition. These tiny grains are loaded with fiber, antioxidants, and essential minerals.",
    author: "Ancient Grains Expert",
    category: "millets",
    card_position: "M4"
  },
  M5: {
    title: "Proso Millet: Complete Protein Source",
    excerpt: "Explore proso millet's complete amino acid profile and excellent digestibility for optimal nutrition.",
    content: "Proso millet offers a complete amino acid profile, making it an excellent protein source for vegetarians and vegans. It's also highly digestible and gluten-free.",
    author: "Plant Protein Researcher",
    category: "millets",
    card_position: "M5"
  },
  M6: {
    title: "Barnyard Millet: Weight Management Wonder",
    excerpt: "Learn how barnyard millet's high fiber content supports healthy weight management and metabolism.",
    content: "Barnyard millet is excellent for weight management due to its high fiber content and low calorie density. It promotes satiety and supports healthy metabolism.",
    author: "Weight Management Coach",
    category: "millets",
    card_position: "M6"
  },

  // Home Page Factoids (H4-H6, H12-H14)
  H4: {
    title: "Lentils: Protein Powerhouse Facts",
    excerpt: "Essential facts about lentils' protein content and nutritional supremacy in plant-based nutrition.",
    content: "Lentils are among the highest protein legumes, providing 25-30g protein per 100g. They're complete with essential amino acids.",
    author: "Nutrition Science Team",
    category: "lentils",
    card_position: "H4",
    factoid_data: {
      icon: "protein",
      primary_stat: { value: "25g", label: "Protein per 100g" },
      secondary_stat: { value: "18g", label: "Fiber per 100g" },
      highlights: ["Complete amino acids", "Heart healthy", "Quick cooking"]
    }
  },
  H5: {
    title: "Lentils: Fiber Champion Benefits",
    excerpt: "Discover how lentils' exceptional fiber content supports digestive health and heart wellness.",
    content: "Lentils provide exceptional dietary fiber, supporting digestive health, cholesterol management, and blood sugar control.",
    author: "Digestive Health Expert",
    category: "lentils",
    card_position: "H5",
    factoid_data: {
      icon: "fiber",
      primary_stat: { value: "18g", label: "Fiber per 100g" },
      secondary_stat: { value: "30%", label: "Daily Fiber Needs" },
      highlights: ["Supports digestion", "Lowers cholesterol", "Stabilizes blood sugar"]
    }
  },
  H6: {
    title: "Lentils: Iron and Folate Source",
    excerpt: "Learn about lentils' rich iron and folate content essential for energy and blood health.",
    content: "Lentils are excellent sources of iron and folate, crucial for preventing anemia and supporting energy production.",
    author: "Blood Health Specialist",
    category: "lentils",
    card_position: "H6",
    factoid_data: {
      icon: "iron",
      primary_stat: { value: "7.5mg", label: "Iron per 100g" },
      secondary_stat: { value: "180μg", label: "Folate per 100g" },
      highlights: ["Prevents anemia", "Boosts energy", "Supports pregnancy"]
    }
  },
  H12: {
    title: "Millets: Ancient Superfood Revival",
    excerpt: "Discover why ancient millets are making a comeback as modern superfoods for optimal health.",
    content: "Millets have been cultivated for over 10,000 years and are now recognized as superfoods for their exceptional nutrition and sustainability.",
    author: "Ancient Grains Institute",
    category: "millets",
    card_position: "H12",
    factoid_data: {
      icon: "ancient",
      primary_stat: { value: "10,000", label: "Years Cultivated" },
      secondary_stat: { value: "9", label: "Essential Amino Acids" },
      highlights: ["Gluten-free naturally", "Climate resilient", "Nutrient dense"]
    }
  },
  H13: {
    title: "Millets: Gluten-Free Grain Benefits",
    excerpt: "Explore how naturally gluten-free millets provide safe nutrition for celiac and gluten-sensitive individuals.",
    content: "All millets are naturally gluten-free, making them perfect alternatives for those with celiac disease or gluten sensitivity.",
    author: "Gluten-Free Nutrition Expert",  
    category: "millets",
    card_position: "H13",
    factoid_data: {
      icon: "gluten-free",
      primary_stat: { value: "100%", label: "Gluten-Free" },
      secondary_stat: { value: "Safe", label: "For Celiac" },
      highlights: ["Naturally gluten-free", "Safe for celiac", "No cross-contamination"]
    }
  },
  H14: {
    title: "Millets: Low Glycemic Index Grains",
    excerpt: "Learn how millets' low glycemic index makes them ideal for diabetes management and sustained energy.",
    content: "Most millets have a low glycemic index, providing sustained energy without blood sugar spikes, perfect for diabetes management.",
    author: "Diabetes Management Team",
    category: "millets", 
    card_position: "H14",
    factoid_data: {
      icon: "glucose",
      primary_stat: { value: "50-55", label: "Glycemic Index" },
      secondary_stat: { value: "4hrs", label: "Sustained Energy" },
      highlights: ["Stabilizes blood sugar", "Sustained energy", "Diabetes-friendly"]
    }
  }
};

const testRecipes = {
  // Lentils Recipes (L7-L8)
  L7: {
    title: "Mediterranean Lentil Power Salad",
    description: "Fresh herbs, feta cheese, and protein-packed lentils create the perfect Mediterranean harmony for a nutritious meal.",
    category: "lentils",
    card_position: "L7",
    prep_time: 15,
    cook_time: 25,
    servings: 6,
    difficulty: "Easy",
    meal_type: "lunch",
    is_featured: true,
    ingredients: [
      { name: "Green lentils", amount: "1.5 cups", notes: "rinsed" },
      { name: "Cherry tomatoes", amount: "2 cups", notes: "halved" },
      { name: "Cucumber", amount: "1 large", notes: "diced" },
      { name: "Red onion", amount: "1/2 cup", notes: "finely diced" },
      { name: "Feta cheese", amount: "1/2 cup", notes: "crumbled" },
      { name: "Fresh parsley", amount: "1/4 cup", notes: "chopped" },
      { name: "Olive oil", amount: "3 tbsp", notes: "extra virgin" },
      { name: "Lemon juice", amount: "2 tbsp", notes: "fresh" }
    ],
    instructions: [
      { step: 1, instruction: "Cook lentils in boiling water for 20-25 minutes until tender but firm" },
      { step: 2, instruction: "Drain and rinse lentils with cold water to cool" },
      { step: 3, instruction: "Combine lentils with tomatoes, cucumber, and red onion" },
      { step: 4, instruction: "Whisk olive oil and lemon juice for dressing" },
      { step: 5, instruction: "Toss salad with dressing, add feta and parsley" },
      { step: 6, instruction: "Season with salt and pepper, chill before serving" }
    ],
    nutritional_highlights: ["High protein", "Rich in fiber", "Heart healthy fats"],
    health_benefits: ["Supports heart health", "Provides sustained energy", "Rich in antioxidants"]
  },
  L8: {
    title: "Spiced Red Lentil Curry",
    description: "Aromatic spices with creamy coconut milk create comfort food perfection in this protein-rich curry.",
    category: "lentils", 
    card_position: "L8",
    prep_time: 10,
    cook_time: 30,
    servings: 4,
    difficulty: "Medium",
    meal_type: "dinner",
    is_featured: true,
    ingredients: [
      { name: "Red lentils", amount: "1 cup", notes: "rinsed" },
      { name: "Coconut milk", amount: "1 can", notes: "full-fat" },
      { name: "Vegetable broth", amount: "2 cups", notes: "low sodium" },
      { name: "Onion", amount: "1 medium", notes: "diced" },
      { name: "Garlic", amount: "3 cloves", notes: "minced" },
      { name: "Ginger", amount: "1 tbsp", notes: "fresh grated" },
      { name: "Curry powder", amount: "2 tsp", notes: "" },
      { name: "Turmeric", amount: "1 tsp", notes: "" }
    ],
    instructions: [
      { step: 1, instruction: "Sauté onion until golden, add garlic and ginger" },
      { step: 2, instruction: "Add spices and cook for 1 minute until fragrant" },
      { step: 3, instruction: "Add lentils, coconut milk, and broth" },
      { step: 4, instruction: "Simmer for 20-25 minutes until lentils are soft" },
      { step: 5, instruction: "Season with salt and pepper" },
      { step: 6, instruction: "Serve over rice with fresh cilantro" }
    ],
    nutritional_highlights: ["High protein", "Anti-inflammatory spices", "Healthy fats"],
    health_benefits: ["Reduces inflammation", "Supports immune system", "Provides complete nutrition"]
  },

  // Millets Recipes (M7-M8)
  M7: {
    title: "Creamy Pearl Millet Breakfast Porridge",
    description: "Nourishing breakfast bowl with seasonal fruits and nuts, providing sustained energy for your day.",
    category: "millets",
    card_position: "M7", 
    prep_time: 10,
    cook_time: 25,
    servings: 4,
    difficulty: "Easy",
    meal_type: "breakfast",
    is_featured: true,
    ingredients: [
      { name: "Pearl millet", amount: "1 cup", notes: "rinsed" },
      { name: "Almond milk", amount: "3 cups", notes: "unsweetened" },
      { name: "Banana", amount: "1 medium", notes: "mashed" },
      { name: "Honey", amount: "2 tbsp", notes: "raw" },
      { name: "Cinnamon", amount: "1 tsp", notes: "ground" },
      { name: "Vanilla extract", amount: "1 tsp", notes: "" },
      { name: "Mixed berries", amount: "1 cup", notes: "fresh" },
      { name: "Chopped almonds", amount: "1/4 cup", notes: "toasted" }
    ],
    instructions: [
      { step: 1, instruction: "Toast pearl millet in dry pan for 2-3 minutes" },
      { step: 2, instruction: "Add almond milk and bring to boil" },
      { step: 3, instruction: "Reduce heat and simmer for 20 minutes, stirring occasionally" },
      { step: 4, instruction: "Stir in mashed banana, honey, cinnamon, and vanilla" },
      { step: 5, instruction: "Cook for 5 more minutes until creamy" },
      { step: 6, instruction: "Serve topped with berries and almonds" }
    ],
    nutritional_highlights: ["Gluten-free", "High fiber", "Sustained energy"],
    health_benefits: ["Supports digestion", "Provides lasting energy", "Rich in antioxidants"]
  },
  M8: {
    title: "Gluten-Free Finger Millet Cookies", 
    description: "Wholesome treats packed with calcium and natural sweetness, perfect for guilt-free indulgence.",
    category: "millets",
    card_position: "M8",
    prep_time: 20,
    cook_time: 15,
    servings: 24,
    difficulty: "Medium",
    meal_type: "snack",
    is_featured: true,
    ingredients: [
      { name: "Finger millet flour", amount: "2 cups", notes: "sifted" },
      { name: "Almond flour", amount: "1/2 cup", notes: "" },
      { name: "Coconut oil", amount: "1/2 cup", notes: "melted" },
      { name: "Maple syrup", amount: "1/3 cup", notes: "pure" },
      { name: "Vanilla extract", amount: "1 tsp", notes: "" },
      { name: "Baking soda", amount: "1/2 tsp", notes: "" },
      { name: "Salt", amount: "1/4 tsp", notes: "sea salt" },
      { name: "Dark chocolate chips", amount: "1/2 cup", notes: "dairy-free" }
    ],
    instructions: [
      { step: 1, instruction: "Preheat oven to 350°F and line baking sheets" },
      { step: 2, instruction: "Mix dry ingredients in large bowl" },
      { step: 3, instruction: "Combine wet ingredients separately" },
      { step: 4, instruction: "Mix wet and dry ingredients until dough forms" },
      { step: 5, instruction: "Fold in chocolate chips" },
      { step: 6, instruction: "Drop spoonfuls on sheets and bake 12-15 minutes" }
    ],
    nutritional_highlights: ["Gluten-free", "High calcium", "Natural sweeteners"],
    health_benefits: ["Supports bone health", "Satisfies sweet cravings", "Provides minerals"]
  },

  // Home Page Featured Recipes (H10-H11, H18-H19)
  H10: {
    title: "Quick Red Lentil Dal",
    description: "Traditional Indian comfort food ready in 20 minutes with warming spices and creamy texture.",
    category: "lentils",
    card_position: "H10",
    prep_time: 5,
    cook_time: 20,
    servings: 4,
    difficulty: "Easy",
    meal_type: "dinner",
    is_featured: true,
    ingredients: [
      { name: "Red lentils", amount: "1 cup", notes: "rinsed" },
      { name: "Water", amount: "3 cups", notes: "" },
      { name: "Turmeric", amount: "1/2 tsp", notes: "" },
      { name: "Ginger-garlic paste", amount: "1 tbsp", notes: "" },
      { name: "Cumin seeds", amount: "1 tsp", notes: "" },
      { name: "Onion", amount: "1 small", notes: "chopped" }
    ],
    instructions: [
      { step: 1, instruction: "Boil lentils with water and turmeric for 15 minutes" },
      { step: 2, instruction: "In separate pan, heat oil and add cumin seeds" },
      { step: 3, instruction: "Add onion and ginger-garlic paste, sauté until golden" },
      { step: 4, instruction: "Add cooked lentils and simmer 5 minutes" },
      { step: 5, instruction: "Season with salt and garnish with cilantro" }
    ],
    nutritional_highlights: ["High protein", "Quick cooking", "Digestive spices"],
    health_benefits: ["Easy to digest", "Warming and comforting", "Immune boosting"]
  },
  H11: {
    title: "Hearty Lentil Soup",
    description: "Nourishing one-pot meal packed with vegetables and protein for cold weather comfort.",
    category: "lentils",
    card_position: "H11", 
    prep_time: 15,
    cook_time: 35,
    servings: 6,
    difficulty: "Easy",
    meal_type: "dinner",
    is_featured: true,
    ingredients: [
      { name: "Green lentils", amount: "1.5 cups", notes: "rinsed" },
      { name: "Vegetable broth", amount: "6 cups", notes: "low sodium" },
      { name: "Carrots", amount: "2 large", notes: "diced" },
      { name: "Celery", amount: "2 stalks", notes: "diced" },
      { name: "Spinach", amount: "2 cups", notes: "fresh" },
      { name: "Bay leaves", amount: "2", notes: "" }
    ],
    instructions: [
      { step: 1, instruction: "Sauté carrots and celery until softened" },
      { step: 2, instruction: "Add lentils, broth, and bay leaves" },
      { step: 3, instruction: "Bring to boil, then simmer 25-30 minutes" },
      { step: 4, instruction: "Stir in spinach and cook until wilted" },
      { step: 5, instruction: "Remove bay leaves and season to taste" }
    ],
    nutritional_highlights: ["High fiber", "Packed with vegetables", "Heart healthy"],
    health_benefits: ["Supports heart health", "Boosts immunity", "Provides complete nutrition"]
  },
  H18: {
    title: "Millet Buddha Bowl",
    description: "Colorful nutrient-dense bowl with ancient grains, roasted vegetables, and tahini dressing.",
    category: "millets",
    card_position: "H18",
    prep_time: 20,
    cook_time: 30,
    servings: 4,
    difficulty: "Medium",
    meal_type: "lunch",
    is_featured: true,
    ingredients: [
      { name: "Pearl millet", amount: "1 cup", notes: "cooked" },
      { name: "Sweet potato", amount: "1 large", notes: "cubed" },
      { name: "Broccoli", amount: "2 cups", notes: "florets" },
      { name: "Chickpeas", amount: "1 can", notes: "drained" },
      { name: "Avocado", amount: "1", notes: "sliced" },
      { name: "Tahini", amount: "3 tbsp", notes: "for dressing" }
    ],
    instructions: [
      { step: 1, instruction: "Roast sweet potato and broccoli at 400°F for 25 minutes" },
      { step: 2, instruction: "Cook pearl millet according to package directions" },
      { step: 3, instruction: "Roast chickpeas until crispy" },
      { step: 4, instruction: "Make tahini dressing with lemon and garlic" },
      { step: 5, instruction: "Assemble bowls with all components and drizzle dressing" }
    ],
    nutritional_highlights: ["Complete nutrition", "Gluten-free", "Antioxidant rich"],
    health_benefits: ["Supports overall health", "Provides sustained energy", "Anti-inflammatory"]
  },
  H19: {
    title: "Millet Breakfast Pancakes",
    description: "Fluffy gluten-free pancakes made with nutritious millet flour for a perfect morning start.",
    category: "millets",
    card_position: "H19",
    prep_time: 10,
    cook_time: 15,
    servings: 4,
    difficulty: "Easy", 
    meal_type: "breakfast",
    is_featured: true,
    ingredients: [
      { name: "Finger millet flour", amount: "1.5 cups", notes: "sifted" },
      { name: "Almond milk", amount: "1.5 cups", notes: "unsweetened" },
      { name: "Banana", amount: "1 large", notes: "mashed" },
      { name: "Baking powder", amount: "2 tsp", notes: "" },
      { name: "Vanilla extract", amount: "1 tsp", notes: "" },
      { name: "Coconut oil", amount: "2 tbsp", notes: "melted" }
    ],
    instructions: [
      { step: 1, instruction: "Mix dry ingredients in large bowl" },
      { step: 2, instruction: "Combine wet ingredients separately" },
      { step: 3, instruction: "Fold wet into dry ingredients until just combined" },
      { step: 4, instruction: "Heat griddle and cook pancakes 3-4 minutes per side" },
      { step: 5, instruction: "Serve with fresh fruit and maple syrup" }
    ],
    nutritional_highlights: ["Gluten-free", "High calcium", "Natural sweetness"],
    health_benefits: ["Sustained energy", "Bone health support", "Digestive friendly"]
  }
};

async function createAllTestContent() {
  console.log('🚀 CREATING COMPREHENSIVE TEST CONTENT');
  console.log('=====================================');
  
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  try {
    // Login to CMS
    console.log('🔐 Logging into CMS...');
    await page.goto('http://localhost:3000/admin-panel/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[id=\"email\"]', 'admin@lentilsandmillets.com');
    await page.fill('input[id=\"password\"]', 'LentilsMillets2024!');
    await page.click('button[type=\"submit\"]');
    await page.waitForTimeout(3000);
    console.log('✅ Logged in successfully');

    // Create Articles
    console.log('\n📰 Creating Test Articles...');
    let articleCount = 0;
    
    for (const [position, article] of Object.entries(testArticles)) {
      try {
        console.log(`📝 Creating article for position ${position}: ${article.title}`);
        
        await page.goto('http://localhost:3000/admin-panel/articles/new');
        await page.waitForTimeout(1000);
        
        // Fill in article details
        await page.fill('input[name=\"title\"]', article.title);
        await page.fill('textarea[name=\"excerpt\"]', article.excerpt);
        await page.fill('textarea[name=\"content\"]', article.content);
        await page.fill('input[name=\"author\"]', article.author);
        
        // Select category
        await page.selectOption('select[name=\"category\"]', article.category);
        
        // Select card position
        await page.selectOption('select[name=\"card_position\"]', article.card_position);
        
        // Add factoid data if present
        if (article.factoid_data) {
          await page.fill('input[name=\"factoid_icon\"]', article.factoid_data.icon);
          await page.fill('input[name=\"primary_stat_value\"]', article.factoid_data.primary_stat.value);
          await page.fill('input[name=\"primary_stat_label\"]', article.factoid_data.primary_stat.label);
          await page.fill('input[name=\"secondary_stat_value\"]', article.factoid_data.secondary_stat.value);
          await page.fill('input[name=\"secondary_stat_label\"]', article.factoid_data.secondary_stat.label);
        }
        
        // Set status to published
        await page.selectOption('select[name=\"status\"]', 'published');
        
        // Submit the form
        await page.click('button[type=\"submit\"]');
        await page.waitForTimeout(2000);
        
        articleCount++;
        console.log(`✅ Created article ${articleCount}: ${article.title}`);
        
      } catch (error) {
        console.error(`❌ Failed to create article ${position}:`, error.message);
      }
    }

    // Create Recipes
    console.log('\n🍳 Creating Test Recipes...');
    let recipeCount = 0;
    
    for (const [position, recipe] of Object.entries(testRecipes)) {
      try {
        console.log(`🥘 Creating recipe for position ${position}: ${recipe.title}`);
        
        await page.goto('http://localhost:3000/admin-panel/recipes/new');
        await page.waitForTimeout(1000);
        
        // Fill in recipe details
        await page.fill('input[name=\"title\"]', recipe.title);
        await page.fill('textarea[name=\"description\"]', recipe.description);
        
        // Select category
        await page.selectOption('select[name=\"category\"]', recipe.category);
        
        // Select card position
        await page.selectOption('select[name=\"card_position\"]', recipe.card_position);
        
        // Fill in recipe specifics
        await page.fill('input[name=\"prep_time\"]', recipe.prep_time.toString());
        await page.fill('input[name=\"cook_time\"]', recipe.cook_time.toString());
        await page.fill('input[name=\"servings\"]', recipe.servings.toString());
        await page.selectOption('select[name=\"difficulty\"]', recipe.difficulty);
        await page.selectOption('select[name=\"meal_type\"]', recipe.meal_type);
        
        // Set featured if applicable
        if (recipe.is_featured) {
          await page.check('input[name=\"is_featured\"]');
        }
        
        // Add ingredients (simplified for testing)
        const ingredientsText = recipe.ingredients.map(ing => `${ing.amount} ${ing.name} ${ing.notes || ''}`).join('\n');
        await page.fill('textarea[name=\"ingredients\"]', ingredientsText);
        
        // Add instructions (simplified for testing)
        const instructionsText = recipe.instructions.map(inst => `${inst.step}. ${inst.instruction}`).join('\n');
        await page.fill('textarea[name=\"instructions\"]', instructionsText);
        
        // Set status to published
        await page.selectOption('select[name=\"status\"]', 'published');
        
        // Submit the form
        await page.click('button[type=\"submit\"]');
        await page.waitForTimeout(2000);
        
        recipeCount++;
        console.log(`✅ Created recipe ${recipeCount}: ${recipe.title}`);
        
      } catch (error) {
        console.error(`❌ Failed to create recipe ${position}:`, error.message);
      }
    }
    
    console.log('\n🎉 TEST CONTENT CREATION COMPLETED!');
    console.log(`📊 SUMMARY: ${articleCount} articles and ${recipeCount} recipes created`);
    console.log('\n➡️  Ready for frontend testing...');
    
  } catch (error) {
    console.error('❌ Test content creation failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Export for use in other test files
module.exports = { testArticles, testRecipes, createAllTestContent };

// Run if called directly
if (require.main === module) {
  createAllTestContent().catch(console.error);
}