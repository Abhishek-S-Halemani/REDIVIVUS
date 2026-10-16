import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Increase JSON body limit for base64 image data
app.use(express.json({ limit: '15mb' }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    console.warn('GEMINI_API_KEY is missing or unconfigured in server environment');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Endpoint for AI Waste Analysis via Gemini 3.8 Flash Vision
app.post('/api/analyze-waste', async (req, res) => {
  try {
    const { imageDataUrl, categoryHint } = req.body;

    if (!imageDataUrl) {
      return res.status(400).json({ error: 'Valid imageDataUrl is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key is not configured' });
    }

    // Extract mimeType and base64 string
    let mimeType = 'image/jpeg';
    let base64Data = '';

    if (imageDataUrl.startsWith('data:')) {
      const matches = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        base64Data = matches[2];
        if (!mimeType.startsWith('image/')) {
          mimeType = 'image/jpeg';
        }
      } else {
        return res.status(400).json({ error: 'Invalid base64 image data URL format' });
      }
    } else {
      // Raw base64 data passed directly
      base64Data = imageDataUrl;
    }

    const imagePart = {
      inlineData: {
        mimeType,
        data: base64Data,
      },
    };

    const promptText = `Examine this uploaded photo using high-precision AI vision analysis.
1. Object Recognition: Visually identify the exact object shown in the picture for "detectedItem" (e.g. "PET Plastic Water Bottle", "Circuit Board / E-Waste", "Torn Denim Jeans", "Hardwood Scrap", "Glass Bottle", "Corrugated Cardboard Box", "Aluminum Beverage Can").
2. Material Classification: Identify the material category for "materialCategory" (e.g. "PET Polymer", "Epoxy PCB", "Cotton Textile", "Hardwood Timber", "Silicate Glass").
3. Recyclability Metrics: Estimate realistic percentage metrics: recyclablePercent (0-100), biodegradablePercent (0-100), reusablePercent (0-100).
4. Object Information & Diagnosis: Provide a concise 2-sentence explanation of what the object is, its material composition, and zero-landfill recommendation in "analysisSummary".
5. Reusability & Craft Making Guide: Generate 3 creative, practical upcycling craft ideas explaining how to reuse this exact recognized object and make a craft out of it in "options". Each craft idea must include: title, subtitle, category, difficulty, timeRequired, resultImageUrl (a relevant high-quality Unsplash image URL), description, materialsUsed, and 3-4 clear step-by-step crafting instructions explaining how to make the craft.
${categoryHint ? `Category hint from user: ${categoryHint}` : ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [imagePart, { text: promptText }],
        },
      ],
      config: {
        systemInstruction:
          'You are an expert AI vision object classifier and master craft upcycling engineer. Visually identify the exact object in the uploaded picture, explain its material details, and generate 3 step-by-step DIY craft making projects showing how to reuse and turn the object into a functional craft.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedItem: {
              type: Type.STRING,
              description: 'Specific name of the waste/scrap item detected in the photo',
            },
            materialCategory: {
              type: Type.STRING,
              description: 'Material classification class e.g. PET Polymer, FR-4 PCB, Selvedge Denim, Hardwood Timber, Glass Cullet',
            },
            recyclablePercent: {
              type: Type.INTEGER,
              description: 'Percentage of the material that is recyclable (0-100)',
            },
            biodegradablePercent: {
              type: Type.INTEGER,
              description: 'Percentage of the material that is biodegradable (0-100)',
            },
            reusablePercent: {
              type: Type.INTEGER,
              description: 'Percentage of the material that is reusable/upcyclable (0-100)',
            },
            confidenceScore: {
              type: Type.INTEGER,
              description: 'Visual classification confidence score (80-100)',
            },
            co2PotentialKg: {
              type: Type.NUMBER,
              description: 'Estimated CO2 reduction in kg from diverting this item from landfill',
            },
            ecoPointsReward: {
              type: Type.INTEGER,
              description: 'Eco reward points for recycling this item (e.g. 150-250)',
            },
            analysisSummary: {
              type: Type.STRING,
              description: 'Diagnostic summary of the material composition and zero-landfill recommendation',
            },
            options: {
              type: Type.ARRAY,
              description: '3 creative upcycling projects that can be made from this item',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  category: { type: Type.STRING },
                  difficulty: { type: Type.STRING, description: 'Easy, Intermediate, or Artisan' },
                  timeRequired: { type: Type.STRING, description: 'Estimated time e.g. 35 mins' },
                  resultImageUrl: { type: Type.STRING, description: 'High quality Unsplash image URL showcasing the upcycled product' },
                  description: { type: Type.STRING },
                  materialsUsed: { type: Type.STRING },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        stepNumber: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        instruction: { type: Type.STRING },
                        toolRequired: { type: Type.STRING },
                        tip: { type: Type.STRING },
                      },
                      required: ['stepNumber', 'title', 'instruction'],
                    },
                  },
                },
                required: [
                  'id',
                  'title',
                  'subtitle',
                  'category',
                  'difficulty',
                  'timeRequired',
                  'resultImageUrl',
                  'description',
                  'materialsUsed',
                  'steps',
                ],
              },
            },
          },
          required: [
            'detectedItem',
            'materialCategory',
            'recyclablePercent',
            'biodegradablePercent',
            'reusablePercent',
            'confidenceScore',
            'co2PotentialKg',
            'ecoPointsReward',
            'analysisSummary',
            'options',
          ],
        },
      },
    });

    let responseText = response.text || '';
    responseText = responseText.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();

    if (!responseText) {
      return res.status(500).json({ error: 'No response text received from Gemini API' });
    }

    const parsedJson = JSON.parse(responseText);
    res.json(parsedJson);
  } catch (err: any) {
    console.error('Error calling Gemini Vision API:', err);
    res.status(500).json({ error: err.message || 'Error processing image analysis' });
  }
});

// Vite Middleware integration for local dev server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const fs = await import('fs');
        const path = await import('path');
        let template = fs.readFileSync(path.resolve('.', 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
