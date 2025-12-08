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
        photoDataUri: z
          .string()
          .describe(
            "A photo of a clothing item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
          ),
        description: z.string().describe('The description of the clothing item.'),
        category: z.string().describe('The category of the clothing item (e.g., shirt, pants, dress).'),
      })
    )
    .describe('The user wardrobe, represented as an array of clothing items.'),
  occasion: z.string().describe('The occasion for which the outfit is being suggested.'),
  weather: z.string().describe('The current weather conditions.'),
});
export type SuggestOutfitInput = z.infer<typeof SuggestOutfitInputSchema>;

const SuggestOutfitOutputSchema = z.object({
  suggestion: z.string().describe('The outfit suggestion.'),
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
  prompt: `You are a personal stylist. Given a user's wardrobe, the occasion, and the weather, suggest an outfit from their wardrobe and explain your reasoning.\n\nWardrobe:\n{{#each wardrobe}}\n- Category: {{{category}}}, Description: {{{description}}}, Photo: {{media url=photoDataUri}}\n{{/each}}\n\nOccasion: {{{occasion}}}\nWeather: {{{weather}}}\n\nSuggestion: \nReasoning: `,
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
