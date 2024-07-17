import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyDv0tFoE9ClbpbKQ62U7q7RQSl68pwNaM8');

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export async function createServiceByGemini(url) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig,
    safetySettings,
  });
  const response = await fetch(url);
  const data = await response.arrayBuffer();
  const result = await model.generateContent([
    'Extract all text from the image',
    {
      inlineData: {
        // eslint-disable-next-line no-undef
        data: Buffer.from(new Uint8Array(data)).toString('base64'),
        mimeType: 'image/png',
      },
    },
  ]);
  return result.response.text();
}
