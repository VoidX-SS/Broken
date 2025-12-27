
'use server';
/**
 * @fileOverview A Genkit flow that generates a description and category for a clothing item from a photo.
 *
 * This file defines the `generateDescriptionForClothingItem` flow, which takes a data URI of a clothing
 * item's photo and returns a structured JSON object containing a generated description and the most
 * appropriate category for the item.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateDescriptionInputSchema,
  GenerateDescriptionOutputSchema,
  type GenerateDescriptionInput,
  type GenerateDescriptionOutput,
} from '@/ai/flows/types';
import {wardrobeCategories} from '@/lib/types';

/**
 * A wrapper function that invokes the `generateDescriptionForClothingItemFlow`.
 * This function is exported and can be called from server-side components.
 * @param input The input object containing the photo data URI.
 * @returns A promise that resolves to the generated description and category.
 */
export async function generateDescriptionForClothingItem(
  input: GenerateDescriptionInput
): Promise<GenerateDescriptionOutput> {
  // Delegate the call to the Genkit flow.
  return generateDescriptionForClothingItemFlow(input);
}

// Define the prompt for the AI model.
const generateDescriptionPrompt = ai.definePrompt({
  name: 'generateDescriptionPrompt',
  input: {schema: GenerateDescriptionInputSchema},
  output: {schema: GenerateDescriptionOutputSchema},

  // The prompt instructs the AI to act as a fashion cataloger.
  prompt: `You are an expert fashion cataloger. Analyze the provided image of a clothing item.
    1. Generate a concise, descriptive summary. The description should include the item's color, style, and type. For example, if the image shows a blue dress with a floral pattern, a good description would be "Blue floral print summer dress".
    2. Choose the most appropriate category for the item from the following list.

    Available Categories: ${JSON.stringify(wardrobeCategories)}
    Respond in the following language: {{{language}}}.
    
    Image to analyze: {{media url=photoDataUri}}`,

  // Configure the model for JSON output.
  response: {
    format: 'json',
  },
  config: {
    // @ts-ignore: Do SDK có thể chưa cập nhật type definition cho thinkingConfig kịp thời
    thinkingConfig: {
      includeThoughts: true,
      thoughtBudgetTokens: 1024,
    },
  },
});

// Define the main flow.
const generateDescriptionForClothingItemFlow = ai.defineFlow(
  {
    name: 'generateDescriptionForClothingItemFlow',
    inputSchema: GenerateDescriptionInputSchema,
    outputSchema: GenerateDescriptionOutputSchema,
  },
  async (input: GenerateDescriptionInput) => {
    // Generate content using the defined prompt.
    const {output} = await generateDescriptionPrompt(input);

    // Validate the output to ensure it's not null.
    if (!output) {
      throw new Error('The AI returned a null response.');
    }

    return output;
  }
);
