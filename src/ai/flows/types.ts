/**
 * @fileOverview This file contains the shared Zod schemas and TypeScript types
 * for the Genkit flows. Separating these into their own file is necessary
 * to comply with Next.js's "'use server'" module constraints.
 */

import { z } from 'zod';
import { wardrobeCategories } from '@/lib/types';

// Schema for generating a clothing item's description from a photo.
export const GenerateDescriptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'The data URI of the clothing item photo, including MIME type and Base64 encoding.'
    ),
  language: z.string().describe('The language for the response.'),
});
export type GenerateDescriptionInput = z.infer<
  typeof GenerateDescriptionInputSchema
>;

export const GenerateDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated description of the item.'),
  category: z
    .enum(wardrobeCategories)
    .describe('The most appropriate category for the item.'),
});
export type GenerateDescriptionOutput = z.infer<
  typeof GenerateDescriptionOutputSchema
>;

// Schema for suggesting an outfit from the user's wardrobe.
export const SuggestOutfitInputSchema = z.object({
  wardrobe: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      category: z.enum(wardrobeCategories),
    })
  ).describe('A list of available wardrobe items with their IDs.'),
  occasion: z.string().describe("The event or occasion for the outfit."),
  weather: z.string().describe('The current weather conditions.'),
  gender: z.enum(['male', 'female']).describe('The gender of the user.'),
  style: z.string().describe('The desired style or vibe for the outfit.'),
  language: z.string().describe('The language for the response.'),
});
export type SuggestOutfitInput = z.infer<typeof SuggestOutfitInputSchema>;

export const SuggestOutfitOutputSchema = z.object({
  suggestion: z.string().describe("The detailed outfit suggestion."),
  reasoning: z.string().describe("The reasoning behind the suggestion."),
  suggestedItemIds: z.array(z.string()).describe("An array of IDs of the suggested clothing items from the wardrobe."),
});
export type SuggestOutfitOutput = z.infer<typeof SuggestOutfitOutputSchema>;
