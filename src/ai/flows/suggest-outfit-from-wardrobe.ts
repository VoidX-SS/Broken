'use server';
/**
 * @fileOverview An AI agent that suggests outfits from a user's wardrobe.
 *
 * - suggestOutfit - A function that handles the outfit suggestion process.
 * - SuggestOutfitInput - The input type for the suggestOutfit function.
 * - SuggestOutfitOutput - The return type for the suggestOutfit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOutfitInputSchema = z.object({
  wardrobe: z
    .array(
      z.object({
        description: z.string().describe('The description of the clothing item.'),
        category: z.string().describe('The category of the clothing item (e.g., shirt, pants, dress).'),
      })
    )
    .describe("The user's wardrobe, represented as an array of clothing item descriptions."),
  occasion: z.string().describe('The occasion for which the outfit is being suggested.'),
  weather: z.string().describe('The current weather conditions.'),
  gender: z.enum(['male', 'female']).describe('The gender for which the outfit is being suggested.'),
  style: z.string().describe('The desired style for the outfit (e.g., casual, formal, chic).'),
  language: z.string().describe('The language for the AI to respond in (e.g., "English", "Vietnamese").'),
});
export type SuggestOutfitInput = z.infer<typeof SuggestOutfitInputSchema>;

const SuggestOutfitOutputSchema = z.object({
  suggestion: z.string().describe('A detailed text-only outfit suggestion, describing which items to combine.'),
  reasoning: z.string().describe('The reasoning behind the outfit suggestion.'),
});
export type SuggestOutfitOutput = z.infer<typeof SuggestOutfitOutputSchema>;

export async function suggestOutfit(input: SuggestOutfitInput): Promise<SuggestOutfitOutput> {
  return suggestOutfitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOutfitPrompt',
  input: {schema: SuggestOutfitInputSchema},
  output: {schema: SuggestOutfitOutputSchema},
  prompt: `You are a personal stylist. Your task is to suggest a complete outfit (top, bottom, accessories, etc.) using ONLY the items available in the user's wardrobe. Your response must be purely text-based.

Analyze the user's request based on the provided details and their available clothing items.

Respond in the following language: {{{language}}}.

USER'S REQUEST:
- Gender: {{{gender}}}
- Occasion: {{{occasion}}}
- Weather: {{{weather}}}
- Desired Style (vibe, colors, etc.): {{{style}}}

AVAILABLE WARDROBE ITEMS:
{{#each wardrobe}}
- Category: {{{category}}}, Description: {{{description}}}
{{/each}}

Based on the request and the available items, provide a detailed outfit suggestion and explain your reasoning.
`,
});

const suggestOutfitFlow = ai.defineFlow(
  {
    name: 'suggestOutfitFlow',
    inputSchema: SuggestOutfitInputSchema,
    outputSchema: SuggestOutfitOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
