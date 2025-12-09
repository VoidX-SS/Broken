'use server';
/**
 * @fileOverview An AI agent that converts text to speech.
 *
 * - generateSpeechFromText - A function that handles the text-to-speech conversion.
 * - GenerateSpeechOutput - The return type for the generateSpeechFromText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

export type GenerateSpeechOutput = z.infer<typeof GenerateSpeechOutputSchema>;

// Export the main function
export async function generateSpeechFromText(
  text: string
): Promise<GenerateSpeechOutput> {
  return generateSpeechFlow(text);
}

// Schemas are defined inside, not exported
const GenerateSpeechOutputSchema = z.object({
  audio: z.string().optional().describe('The base64 encoded WAV audio data.'),
});

// Helper function to convert PCM to WAV
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

// The Genkit flow
const generateSpeechFlow = ai.defineFlow(
  {
    name: 'generateSpeechFlow',
    inputSchema: z.string(),
    outputSchema: GenerateSpeechOutputSchema,
  },
  async (text) => {
    if (!text.trim()) {
      return { audio: undefined };
    }

    try {
      const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A standard female voice
            },
          },
        },
        prompt: text,
      });

      if (!media || !media.url) {
        throw new Error('No audio media was returned from the AI.');
      }

      // The URL is a data URI: "data:audio/pcm;base64,..."
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      
      const wavBase64 = await toWav(audioBuffer);

      return {
        audio: 'data:audio/wav;base64,' + wavBase64,
      };
    } catch (err) {
      console.error('Text-to-speech generation failed:', err);
      // Return an empty object on failure to avoid breaking the client
      return { audio: undefined };
    }
  }
);
