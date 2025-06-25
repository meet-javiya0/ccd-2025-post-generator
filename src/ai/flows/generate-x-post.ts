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
    prompt: `You are a social media content expert helping an attendee of *Cloud Community Days 2025* (organized by GDG Cloud Rajkot) write a **single X (Twitter)** post that shares their day in a natural, human tone.

Inputs:
- Event Details: {{{eventDetails}}}
- Attendee Experience: {{{experienceDetails}}}
- Workshop Attended: {{{workshop}}}
- Post Length: {{{postLength}}}

Instructions:

1. Tone: Write like a casual, techie student from Rajkot sharing their day on Twitter. Keep it friendly, relatable, and grounded. Avoid formal or AI-like phrases such as:
   - “Super excited…”
   - “It was an honour to attend…”
   - “Thrilled to be part of…”

   Instead, use more natural phrasing like:
   - “Spent a Sunday soaking in sessions, learning and good chai ☕”
   - “Sessions were 🔥, food was 😋, company was 💯”

2. Structure (keep it in this order):
   - Start with their personal experience (\`experienceDetails\`)
   - Mention the three main sessions that everyone attended:
     - Dhaval K’s welcome intro
     - Rushabh Vasa’s talk on Google Cloud AI
     - Shreyan Mehta’s “MCP 101”
   - Mention the specific workshop they attended (\`workshop\`)
   - Thank the organizers and volunteers warmly
   - End with the hashtag block

3. Formatting:
   - Write as **one complete message** (even if it’s long)
   - DO NOT split into numbered tweets or threads
   - Use emojis only where they feel natural
   - Line breaks are okay if it improves readability

4. Hashtags:
   - Always include: \`#CCD2025 #CCDRajkot #CloudCommunityDays #GDGIndia #GDGCloudRajkot\`
   - Optionally include 1–2 topic-specific hashtags

5. Output Only the Post: Do not include instructions, context, or extra text.

Let it feel like a fun, honest, real tweet by a young dev from Gujarat.
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
