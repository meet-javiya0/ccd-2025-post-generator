'use server';

/**
 * @fileOverview Generates a personalized X post based on event experience details.
 *
 * - generateXPost - A function that handles the generation of the X post.
 * - GenerateXPostInput - The input type for the generateXPost function.
 * - GenerateXPostOutput - The return type for the generateXPost function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateXPostInputSchema = z.object({
    eventDetails: z.string().describe('Details about the Cloud Community Days 2025 event.'),
    experienceDetails: z.string().describe('Attendee experience at the event.'),
    postLength: z.enum(['short', 'medium', 'long']).describe('The desired length of the post.'),
    workshop: z.string().describe('The workshop the attendee participated in.'),
    speaker: z.string().optional().describe('The name of the speaker for the workshop or session attended.'),
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
    input: { schema: GenerateXPostInputSchema },
    output: { schema: GenerateXPostOutputSchema },
    prompt: `You are a witty and engaging social media expert who knows how to create viral content for X (formerly Twitter). Your task is to generate a personalized X post for an attendee of Cloud Community Days 2025, organized by GDG Cloud Rajkot. The post must be fun, energetic, and feel authentic.

Event Details: {{{eventDetails}}}
Attendee Experience: {{{experienceDetails}}}
Workshop Attended: {{{workshop}}}
{{#if speaker}}
Workshop Speaker: {{{speaker}}}
{{/if}}
Desired Post Length: {{{postLength}}}

**Instructions:**
1.  **Tone & Style:** Energetic, concise, and conversational. Use relevant emojis (like 🤯, 🚀, 🔥) to add personality and break up text. Ask questions to drive engagement. Write in the first person ("I", "My mind is blown...").
2.  **Content:**
    *   Reflect the attendee's overall experience (keynotes, networking, food!).
    *   Give a special shout-out to the workshop they attended. If the speaker is mentioned, tag them (or mention their name if a handle isn't available). E.g., "The workshop on '{{{workshop}}}' with {{{speaker}}} was insane! 🤯 So many great takeaways."
3.  **Length & Formatting:**
    - **Short:** A single, punchy tweet.
    - **Medium:** A small thread of 2 tweets. Make sure each tweet flows logically from the last.
    - **Long:** A thread of 3-4 tweets. Start with a strong hook, build on it, and end with a concluding thought or question.
4.  **Hashtags:** ALWAYS include this set of hashtags: #CCD2025 #CCDRajkot #CloudCommunityDays #GDGIndia #GDGCloudRajkot. Add 1-2 other relevant hashtags (e.g., #AI, #DevCommunity).
5.  **Human Touch:** Avoid sounding like a formal report. Keep it snappy, fun, and shareable.

Generate only the text for the post itself. Do not add any preamble.
`,
});

const generateXPostFlow = ai.defineFlow(
    {
        name: 'generateXPostFlow',
        inputSchema: GenerateXPostInputSchema,
        outputSchema: GenerateXPostOutputSchema,
    },
    async input => {
        const { output } = await prompt(input);
        return output!;
    }
);
