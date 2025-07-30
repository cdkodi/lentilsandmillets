const axios = require('axios');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const API_BASE = 'http://localhost:3000/api';

// First login to get a token
async function login() {
  try {
    const response = await axios.post(`${API_BASE}/users/login`, {
      email: 'admin@lentilsandmillets.com',
      password: 'admin123456'
    });
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    return null;
  }
}

// Create a recipe
async function createRecipe(token) {
  try {
    const response = await axios.post(`${API_BASE}/recipes`, {
      title: 'Red Lentil Curry',
      slug: 'red-lentil-curry',
      productLine: 'lentils',
      description: 'A quick and nutritious red lentil curry perfect for weeknight dinners.',
      ingredients: [
        { item: 'Red lentils', amount: '1 cup' },
        { item: 'Onion', amount: '1 medium, diced' },
        { item: 'Garlic', amount: '3 cloves, minced' },
        { item: 'Coconut milk', amount: '1 can' },
        { item: 'Curry powder', amount: '2 tsp' }
      ],
      instructions: [
        { step: 'Rinse red lentils in cold water until water runs clear.' },
        { step: 'Sauté onion and garlic until fragrant.' },
        { step: 'Add curry powder and cook for 1 minute.' },
        { step: 'Add lentils, coconut milk, and 2 cups water. Simmer 15 minutes.' },
        { step: 'Season with salt and serve over rice.' }
      ],
      cookingTime: 25,
      difficulty: 'easy',
      status: 'published'
    }, {
      headers: { Authorization: `JWT ${token}` }
    });
    
    console.log('Recipe created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create recipe:', error.response?.data || error.message);
  }
}

// Create an article
async function createArticle(token) {
  try {
    const response = await axios.post(`${API_BASE}/articles`, {
      title: 'The Nutritional Benefits of Lentils',
      slug: 'nutritional-benefits-lentils',
      productLine: 'lentils',
      excerpt: 'Discover why lentils are considered a superfood and how they can boost your health.',
      content: [
        {
          type: 'paragraph',
          children: [
            { text: 'Lentils are packed with protein, fiber, and essential nutrients that make them an excellent addition to any diet.' }
          ]
        }
      ],
      author: 'Lentils & Millets Team',
      readingTime: 5,
      status: 'published'
    }, {
      headers: { Authorization: `JWT ${token}` }
    });
    
    console.log('Article created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create article:', error.response?.data || error.message);
  }
}

// List all content
async function listContent(token) {
  try {
    const [recipes, articles] = await Promise.all([
      axios.get(`${API_BASE}/recipes`, { headers: { Authorization: `JWT ${token}` } }),
      axios.get(`${API_BASE}/articles`, { headers: { Authorization: `JWT ${token}` } })
    ]);
    
    console.log('\n=== RECIPES ===');
    recipes.data.docs.forEach(recipe => {
      console.log(`- ${recipe.title} (${recipe.productLine})`);
    });
    
    console.log('\n=== ARTICLES ===');
    articles.data.docs.forEach(article => {
      console.log(`- ${article.title} (${article.productLine})`);
    });
    
  } catch (error) {
    console.error('Failed to list content:', error.response?.data || error.message);
  }
}

// Main function
async function main() {
  console.log('Logging in...');
  const token = await login();
  
  if (!token) {
    console.log('Could not authenticate. Exiting.');
    return;
  }
  
  console.log('Creating sample content...');
  await createRecipe(token);
  await createArticle(token);
  
  console.log('\nListing all content:');
  await listContent(token);
}

if (require.main === module) {
  main();
}

module.exports = { login, createRecipe, createArticle, listContent };