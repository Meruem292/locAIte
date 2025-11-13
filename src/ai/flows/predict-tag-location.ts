'use server';

/**
 * @fileOverview Predicts the likely location of a tag based on its historical location patterns.
 *
 * - predictTagLocation - A function that handles the prediction of the tag location.
 * - PredictTagLocationInput - The input type for the predictTagLocation function.
 * - PredictTagLocationOutput - The return type for the predictTagLocation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import type { Location } from '@/lib/data';

const PredictTagLocationInputSchema = z.object({
  tagId: z.string().describe('The ID of the tag to predict the location for.'),
  historicalLocations: z
    .array(
      z.object({
        id: z.string(),
        latitude: z.number().describe('The latitude of the location.'),
        longitude: z.number().describe('The longitude of the location.'),
        timestamp: z.any().describe('The timestamp of the location (ISO format).'),
        address: z.string().optional().describe('The human-readable address of the location.'),
      })
    )
    .describe('The historical locations of the tag.'),
});
export type PredictTagLocationInput = z.infer<typeof PredictTagLocationInputSchema>;

const PredictTagLocationOutputSchema = z.object({
  predictedLocation: z.object({
    latitude: z.number().describe('The predicted latitude of the tag.'),
    longitude: z.number().describe('The predicted longitude of the tag.'),
    confidence: z.number().describe('The confidence level of the prediction (0-1).'),
    reason: z.string().describe('The reason for predicting this location, including a backtracking plan.'),
  }).describe('The predicted location of the tag based on historical data.'),
});
export type PredictTagLocationOutput = z.infer<typeof PredictTagLocationOutputSchema>;

export async function predictTagLocation(input: {tagId: string, historicalLocations: Location[]}): Promise<PredictTagLocationOutput> {
  // Zod schema doesn't handle Date/Timestamp objects well when passing from client to server action
  // So we manually construct the input for the flow.
  const flowInput = {
    ...input,
    historicalLocations: input.historicalLocations.map(l => ({
      ...l,
      timestamp: l.timestamp instanceof Date ? l.timestamp.toISOString() : l.timestamp,
    }))
  }
  return predictTagLocationFlow(flowInput);
}

const prompt = ai.definePrompt({
  name: 'predictTagLocationPrompt',
  input: {schema: PredictTagLocationInputSchema},
  output: {schema: PredictTagLocationOutputSchema},
  prompt: `You are an AI assistant that predicts the most likely location of a tag based on its historical location data.

  Analyze the following historical location data for tag ID {{{tagId}}}:
  {{#each historicalLocations}}
  - Address: {{{address}}}, Latitude: {{{latitude}}}, Longitude: {{{longitude}}}, Timestamp: {{{timestamp}}}
  {{/each}}

  Based on these patterns, predict the most likely current location of the tag.
  Consider factors such as the most recent location, frequently visited locations, and time of day patterns.
  Provide a confidence level (0-1) for your prediction.
  Also, provide a brief explanation of your reasoning that can be used as a backtracking plan to find the device.
  `,
});

const predictTagLocationFlow = ai.defineFlow(
  {
    name: 'predictTagLocationFlow',
    inputSchema: PredictTagLocationInputSchema,
    outputSchema: PredictTagLocationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
