'use server';

/**
 * @fileOverview Summarizes the location history of a tag over a specified period.
 *
 * - summarizeLocationHistory - A function that summarizes the location history.
 * - SummarizeLocationHistoryInput - The input type for the summarizeLocationHistory function.
 * - SummarizeLocationHistoryOutput - The return type for the summarizeLocationHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLocationHistoryInputSchema = z.object({
  locationHistory: z.array(z.object({
    latitude: z.number().describe('The latitude of the location.'),
    longitude: z.number().describe('The longitude of the location.'),
    timestamp: z.string().describe('The timestamp of the location (ISO format).'),
    address: z.string().optional().describe('The human-readable address of the location.'),
  })).describe('The location history data to summarize.'),
  timePeriod: z.string().describe('The time period for which to summarize the location history (e.g., last week, last month).'),
});
export type SummarizeLocationHistoryInput = z.infer<typeof SummarizeLocationHistoryInputSchema>;

const SummarizeLocationHistoryOutputSchema = z.object({
  summary: z.string().describe('A summary of the location history over the specified time period.'),
});
export type SummarizeLocationHistoryOutput = z.infer<typeof SummarizeLocationHistoryOutputSchema>;

export async function summarizeLocationHistory(input: SummarizeLocationHistoryInput): Promise<SummarizeLocationHistoryOutput> {
  return summarizeLocationHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLocationHistoryPrompt',
  input: {schema: SummarizeLocationHistoryInputSchema},
  output: {schema: SummarizeLocationHistoryOutputSchema},
  prompt: `You are an AI assistant that summarizes location history data for a user.

  The user wants a summary of the location history over the specified time period. Use the human-readable address when available.

  Time Period: {{{timePeriod}}}
  Location History:
  {{#each locationHistory}}
  - Location: {{#if address}}{{{address}}}{{else}}Lat: {{{latitude}}}, Lon: {{{longitude}}}{{/if}}, Timestamp: {{{timestamp}}}
  {{/each}}

  Please provide a concise summary of the location history, highlighting the most frequent locations and the overall movement patterns based on the addresses.
  `,
});

const summarizeLocationHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeLocationHistoryFlow',
    inputSchema: SummarizeLocationHistoryInputSchema,
    outputSchema: SummarizeLocationHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
