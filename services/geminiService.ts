import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const editImage = async (
  imageBase64: string,
  prompt: string,
  mimeType: string = "image/png"
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: imageBase64,
            },
          },
        ],
      },
    });

    // Check for inline data (the edited image)
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    // Fallback if model answers with text explaining why it couldn't do it
    const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
    if (textPart?.text) {
        throw new Error(textPart.text);
    }

    throw new Error("No image generated.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
