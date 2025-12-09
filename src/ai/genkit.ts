import {genkit, GenerationCommonConfig} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Update the defineFlow function to accept an API key
export const ai = genkit({
  plugins: [googleAI({
    // Pass the API key when initializing the plugin.
    // The key can be provided as a string or a promise that resolves to a string.
    apiKey: process.env.GEMINI_API_KEY,
  })],
  model: 'googleai/gemini-2.5-flash',
});

// A helper function to create a config with the API key
export function getConfig(apiKey?: string | null): GenerationCommonConfig {
  return {
    // If an API key is provided, create a new Google AI plugin instance with it.
    // This allows for per-request API key injection.
    plugin: apiKey ? googleAI({ apiKey }) : undefined,
  };
}
