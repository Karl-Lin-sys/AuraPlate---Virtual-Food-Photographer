import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to construct sensory, high-end food photography prompts
function buildFoodPrompt(dishName: string, description: string, style: string, customBrief?: string): string {
  let styleDetails = '';

  switch (style) {
    case 'rustic':
      styleDetails =
        'Moody chiaroscuro food photography, dark rustic ambiance. Background is deeply textured charcoal slate and dark reclaimed oak wood. Warm directional side-lighting casting rich dramatic shadows, golden rim light. Plated in an artisan rustic ceramic bowl or cast iron. Garnished with coarse Maldon sea salt crystals and fresh herbs. A gentle wisp of appetizing steam rising. Hasselblad 100mm f/2.8 macro lens, rich textures, deep tones, Michelin tavern editorial.';
      break;
    case 'bright':
      styleDetails =
        'Bright, airy, modern culinary photography. Clean Scandinavian bistro aesthetic with soft natural morning window daylight. Crisp off-white matte ceramic plate on a pristine light Carrara marble surface. Delicate microgreen garnishes, vibrant natural food colors, subtle soft diffused shadows. Pristine, fresh, appetizing, shot on Canon 85mm f/1.4 lens, clean high-key commercial editorial.';
      break;
    case 'social':
    default:
      styleDetails =
        "Top-down 90-degree flat-lay food photography optimized for social media and Instagram. Centered artistic plating with curated lifestyle props: washed linen napkin, brushed gold cutlery, small dipping saucer with emulsion, scattered fresh ingredients (chili flakes, lemon wedge, cracked pepper). Vivid color saturation, perfectly balanced flat diffused softbox lighting, ultra-crisp appetizing details.";
      break;
  }

  const basePrompt = `Professional high-end restaurant food photography of ${dishName}. Description: ${description || dishName}. ${styleDetails}`;
  return customBrief ? `${basePrompt} Additional styling requirements: ${customBrief}. Photorealistic, ultra-detailed food texture.` : `${basePrompt} Photorealistic, ultra-detailed food texture.`;
}

// 1. Menu Parsing API
app.post('/api/menu/parse', async (req, res) => {
  try {
    const { menuText } = req.body;
    if (!menuText || typeof menuText !== 'string') {
      return res.status(400).json({ error: 'menuText is required' });
    }

    let parsedData: any = null;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are an expert culinary director and food menu parser. Parse the following restaurant menu text into structured dishes with categories, ingredients, descriptions, pricing, and photography style recommendations.
        
Menu text to parse:
"""
${menuText.slice(0, 10000)}
"""`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              restaurantName: {
                type: Type.STRING,
                description: 'Name of the restaurant inferred or default to "Artisan Kitchen"',
              },
              cuisineType: {
                type: Type.STRING,
                description: 'Type of cuisine (e.g., Modern Italian, Japanese Izakaya, Contemporary Bistro)',
              },
              dishes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    category: {
                      type: Type.STRING,
                      description: 'E.g., Starters, Mains, Pasta, Grills, Desserts, Cocktails',
                    },
                    description: { type: Type.STRING },
                    ingredients: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    price: { type: Type.STRING },
                    suggestedStyle: {
                      type: Type.STRING,
                      description: '"rustic", "bright", or "social"',
                    },
                    photographyNotes: {
                      type: Type.STRING,
                      description: 'Creative culinary styling suggestions and props for the photo shoot',
                    },
                  },
                  required: ['name', 'category', 'description', 'price', 'suggestedStyle'],
                },
              },
            },
            required: ['restaurantName', 'cuisineType', 'dishes'],
          },
        },
      });

      parsedData = JSON.parse(response.text || '{}');
    } catch (aiErr: any) {
      console.warn('AI parser encountered error, falling back to smart regex menu parser:', aiErr.message);
      
      // Smart Heuristic Menu Parser fallback
      const lines = menuText.split('\n').map((l) => l.trim()).filter(Boolean);
      let currentCategory = 'Mains';
      let restaurantName = 'Artisan Kitchen';
      let cuisineType = 'Contemporary Cuisine';
      const extractedDishes: any[] = [];

      // Check first line for restaurant title
      if (lines.length > 0 && !lines[0].includes('$') && !lines[0].includes('-')) {
        restaurantName = lines[0].replace(/menu|menù|tasting|seasonal/gi, '').trim() || lines[0];
      }

      for (const line of lines) {
        // Category headers like "Starters:", "Mains", "Antipasti:"
        if (line.endsWith(':') && line.length < 35 && !line.includes('$')) {
          currentCategory = line.replace(':', '').trim();
          continue;
        }

        // Dish lines like "- Dish Name ($24): Description..." or "Dish Name - $24"
        const priceMatch = line.match(/\$(\d+(\.\d{2})?)/);
        if (priceMatch || line.startsWith('-') || line.startsWith('•')) {
          const cleanLine = line.replace(/^[-•*]\s*/, '');
          const parts = cleanLine.split(/[:–—]/);
          const namePart = parts[0] || '';
          const nameClean = namePart.replace(/\(\$\d+.*\)/, '').replace(/\$\d+.*/, '').trim();
          const descPart = parts.slice(1).join(':').trim();
          const price = priceMatch ? priceMatch[0] : '$22';

          if (nameClean.length > 2) {
            extractedDishes.push({
              id: `dish-${Date.now()}-${extractedDishes.length}`,
              name: nameClean,
              category: currentCategory,
              description: descPart || `Chef's special ${nameClean} prepared with artisan ingredients.`,
              ingredients: descPart ? descPart.split(',').map((s) => s.trim().replace(/\.$/, '')).slice(0, 5) : [],
              price: price,
              suggestedStyle: currentCategory.toLowerCase().includes('dessert')
                ? 'social'
                : currentCategory.toLowerCase().includes('salad') || currentCategory.toLowerCase().includes('raw')
                ? 'bright'
                : 'rustic',
              photographyNotes: `Styled on artisanal tableware with complementary garnish and focused lighting.`,
            });
          }
        }
      }

      parsedData = {
        restaurantName,
        cuisineType,
        dishes: extractedDishes.length > 0 ? extractedDishes : [
          {
            id: `dish-${Date.now()}-1`,
            name: 'Artisan Chef Platter',
            category: 'Chef Signature',
            description: menuText.slice(0, 100),
            ingredients: ['Fresh herbs', 'Seasonal produce'],
            price: '$28',
            suggestedStyle: 'bright',
            photographyNotes: 'Bright morning light with fresh microgreen garnish.',
          },
        ],
      };
    }
    
    // Ensure every dish has a unique ID
    if (Array.isArray(parsedData.dishes)) {
      parsedData.dishes = parsedData.dishes.map((dish: any, idx: number) => ({
        ...dish,
        id: dish.id || `dish-${Date.now()}-${idx}`,
        suggestedStyle: ['rustic', 'bright', 'social'].includes(dish.suggestedStyle)
          ? dish.suggestedStyle
          : 'bright',
      }));
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Menu parsing error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to parse menu text',
      details: String(error),
    });
  }
});

// 2. High-Quality Photo Generation (supports gemini-3-pro-image-preview and gemini-3.1-flash-image-preview, with 1K, 2K, 4K)
app.post('/api/photo/generate', async (req, res) => {
  try {
    const {
      dishName,
      description = '',
      style = 'bright',
      customPrompt,
      model = 'gemini-3-pro-image-preview',
      imageSize = '1K',
      aspectRatio = '1:1',
    } = req.body;

    if (!dishName) {
      return res.status(400).json({ error: 'dishName is required' });
    }

    const promptText = customPrompt || buildFoodPrompt(dishName, description, style);

    // Selected model priority: user requested model or gemini-3-pro-image-preview
    const targetModel =
      model === 'gemini-3.1-flash-image-preview'
        ? 'gemini-3.1-flash-image-preview'
        : 'gemini-3-pro-image-preview';

    const normalizedSize = ['1K', '2K', '4K'].includes(imageSize) ? imageSize : '1K';
    const normalizedRatio = ['1:1', '4:3', '16:9', '3:4', '9:16'].includes(aspectRatio)
      ? aspectRatio
      : '1:1';

    let lastError: any = null;
    let imageUrl: string | null = null;
    let modelUsed = targetModel;

    // Try primary model
    try {
      const response = await ai.models.generateContent({
        model: targetModel,
        contents: {
          parts: [{ text: promptText }],
        },
        config: {
          imageConfig: {
            aspectRatio: normalizedRatio as any,
            imageSize: normalizedSize as any,
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Generation with ${targetModel} failed:`, err.message);

      // Attempt fallback to alternate preview model if primary failed
      const fallbackModel =
        targetModel === 'gemini-3-pro-image-preview'
          ? 'gemini-3.1-flash-image-preview'
          : 'gemini-3-pro-image-preview';

      try {
        console.log(`Retrying generation with fallback model ${fallbackModel}...`);
        const fallbackRes = await ai.models.generateContent({
          model: fallbackModel,
          contents: {
            parts: [{ text: promptText }],
          },
          config: {
            imageConfig: {
              aspectRatio: normalizedRatio as any,
              imageSize: normalizedSize as any,
            },
          },
        });

        for (const part of fallbackRes.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            imageUrl = `data:${mime};base64,${part.inlineData.data}`;
            modelUsed = fallbackModel;
            lastError = null;
            break;
          }
        }
      } catch (fallbackErr: any) {
        lastError = fallbackErr;
        console.warn(`Fallback ${fallbackModel} also failed:`, fallbackErr.message);
      }
    }

    if (imageUrl) {
      return res.json({
        success: true,
        imageUrl,
        modelUsed,
        promptUsed: promptText,
        imageSize: normalizedSize,
        aspectRatio: normalizedRatio,
      });
    }

    // If both failed (e.g. rate limit / quota exhaustion), return detailed info
    return res.status(500).json({
      error: lastError?.message || 'Failed to generate food photograph',
      isQuotaError: String(lastError?.message || '').includes('quota') || String(lastError?.message || '').includes('429'),
      promptUsed: promptText,
    });
  } catch (error: any) {
    console.error('Photo generation endpoint error:', error);
    return res.status(500).json({
      error: error.message || 'Server error during photo generation',
    });
  }
});

// 3. Image Editing API (gemini-3.1-flash-image-preview for text-directed photo editing)
app.post('/api/photo/edit', async (req, res) => {
  try {
    const {
      base64Image,
      instruction,
      model = 'gemini-3.1-flash-image-preview',
      imageSize = '1K',
      aspectRatio = '1:1',
    } = req.body;

    if (!base64Image || !instruction) {
      return res.status(400).json({ error: 'base64Image and instruction are required' });
    }

    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const mimeMatch = base64Image.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

    const targetModel =
      model === 'gemini-3-pro-image-preview'
        ? 'gemini-3-pro-image-preview'
        : 'gemini-3.1-flash-image-preview';

    const normalizedSize = ['1K', '2K', '4K'].includes(imageSize) ? imageSize : '1K';
    const normalizedRatio = ['1:1', '4:3', '16:9', '3:4', '9:16'].includes(aspectRatio)
      ? aspectRatio
      : '1:1';

    let imageUrl: string | null = null;
    let modelUsed = targetModel;

    try {
      const response = await ai.models.generateContent({
        model: targetModel,
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            },
            {
              text: `Culinary food photography photo retouching instruction: ${instruction}. Maintain photorealistic texture, appetizing appearance, and high-end restaurant culinary standards.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: normalizedRatio as any,
            imageSize: normalizedSize as any,
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }
    } catch (err: any) {
      console.warn(`Edit with ${targetModel} failed:`, err.message);
      // Try fallback to other image model
      const fallbackModel =
        targetModel === 'gemini-3.1-flash-image-preview'
          ? 'gemini-3-pro-image-preview'
          : 'gemini-3.1-flash-image-preview';

      const fallbackRes = await ai.models.generateContent({
        model: fallbackModel,
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            },
            {
              text: `Culinary food photography photo retouching instruction: ${instruction}. Maintain photorealistic texture, appetizing appearance, and high-end restaurant culinary standards.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: normalizedRatio as any,
            imageSize: normalizedSize as any,
          },
        },
      });

      for (const part of fallbackRes.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          modelUsed = fallbackModel;
          break;
        }
      }
    }

    if (imageUrl) {
      return res.json({
        success: true,
        imageUrl,
        modelUsed,
        instruction,
      });
    }

    return res.status(500).json({ error: 'No image output received from edit model' });
  } catch (error: any) {
    console.error('Photo editing error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to edit food photograph',
      isQuotaError: String(error?.message || '').includes('quota') || String(error?.message || '').includes('429'),
    });
  }
});

// 4. Prompt Enhancement & Photography Brief Generator
app.post('/api/photo/suggest-prompts', async (req, res) => {
  try {
    const { dishName, description, style } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an elite food stylist and culinary commercial photographer.
Generate 3 distinct creative photography styling ideas for the dish: "${dishName}".
Description/Ingredients: "${description || 'Delicious culinary dish'}".
Target aesthetic: "${style || 'Rustic/Dark'}".

Return JSON with ideas containing:
- title: string (e.g. "Dramatic Chiaroscuro Slate Platter", "Morning Sunlight Microgreen Elegance")
- stylingProps: string[] (e.g. ["Hand-carved olive wood board", "Smoked salt crystals", "Thyme sprigs"])
- lighting: string (e.g. "Hard rim light at 45 degrees with subtle gold bounce")
- prompt: string (Detailed ready-to-use photography prompt)`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ideas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  stylingProps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  lighting: { type: Type.STRING },
                  prompt: { type: Type.STRING },
                },
                required: ['title', 'stylingProps', 'lighting', 'prompt'],
              },
            },
          },
          required: ['ideas'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{"ideas":[]}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Suggest prompts error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Vite middleware in dev or static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
