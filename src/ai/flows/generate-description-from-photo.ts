'use server';
/**
 * @fileOverview An AI agent that generates a description for a clothing item from a photo.
 *
 * - generateDescriptionForClothingItem - A function that handles the description generation process.
 * - GenerateDescriptionInput - The input type for the generateDescriptionForClothingItem function.
 * - GenerateDescriptionOutput - The return type for the generateDescriptionForClothingItem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDescriptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a clothing item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateDescriptionInput = z.infer<typeof GenerateDescriptionInputSchema>;

const GenerateDescriptionOutputSchema = z.object({
  description: z.string().describe('A concise, descriptive summary of the clothing item in the photo, including color, style, and type. For example, "Blue floral print summer dress" or "Black leather biker jacket".'),
});
export type GenerateDescriptionOutput = z.infer<typeof GenerateDescriptionOutputSchema>;


export async function generateDescriptionForClothingItem(input: GenerateDescriptionInput): Promise<GenerateDescriptionOutput> {
  return generateDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDescriptionPrompt',
  input: {schema: GenerateDescriptionInputSchema},
  output: {schema: GenerateDescriptionOutputSchema},
  prompt: `You are an expert fashion cataloger. Analyze the provided image of a clothing item and generate a concise, descriptive summary. The description should include the item's color, style, and type.

For example, if the image shows a blue dress with a floral pattern, a good description would be "Blue floral print summer dress". If it's a black jacket, "Black leather biker jacket".

Image: {{media url=photoDataUri}}`,
});

const generateDescriptionFlow = ai.defineFlow(
  {
    name: 'generateDescriptionFlow',
    inputSchema: GenerateDescriptionInputSchema,
    outputSchema: GenerateDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
