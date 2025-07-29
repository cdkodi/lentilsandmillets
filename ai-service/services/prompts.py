"""
Prompt Templates for AI Article Generation
Optimized prompts for nutrition and food content
"""

from typing import Dict, Any
from models import GenerationOptions, ArticleCategory

class PromptTemplates:
    
    def get_content_generation_prompt(self, topic: str, options: GenerationOptions = None) -> str:
        """Generate optimized prompt for content creation"""
        
        if not options:
            options = GenerationOptions()
        
        category_context = self._get_category_context(options.category)
        length_guidance = self._get_length_guidance(options.target_length)
        
        prompt = f"""You are a nutrition expert writing for health-conscious consumers interested in plant-based proteins and ancient grains.

Topic: {topic}
Target Length: {length_guidance}
Category: {options.category.value}
Brand Voice: Authoritative yet approachable, science-backed but accessible

{category_context}

Create a comprehensive article about "{topic}" that includes:

1. **Nutritional Breakdown**: Specific metrics, vitamins, minerals, macronutrients with accurate data
2. **Health Benefits**: Research-backed benefits with scientific context and studies
3. **Practical Applications**: Cooking tips, preparation methods, storage advice, meal ideas
4. **Comparison Analysis**: How it compares to other similar foods nutritionally
5. **Selection & Storage**: Buying guides, freshness indicators, storage best practices
6. **Environmental Impact**: Sustainability aspects, farming practices, environmental benefits

Writing Guidelines:
- Use active voice and create engaging, scannable subheadings
- Include specific statistics and studies when possible (cite with [Study: Source])
- Write at 8th-grade reading level for broad accessibility
- Maintain an encouraging, positive tone throughout
- Structure with clear H2 (##) and H3 (###) headings for web readability
- Integrate relevant keywords naturally for SEO optimization
- Include practical tips readers can immediately implement
- Use bullet points and numbered lists for easy scanning

Content Structure:
- Start with an engaging introduction that hooks the reader
- Use descriptive subheadings that preview the content
- Include actionable takeaways in each section
- End with a compelling conclusion that motivates action

Focus on providing accurate nutritional information, practical cooking guidance, and inspiring readers to incorporate this food into their healthy lifestyle. Make the content both educational and immediately useful."""

        return prompt
    
    def get_recipe_generation_prompt(self, topic: str, options: GenerationOptions = None) -> str:
        """Generate optimized prompt for recipe creation"""
        
        if not options:
            options = GenerationOptions()
        
        category_context = self._get_category_context(options.category)
        
        prompt = f"""You are a professional chef and nutrition expert specializing in plant-based cooking with lentils and millets.

Recipe Topic: {topic}
Category: {options.category.value}
Brand Voice: Approachable, family-friendly, nutrition-conscious

{category_context}

Create a comprehensive recipe for "{topic}" that includes:

**RECIPE STRUCTURE:**
1. **Recipe Overview**:
   - Engaging description (2-3 sentences)
   - Prep time, cook time, total time
   - Number of servings
   - Difficulty level (easy/medium/hard)

2. **Nutritional Highlights**:
   - Key nutritional benefits per serving
   - Protein, fiber, and calorie estimates
   - Health benefits specific to the main ingredient

3. **Ingredients List**:
   - Precise measurements and amounts
   - Include notes for substitutions where helpful
   - Organize by cooking order when relevant

4. **Detailed Instructions**:
   - Step-by-step cooking directions
   - Include timing for each major step
   - Add helpful cooking tips and techniques
   - Mention visual cues for doneness

5. **Serving & Storage**:
   - Serving suggestions and pairings
   - Storage instructions and shelf life
   - Reheating instructions if applicable

6. **Recipe Variations** (if applicable):
   - Simple modifications for different dietary needs
   - Seasonal ingredient swaps
   - Spice level adjustments

**DIETARY CONSIDERATIONS:**
- Highlight if recipe is vegan, gluten-free, high-protein, etc.
- Include meal type (breakfast, lunch, dinner, snack)
- Mention if suitable for meal prep

**WRITING GUIDELINES:**
- Use clear, actionable language in instructions
- Include specific measurements and cooking times
- Add practical tips that ensure success
- Make ingredients easy to find in regular grocery stores
- Write for home cooks with basic kitchen skills
- Include brief explanations for any specialized techniques

**NUTRITIONAL FOCUS:**
- Emphasize the nutritional benefits of the main ingredient
- Include realistic nutritional estimates per serving
- Mention how this recipe fits into a healthy diet

Format the response as a complete recipe ready for publication on a food website."""

        return prompt
    
    def get_fact_checking_prompt(self, content: str, topic: str) -> str:
        """Generate prompt for fact-checking and citation"""
        
        prompt = f"""You are a fact-checking expert specializing in nutrition and food science. Review the following article about "{topic}" for accuracy and enhance it with credible citations.

Article Content:
{content}

Tasks:
1. **Verify Health Claims**: Check all nutritional values, health benefits, and scientific statements
2. **Add Citations**: Include credible sources for key claims using [Source: Publication/Study Name, Year] format
3. **Flag Uncertainties**: Mark any claims that need editorial review with [FACT-CHECK: Claim needs verification]
4. **Enhance Credibility**: Add specific study references where they strengthen claims
5. **Update Statistics**: Ensure all numbers, percentages, and data points are current and accurate

Citation Priorities:
- Peer-reviewed studies from PubMed/medical journals
- USDA nutrition databases and official nutrition data
- WHO, FDA, and other authoritative health organizations
- Recent studies (prefer last 5 years) over older research
- Meta-analyses and systematic reviews when available

Guidelines:
- Only add citations for significant claims, not basic facts
- Use the format: [Source: Study/Database Name, Year]
- If a claim cannot be verified, add: [FACT-CHECK: Requires verification]
- Maintain the original tone and structure of the article
- Focus on nutritional claims, health benefits, and statistical data

Return the enhanced article with citations integrated naturally into the text, followed by a fact-check summary noting:
- Number of claims verified
- Number of citations added  
- Any flags requiring editorial review
- Overall confidence score (0-100)"""

        return prompt
    
    def get_summarization_prompt(self, content: str, topic: str) -> str:
        """Generate prompt for creating summaries and meta content"""
        
        prompt = f"""Create a comprehensive summary package for this article about "{topic}":

Article Content:
{content}

Generate the following in this exact format:

TITLE: [Create an engaging, SEO-friendly title that accurately represents the content]

SUMMARY: [Write a 150-200 word executive summary covering the main topic, key benefits, and primary takeaways for readers]

KEY POINTS:
- [Most important nutritional fact or benefit]
- [Key practical application or cooking tip]
- [Significant health benefit or scientific finding]
- [Important storage or selection advice]
- [Notable comparison or unique characteristic]
- [Actionable takeaway for readers]
- [Environmental or sustainability benefit]

QUICK TIPS:
- [Immediate action readers can take]
- [Simple preparation or cooking tip]
- [Easy way to incorporate into diet]
- [Storage or selection advice]

META DESCRIPTION: [Write a compelling 150-160 character meta description for search results, including the main keyword and benefit]

Guidelines:
- Focus on the most valuable and actionable information
- Use engaging language that motivates readers
- Include specific benefits and practical applications
- Make key points scannable and memorable
- Ensure the meta description is compelling for search results
- Keep the summary informative but concise
- Highlight what makes this food unique or beneficial"""

        return prompt
    
    def _get_category_context(self, category: ArticleCategory) -> str:
        """Get category-specific writing context"""
        
        contexts = {
            ArticleCategory.LENTILS: """
Lentils Context:
- Emphasize protein content, complete amino acid profiles, and plant-based nutrition
- Highlight cooking versatility, quick preparation, and meal prep applications  
- Focus on digestive benefits, heart health, and blood sugar management
- Include cooking tips for different varieties (red, green, black, brown)
- Mention affordability and accessibility as healthy protein sources""",

            ArticleCategory.MILLETS: """
Millets Context:
- Emphasize gluten-free benefits and ancient grain heritage
- Highlight climate resilience, sustainability, and environmental benefits
- Focus on diabetes-friendly properties and low glycemic index
- Include modern applications and cooking methods for ancient grains
- Mention mineral density, particularly calcium and iron content""",

            ArticleCategory.GENERAL: """
General Context:
- Balance information for both lentils and millets when relevant
- Focus on plant-based nutrition and sustainable eating
- Emphasize health benefits and practical applications
- Include environmental and sustainability angles
- Target health-conscious, environmentally aware consumers"""
        }
        
        return contexts.get(category, contexts[ArticleCategory.GENERAL])
    
    def _get_length_guidance(self, target_length: int) -> str:
        """Get length-specific guidance"""
        
        if target_length <= 1000:
            return f"{target_length} words (concise and focused)"
        elif target_length <= 1500:
            return f"{target_length} words (comprehensive coverage)"
        else:
            return f"{target_length} words (detailed and thorough)"
    
    def get_quality_assessment_prompt(self, article: Dict[str, Any]) -> str:
        """Generate prompt for quality assessment"""
        
        prompt = f"""Assess the quality of this article across multiple dimensions:

Title: {article.get('title', 'N/A')}
Content Length: {len(article.get('content', '').split())} words

Content:
{article.get('content', '')[:2000]}...

Rate each aspect from 0-100:

1. **Content Completeness**: Does it cover the topic thoroughly?
2. **Accuracy**: Are the facts and nutritional information accurate?
3. **Readability**: Is it easy to read and well-structured?
4. **Practical Value**: Does it provide actionable information?
5. **SEO Optimization**: Are keywords naturally integrated?
6. **Brand Voice**: Does it match authoritative yet approachable tone?

Return scores in this format:
COMPLETENESS: [score]
ACCURACY: [score]  
READABILITY: [score]
PRACTICAL_VALUE: [score]
SEO_OPTIMIZATION: [score]
BRAND_VOICE: [score]
OVERALL: [calculated average]

Include brief justification for each score."""

        return prompt