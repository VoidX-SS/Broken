'use server';
/**
 * @fileOverview An AI agent that extracts specific clothing items from a text description of an outfit.
 *
 * - extractOutfitFromText - A function that identifies which items from a wardrobe match the suggestion.
 * - ExtractOutfitInput - The input type for the extractOutfitFromText function.
 * - ExtractOutfitOutput - The return type for the extractOutfitFromText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { WardrobeItem } from '@/lib/types';

const WardrobeItemSchema = z.object({
    id: z.string(),
    photoDataUri: z.string(),
    description: z.string(),
    category: z.string(),
});

const ExtractOutfitInputSchema = z.object({
  suggestionText: z.string().describe('The natural language text of the outfit suggestion.'),
  wardrobe: z.array(WardrobeItemSchema).describe('The full list of available wardrobe items.'),
});
export type ExtractOutfitInput = z.infer<typeof ExtractOutfitInputSchema>;


const ExtractOutfitOutputSchema = z.object({
  items: z.array(z.object({
    id: z.string().describe("The ID of the wardrobe item."),
    description: z.string().describe("The original description of the item."),
  })).describe('An array of wardrobe items that are part of the suggested outfit.'),
});
export type ExtractOutfitOutput = {
    items: WardrobeItem[];
};

export async function extractOutfitFromText(input: ExtractOutfitInput): Promise<ExtractOutfitOutput> {
  const llmOut = await extractOutfitFlow(input);

  // The LLM only returns the IDs and descriptions. We need to find the full items from the original wardrobe list.
  const foundItems: WardrobeItem[] = [];
  if (llmOut && llmOut.items) {
    for (const extractedItem of llmOut.items) {
        const found = input.wardrobe.find(wardrobeItem => wardrobeItem.id === extractedItem.id);
        if (found) {
        foundItems.push(found);
        }
    }
  }


  return { items: foundItems };
}

const prompt = ai.definePrompt({
  name: 'extractOutfitPrompt',
  input: {schema: ExtractOutfitInputSchema},
  output: {schema: ExtractOutfitOutputSchema},
  prompt: `You are an expert at parsing outfit suggestions.
  Your task is to analyze the provided outfit suggestion text and identify which specific items from the user's wardrobe are being recommended.
  
  Match the items from the suggestion with the items in the wardrobe based on their descriptions.
  
  Return a list of the identified wardrobe items.
  
  Suggestion:
  "{{suggestionText}}"
  
  Available Wardrobe Items:
  {{{json wardrobe}}}
  `,
});

const extractOutfitFlow = ai.defineFlow(
  {
    name: 'extractOutfitFlow',
    inputSchema: ExtractOutfitInputSchema,
    outputSchema: ExtractOutfitOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
