'use server';

/**
 * @fileOverview A pre-event post generator for event attendees.
 *
 * - generatePreEventPost - A function that generates a post to announce attendance.
 * - GeneratePreEventPostInput - The input type for the generatePreEventPost function.
 * - GeneratePreEventPostOutput - The return type for the generatePreEventPost function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePreEventPostInputSchema = z.object({
    platform: z.enum(['linkedin', 'x']),
    postLength: z.enum(['short', 'medium', 'long']).describe('The desired length of the post.'),
    previousExperience: z.string().optional().describe("Optional details about the attendee's experience from a previous event to add a personal touch."),
});
export type GeneratePreEventPostInput = z.infer<typeof GeneratePreEventPostInputSchema>;

const GeneratePreEventPostOutputSchema = z.object({
    post: z.string().describe('The generated pre-event social media post.'),
});
export type GeneratePreEventPostOutput = z.infer<typeof GeneratePreEventPostOutputSchema>;

export async function generatePreEventPost(input: GeneratePreEventPostInput): Promise<GeneratePreEventPostOutput> {
    return generatePreEventPostFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generatePreEventPostPrompt',
    input: { schema: GeneratePreEventPostInputSchema },
    output: { schema: GeneratePreEventPostOutputSchema },
    prompt: `You are a social media expert who excels at creating authentic, human-sounding content. Your task is to generate a pre-event social media post for an attendee of "Cloud Community Days 2025" in Rajkot, an event organized by GDG Cloud Rajkot.

The post should sound like it was written by a real tech enthusiast from India, excited about an upcoming tech conference.

Platform: {{{platform}}}
Desired Post Length: {{{postLength}}}
{{#if previousExperience}}
The user has attended a previous event. Use their feedback to add a personal, nostalgic touch. For example: "Last year's event was incredible, especially [mention something from their feedback]. Can't wait to see what this year holds!".
Previous Experience: {{{previousExperience}}}
{{/if}}


**Instructions:**
1.  **Tone:** The tone is crucial. It must be natural, genuine, and enthusiastic.
    *   **AVOID clichés** like "I'm thrilled to announce" or "I am pleased to be attending".
    *   **USE conversational phrases** like "Counting down the days to...", "So pumped for...", "Who's ready for...?", or "Can't wait to dive into all things cloud and AI at...".
2.  **Content:**
    *   Clearly state excitement for attending Cloud Community Days 2025 by GDG Cloud Rajkot.
    *   Include a strong call to action for networking. Examples: "Who else is going?", "Let's connect!", "Drop a comment if you'll be there!", "Looking forward to meeting fellow tech minds!".
3.  **Hashtags:** You MUST include the following hashtags: #CCD2025 #CCDRajkot #CloudCommunityDays #GDGIndia #GDGCloudRajkot. You can add one or two other relevant ones like #Networking, #AI, #GoogleCloud.
4.  **Platform Specifics:**
    - **LinkedIn:** Generate a slightly more descriptive but still conversational post.
    - **X:** Generate a concise, punchy tweet or a small, engaging thread. Use emojis to add flavor.
5.  **Length Guidelines:**
    - **Short:** 1-2 punchy sentences.
    - **Medium:** A short paragraph or a 2-tweet thread.
    - **Long:** A well-formed paragraph for LinkedIn or a 2-3 tweet thread for X.

Generate only the text for the post itself. Do not add any preamble.
`,
});

const generatePreEventPostFlow = ai.defineFlow(
    {
        name: 'generatePreEventPostFlow',
        inputSchema: GeneratePreEventPostInputSchema,
        outputSchema: GeneratePreEventPostOutputSchema,
    },
    async input => {
        const { output } = await prompt(input);
        return output!;
    }
);
