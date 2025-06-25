'use server';

/**
 * @fileOverview A LinkedIn post generator for event attendees.
 *
 * - generateLinkedInPost - A function that generates a LinkedIn post based on event experience details.
 * - GenerateLinkedInPostInput - The input type for the generateLinkedInPost function.
 * - GenerateLinkedInPostOutput - The return type for the generateLinkedInPost function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateLinkedInPostInputSchema = z.object({
    eventDetails: z.string().describe('Details about the event, including name and date.'),
    experienceDetails: z.string().describe("Details about the attendee's experience at the event."),
    postLength: z.enum(['short', 'medium', 'long']).describe('The desired length of the post.'),
    workshop: z.string().describe('The workshop the attendee participated in.'),
    speaker: z.string().optional().describe('The name of the speaker for the workshop or session attended.'),
});
export type GenerateLinkedInPostInput = z.infer<typeof GenerateLinkedInPostInputSchema>;

const GenerateLinkedInPostOutputSchema = z.object({
    post: z.string().describe('The generated LinkedIn post.'),
});
export type GenerateLinkedInPostOutput = z.infer<typeof GenerateLinkedInPostOutputSchema>;

export async function generateLinkedInPost(input: GenerateLinkedInPostInput): Promise<GenerateLinkedInPostOutput> {
    return generateLinkedInPostFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateLinkedInPostPrompt',
    input: { schema: GenerateLinkedInPostInputSchema },
    output: { schema: GenerateLinkedInPostOutputSchema },
    prompt: `You are a social media content expert helping an attendee of *Cloud Community Days 2025* (organized by GDG Cloud Rajkot) create a natural, human-sounding LinkedIn post about their experience.

Inputs:
- Event Details: {{{eventDetails}}}
- Attendee Experience: {{{experienceDetails}}}
- Workshop Attended: {{{workshop}}}
- Post Length: {{{postLength}}}

Instructions:

1. Tone: Write as if a student or early-career developer from Rajkot is sharing their personal experience on LinkedIn. The tone should feel grounded, reflective, and warm — avoid AI-like or corporate-sounding phrases like “thrilled to announce,” “honoured to attend,” or “super excited.” Use natural expressions like:
   - “Had a great time…”
   - “Good vibes all around…”
   - “Met so many amazing folks…”

2. Structure: Follow this exact flow:
   - Start with the attendee's experience (from \`experienceDetails\`)
   - Then mention the three main sessions (these are fixed for everyone):
     - “Loved the opening by Dhaval K — set the tone perfectly.”
     - “The Google Cloud AI session by Rushabh Vasa was packed with practical insights.”
     - “Also enjoyed the MCP 101 talk by Shreyan Mehta — really simplified complex ideas.”
   - Then transition into the **specific workshop** the attendee joined using the value from \`workshop\`
     - Example: “I joined the workshop on ‘{{{workshop}}}’ — tons of learning and hands-on perspective.”
   - Add a warm **thank-you message** to organizers and volunteers
     - Example: “Big shoutout to GDG Cloud Rajkot and all the volunteers who made the day smooth and fun!”
   - End with the hashtags block

3. Formatting:
   - For \`medium\` and \`long\` posts, use short paragraphs with line breaks
   - Use bullets for key takeaways if needed in \`long\` posts
   - Keep everything readable and real

4. Hashtags:
   - Always end with: \`#CCD2025 #CCDRajkot #CloudCommunityDays #GDGIndia #GDGCloudRajkot\`
   - You may include 1–2 more based on the workshop (e.g., \`#AI\`, \`#Startup\`, \`#Flutter\`)

5. Do not add any extra text or explanation before/after the post. Only return the body of the post.

Make sure the post feels like it was genuinely written by someone from the local community.`,
});

const generateLinkedInPostFlow = ai.defineFlow(
    {
        name: 'generateLinkedInPostFlow',
        inputSchema: GenerateLinkedInPostInputSchema,
        outputSchema: GenerateLinkedInPostOutputSchema,
    },
    async input => {
        const { output } = await prompt(input);
        return output!;
    }
);
