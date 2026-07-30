import { GoogleGenerativeAI } from '@google/generative-ai';
import { getApiKey } from './env.js';

const apiKey = getApiKey();

export const ai = apiKey ? new GoogleGenerativeAI(apiKey) : null;
