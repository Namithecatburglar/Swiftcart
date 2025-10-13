import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { CartItem } from '../types';
import { MOCK_PRODUCTS } from "../constants";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getProductSuggestions = async (cartItems: CartItem[]): Promise<string> => {
  if (!API_KEY) {
    return "Product suggestions are unavailable. API key is missing.";
  }
  
  if (cartItems.length === 0) {
    return "Add items to your cart to get suggestions!";
  }

  const itemNames = cartItems.map(item => item.name).join(', ');

  const prompt = `Based on the following items in a shopping cart (${itemNames}), suggest one or two complementary products or a simple recipe idea. Keep the suggestion brief and friendly.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
        }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching product suggestions:", error);
    return "Sorry, I couldn't fetch suggestions right now.";
  }
};

export const identifyItemInImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
    if (!API_KEY) {
        console.warn("API_KEY not set. Using mock item identification.");
        const mockItem = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
        return mockItem.name;
    }

    const imagePart = {
        inlineData: {
            data: base64ImageData,
            mimeType: mimeType,
        },
    };

    const textPart = {
        text: "Identify the single, most prominent grocery item in this image. Respond with only the name of the item (e.g., 'Apple', 'Banana', 'Avocado'). If you are unsure, respond with 'Unknown'.",
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        const resultText = response.text.trim();
        if (!resultText || resultText.toLowerCase() === 'unknown') {
            throw new Error("Could not identify the item in the image.");
        }
        return resultText;

    } catch (error) {
        console.error("Error identifying item with Gemini:", error);
        return "Unknown";
    }
};
