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
    prompt: `You are writing a post-event social media thread or tweet on **X (formerly Twitter)** for someone who just attended *Cloud Community Days 2025*, organized by GDG Cloud Rajkot.

They want to share what they experienced, especially the specific workshop they attended, in a concise, engaging way.

Inputs:
- Event Info: {{{eventDetails}}}
- Experience Summary: {{{experienceDetails}}}
- Workshop Attended: {{{workshop}}}
{{#if speaker}}
- Workshop Speaker: {{{speaker}}}
{{/if}}
- Desired Length: {{{postLength}}}

**Instructions:**

1. **Voice & Style:**
    - Conversational, punchy, and real.
    - Use emojis sparingly if needed (optional).
    - Avoid hashtags-only or thread-only filler. Keep substance high.
    - Don’t use “blown away” or “so honored to attend” — use grounded phrases like:
        - “Here’s what I took away…”
        - “Loved the energy at…”
        - “This session made me rethink…”

2. **Platform Adaptation:**
    - **Short:** 1 tweet summary
    - **Medium:** 2–tweet mini-thread (1 event summary + 1 workshop highlight)
    - **Long:** 3–4 tweet thread (overall → workshop → takeaways → community)

3. **Speaker Shoutouts:** If a speaker is named, include them casually:
    - “Big thanks to {{{speaker}}} for making the workshop so hands-on!”

4. **Hashtags:** Use:
    - #CCD2025 #CCDRajkot #CloudCommunityDays #GDGIndia #GDGCloudRajkot
    - Optionally: #AI, #Flutter, #GoogleCloud

5. **Output:** Only tweet content — no title or explanation. If using a thread, number tweets like:
    - 1/ Here’s what went down at #CCD2025 👇
    - 2/ Attended the workshop on...

Keep it real, sharp, and interactive.
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
