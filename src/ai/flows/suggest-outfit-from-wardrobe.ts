
'use server';
/**
 * @fileOverview A Genkit flow that suggests an outfit based on user's wardrobe and preferences.
 *
 * This file defines the `suggestOutfit` flow. The flow takes user preferences (occasion, weather, style)
 * and a list of available wardrobe items (description and category only) to generate a
 * text-based outfit suggestion.
 */

import {ai} from '@/ai/genkit';
import {
  SuggestOutfitInputSchema,
  SuggestOutfitOutputSchema,
  type SuggestOutfitInput,
  type SuggestOutfitOutput,
} from '@/ai/flows/types';

/**
 * A wrapper function that invokes the `suggestOutfitFlow`.
 * This function is exported and can be called from server-side components.
 * @param input The input object containing user preferences and wardrobe items.
 * @returns A promise that resolves to the suggested outfit.
 */
export async function suggestOutfit(input: SuggestOutfitInput): Promise<SuggestOutfitOutput> {
  return suggestOutfitFlow(input);
}

// Define the prompt for the AI model.
const suggestOutfitPrompt = ai.definePrompt({
  name: 'suggestOutfitPrompt',
  input: {schema: SuggestOutfitInputSchema},
  output: {schema: SuggestOutfitOutputSchema},

  // The prompt instructs the AI to act as a personal stylist.
  prompt: `You are a personal stylist. Your task is to suggest a complete outfit (top, bottom, accessories, etc.) using ONLY the items available in the user's wardrobe.

    Analyze the user's request based on the provided details and their available clothing items.

    Respond in the following language: {{{language}}}.

    USER'S REQUEST:
    - Gender: {{{gender}}}
    - Event: {{{occasion}}}
    - Weather: {{{weather}}}
    - Desired Style (vibe, colors, etc.): {{{style}}}

    AVAILABLE WARDROBE ITEMS (Category, Description):
    {{#each wardrobe}}
    - {{{this.category}}}, {{{this.description}}}
    {{/each}}
    `,

  // Configure the model for JSON output.
  config: {
    response: {
      format: 'json',
    },
    // @ts-ignore: Do SDK có thể chưa cập nhật type definition cho thinkingConfig kịp thời
    thinkingConfig: {
      includeThoughts: true,
      thoughtBudgetTokens: 1024,
    },
  },
});

// Define the main flow.
const suggestOutfitFlow = ai.defineFlow(
  {
    name: 'suggestOutfitFlow',
    inputSchema: SuggestOutfitInputSchema,
    outputSchema: SuggestOutfitOutputSchema,
  },
  async (input: SuggestOutfitInput) => {
    const {output} = await suggestOutfitPrompt(input);

    if (!output) {
      throw new Error('The AI returned a null response.');
    }

    return output;
  }
);
