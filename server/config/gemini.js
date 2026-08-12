import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

export let genAI = null;

if (apiKey && apiKey !== 'your-gemini-api-key') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Google Gemini AI Client Initialized successfully.');
  } catch (err) {
    console.warn('⚠️ Gemini AI Initialization warning:', err.message);
  }
} else {
  console.log('ℹ️ Gemini API key not provided in GEMINI_API_KEY. Fallback smart analyzer enabled.');
}
