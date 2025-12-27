
import {./genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Update the defineFlow function to accept an API key
export const ai = genkit({
  plugins: [googleAI({
    // Pass the API key when initializing the plugin.
    // The key can be provided as a string or a promise that resolves to a string.
    apiKey: process.env.GEMINI_API_KEY,
  })],
  // Use gemini-3-flash-preview as it's a fast and capable model
  model: 'googleai/gemini-3-flash-preview',
});
