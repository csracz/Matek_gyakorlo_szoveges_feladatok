import { GoogleGenAI, Type } from "@google/genai";
import { MathTopic, Question, AdventureTheme } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-2.5-flash';
const imageModelName = 'gemini-2.5-flash-image';

export const generateMathQuestions = async (topics: MathTopic[], theme: AdventureTheme, count: number = 10): Promise<Question[]> => {
  try {
    const topicList = topics.join(', ');
    const prompt = `
      Készíts ${count} darab matematikai feladatot 8-10 éves magyar gyerekeknek.
      
      Matematikai Témakörök (legyen vegyesen ezekből): ${topicList}.
      Környezet/Történet (A szöveges feladatok ehhez kapcsolódjanak): ${theme.name} (${theme.description}).
      
      Fontos:
      - A feladatok szövege legyen játékos, és kapcsolódjon szorosan a "${theme.name}" témához (pl. ha Űrutazás, akkor űrhajók, csillagok; ha Dínó, akkor tojások, ősemberek).
      - Legyenek vegyesen egyszerű számítások (ahol a szöveg csak rövid körítés) és szöveges feladatok.
      - Ha a téma Kerekítés, akkor a feladat kérdezze meg egy szám kerekített értékét.
      - A válaszlehetőségek (options) legyenek számok.
      
      Válaszolj JSON formátumban.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              questionText: { type: Type.STRING, description: "A feladat szövege magyarul, a választott témához igazítva." },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.NUMBER }, 
                description: "4 választási lehetőség, ebből egy helyes." 
              },
              correctAnswer: { type: Type.NUMBER, description: "A helyes válasz számértéke." },
              explanation: { type: Type.STRING, description: "Rövid, bátorító magyarázat, ha elrontaná." }
            },
            required: ["id", "questionText", "options", "correctAnswer"]
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as Question[];
    }
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback static questions in case of API failure to keep the app usable
    return [
      { id: 'f1', questionText: 'Mennyi 5 + 3?', options: [7, 8, 9, 10], correctAnswer: 8, explanation: 'Próbáld az ujjaidon kiszámolni!' },
      { id: 'f2', questionText: 'Ha van 10 almád és megeszel 2-t, mennyi marad?', options: [6, 7, 8, 9], correctAnswer: 8 },
      { id: 'f3', questionText: 'Mennyi 2 x 4?', options: [6, 8, 10, 12], correctAnswer: 8 },
      { id: 'f4', questionText: 'Kerekítsd a 12-t tízesre!', options: [10, 20, 15, 12], correctAnswer: 10 },
      { id: 'f5', questionText: 'Kerekítsd a 198-at százasra!', options: [100, 190, 200, 150], correctAnswer: 200 },
      { id: 'f6', questionText: 'Mennyi 15 - 5?', options: [5, 10, 15, 20], correctAnswer: 10 },
      { id: 'f7', questionText: 'Mennyi a duplája a 6-nak?', options: [10, 12, 14, 16], correctAnswer: 12 },
      { id: 'f8', questionText: 'Mennyi 3 x 3?', options: [6, 9, 12, 15], correctAnswer: 9 },
      { id: 'f9', questionText: 'Kerekítsd az 54-et tízesre!', options: [50, 60, 55, 40], correctAnswer: 50 },
      { id: 'f10', questionText: 'Hány lába van 2 kutyának?', options: [4, 6, 8, 10], correctAnswer: 8 },
    ];
  }
};

export const generateEncouragement = async (name: string, isSuccess: boolean): Promise<string> => {
  try {
    const prompt = isSuccess
      ? `Dicsérd meg ${name}-t, egy 9 éves gyereket, mert ügyesen oldott meg matek feladatokat. Legyen rövid, vicces, lelkesítő.`
      : `Bátorítsd ${name}-t, egy 9 éves gyereket, mert nem sikerült jól a feladat. Mondd neki, hogy gyakorlással menni fog. Legyen kedves.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        maxOutputTokens: 50,
        temperature: 0.7,
      }
    });

    return response.text || (isSuccess ? "Szép munka!" : "Sebaj, legközelebb sikerül!");
  } catch (e) {
    return isSuccess ? "Ügyes vagy!" : "Gyakorlat teszi a mestert!";
  }
};

export const editStickerImage = async (imageBase64: string, userPrompt: string): Promise<string> => {
  try {
    // Determine mime type from base64 header or default to png
    const mimeType = imageBase64.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';
    // Remove header for the API call
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: imageModelName,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: `Edit this sticker image: ${userPrompt}. Keep the style consistent (cartoon/vector).`,
          },
        ],
      },
    });

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }

    // Fallback if no image generated
    return imageBase64;
  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    return imageBase64;
  }
};
