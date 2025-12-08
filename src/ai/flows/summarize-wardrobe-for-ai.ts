'use server';
/**
 * @fileOverview A wardrobe summarization AI agent.
 *
 * - summarizeWardrobe - A function that summarizes a user's wardrobe and style.
 * - SummarizeWardrobeInput - The input type for the summarizeWardrobe function.
 * - SummarizeWardrobeOutput - The return type for the summarizeWardrobe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeWardrobeInputSchema = z.object({
  wardrobeDescription: z
    .string()
    .describe('A detailed description of the user\'s wardrobe, including the types of clothing items, colors, materials, and any style preferences.'),
});
export type SummarizeWardrobeInput = z.infer<typeof SummarizeWardrobeInputSchema>;

const SummarizeWardrobeOutputSchema = z.object({
  wardrobeSummary: z
    .string()
    .describe('A concise summary of the user\'s wardrobe and style, highlighting key characteristics and preferences.'),
});
export type SummarizeWardrobeOutput = z.infer<typeof SummarizeWardrobeOutputSchema>;

export async function summarizeWardrobe(input: SummarizeWardrobeInput): Promise<SummarizeWardrobeOutput> {
  return summarizeWardrobeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeWardrobePrompt',
  input: {schema: SummarizeWardrobeInputSchema},
  output: {schema: SummarizeWardrobeOutputSchema},
  prompt: `You are a personal styling assistant. Please summarize the following description of a user's wardrobe and style, highlighting the key characteristics and preferences.

Wardrobe Description: {{{wardrobeDescription}}}`,
});

const summarizeWardrobeFlow = ai.defineFlow(
  {
    name: 'summarizeWardrobeFlow',
    inputSchema: SummarizeWardrobeInputSchema,
    outputSchema: SummarizeWardrobeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
