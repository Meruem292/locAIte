'use server';

/**
 * @fileOverview Predicts the likely location of a tag based on its historical location patterns.
 *
 * - predictTagLocation - A function that handles the prediction of the tag location.
 * - PredictTagLocationInput - The input type for the predictTagLocation function.
 * - PredictTagLocationOutput - The return type for the predictTagLocation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Location } from '@/lib/data';
import { Timestamp } from 'firebase/firestore';

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
  predictedLocation: z
    .object({
      latitude: z.number().describe('The predicted latitude of the tag.'),
      longitude: z.number().describe('The predicted longitude of the tag.'),
      confidence: z.number().describe('The confidence level of the prediction (0-1).'),
      reason: z
        .string()
        .describe(
          'The reason for predicting this location, including a detailed, step-by-step backtracking plan with distance and time.'
        ),
      routeGeometry: z.string().optional().describe('The encoded polyline for the route from the last known location to the predicted location.'),
    })
    .describe('The predicted location of the tag based on historical data.'),
});
export type PredictTagLocationOutput = z.infer<typeof PredictTagLocationOutputSchema>;

type ServerActionInput = {
  tagId: string;
  historicalLocations: (Omit<Location, 'timestamp'> & { timestamp: string | Timestamp })[];
};

export async function predictTagLocation(
  input: ServerActionInput
): Promise<PredictTagLocationOutput> {
  const serializableLocations = input.historicalLocations.map(loc => {
    let timestampStr: string;
    if (loc.timestamp instanceof Timestamp) {
      timestampStr = loc.timestamp.toDate().toISOString();
    } else {
      timestampStr = loc.timestamp as string;
    }
    return { ...loc, timestamp: timestampStr };
  });

  return predictTagLocationFlow({
    tagId: input.tagId,
    historicalLocations: serializableLocations,
  });
}

const getRouteDirections = ai.defineTool(
  {
    name: 'getRouteDirections',
    description: 'Get walking directions between two points.',
    inputSchema: z.object({
      start: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
      end: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
    }),
    outputSchema: z.object({
        distance: z.number().describe("The total distance in meters."),
        duration: z.number().describe("The estimated duration in seconds."),
        steps: z.array(z.object({
            instruction: z.string(),
            distance: z.number(),
        })).describe("Turn-by-turn instructions."),
        geometry: z.string().describe("Encoded polyline of the route."),
    }),
  },
  async ({ start, end }) => {
    try {
      const response = await fetch(`https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY}&start=${start.longitude},${start.latitude}&end=${end.longitude},${end.latitude}`);
      if (!response.ok) {
        console.error("OpenRouteService API Error:", await response.text());
        return { 
            distance: 0, 
            duration: 0, 
            steps: [{ instruction: "Could not retrieve route details.", distance: 0 }],
            geometry: '' 
        };
      }
      const data = await response.json();
      const route = data.features[0];
      const summary = route.properties.summary;
      return {
        distance: summary.distance,
        duration: summary.duration,
        steps: route.properties.segments[0].steps.map((step: any) => ({
          instruction: step.instruction,
          distance: step.distance,
        })),
        geometry: route.geometry,
      };
    } catch (error) {
        console.error('Failed to fetch route:', error);
        return { 
            distance: 0, 
            duration: 0, 
            steps: [{ instruction: "Failed to connect to routing service.", distance: 0 }],
            geometry: ''
        };
    }
  }
);


const prompt = ai.definePrompt({
  name: 'predictTagLocationPrompt',
  tools: [getRouteDirections],
  input: { schema: PredictTagLocationInputSchema },
  output: { schema: PredictTagLocationOutputSchema },
  prompt: `You are an AI assistant that predicts the most likely location of a tag based on its historical location data.

  Analyze the following historical location data for tag ID {{{tagId}}}:
  {{#each historicalLocations}}
  - Address: {{{address}}}, Latitude: {{{latitude}}}, Longitude: {{{longitude}}}, Timestamp: {{{timestamp}}}
  {{/each}}

  Based on these patterns, predict the most likely current location of the tag. Consider factors such as the most recent location, frequently visited locations, and time of day patterns.
  
  Then, use the getRouteDirections tool to get the walking route from the most recent known location to your predicted location.

  Finally, provide a brief explanation of your reasoning that can be used as a backtracking plan to find the device. This plan MUST be in a numbered list format (e.g., 1. First, do this. 2. Then, do that.). The plan should incorporate the turn-by-turn directions from the routing tool. Include the total distance and estimated walking time in your summary.
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
