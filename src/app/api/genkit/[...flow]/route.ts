/**
 * @fileoverview This file is the API route for Genkit flows.
 * It uses the @genkit-ai/next plugin to create a handler that exposes the Genkit flows.
 */

import { POST } from '@genkit-ai/next/server';
import '@/ai'; // Import flows to register them with Genkit

export { POST };
