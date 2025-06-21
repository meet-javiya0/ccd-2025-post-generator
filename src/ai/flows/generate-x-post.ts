'use server';

/**
 * @fileOverview Generates a personalized X post based on event experience details.
 *
 * - generateXPost - A function that handles the generation of the X post.
 * - GenerateXPostInput - The input type for the generateXPost function.
 * - GenerateXPostOutput - The return type for the generateXPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateXPostInputSchema = z.object({
  eventDetails: z.string().describe('Details about the Cloud Community Days 2025 event.'),
  experienceDetails: z.string().describe('Attendee experience at the event.'),
  eventSummary: z.string().describe('Summary of the Cloud Community Days 2025 event.'),
  postLength: z.enum(['short', 'medium', 'long']).describe('The desired length of the post.'),
  workshop: z.string().describe('The workshop the attendee participated in.'),
});
export type GenerateXPostInput = z.infer<typeof GenerateXPostInputSchema>;

const GenerateXPostOutputSchema = z.object({
  xPost: z.string().describe('Personalized X post tailored to the platform.'),
});
export type GenerateXPostOutput = z.infer<typeof GenerateXPostOutputSchema>;

export async function generateXPost(input: GenerateXPostInput): Promise<GenerateXPostOutput> {
  return generateXPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateXPostPrompt',
  input: {schema: GenerateXPostInputSchema},
  output: {schema: GenerateXPostOutputSchema},
  prompt: `You are an expert social media manager specializing in generating engaging X posts.

  Based on the attendee's experience and the event details, generate a personalized X post that is tailored to the platform's tone and constraints. The post should be concise, engaging, and encourage interaction.

  Event Details: {{{eventDetails}}}
  Attendee Experience: {{{experienceDetails}}}
  Workshop Attended: {{{workshop}}}
  Event Summary: {{{eventSummary}}}
  Desired Post Length: {{{postLength}}}
  
  The length of the post should be '{{postLength}}'. A short post is a single tweet, a medium is a small thread (2-3 tweets), and a long is a thread (3-5 tweets).
  If the attendee mentioned a workshop, incorporate that into the post.
  `,
});

const generateXPostFlow = ai.defineFlow(
  {
    name: 'generateXPostFlow',
    inputSchema: GenerateXPostInputSchema,
    outputSchema: GenerateXPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
