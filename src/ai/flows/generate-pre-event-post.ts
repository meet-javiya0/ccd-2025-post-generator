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
    postLength: z.enum(['medium', 'long']).describe('The desired length of the post.'),
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
    prompt: `You are an expert social media content writer helping someone draft a **pre-event post** for attending *Cloud Community Days 2025*, organized by GDG Cloud Rajkot.

Inputs:
- Platform: {{{platform}}}
- Previous Experience: {{{previousExperience}}}
- Post Length: {{{postLength}}}

Instructions:

1. Tone: Write casually and naturally, as if a tech enthusiast from Rajkot or Gujarat is sharing their excitement about attending CCD 2025.
Avoid generic or corporate-sounding phrases like:
   - “Super excited to announce…”
   - “It’s an honour to be attending…”
   - “Thrilled to…”
Use grounded, warm phrasing like:
   - “Looking forward to meeting everyone…”
   - “Can’t wait for the sessions and chai breaks”
   - “CCD is always a vibe — let’s go again!”

2. Structure:
   - Begin with a natural statement about attending CCD 2025
   - If \`previousExperience\` is available, include a short line referencing it (e.g., “Attended last year and it was a blast.”)
   - Mention general excitement for learning, meeting people, or specific sessions/workshops (don’t name specific talks)
   - Add a casual CTA like “Who else is coming?” or “Catch you there?”
   - End with hashtags

3. Formatting:
   - For \`linkedin\`, use proper paragraphs and line breaks.
   - For \`x\`, keep it compact and conversational, but **do not create separate tweets or a thread** — it must be a single post.
   - For a 'medium' post, aim for 2-3 sentences.
   - For a 'long' post, create a slightly more detailed post of 4-5 sentences.
   - Adapt tone slightly to the platform (LinkedIn more descriptive, X more informal).

4. Hashtags:
   - Always include: \`#CCD2025 #CCDRajkot #CloudCommunityDays #GDGIndia #GDGCloudRajkot\`
   - Optionally add one or two extra hashtags like \`#Networking\`, \`#DevCommunity\`, or \`#RajkotEvents\`

5. Output Only the Post: Do not include preamble or explanations.

Make sure the final output feels like it was written by a young dev genuinely excited about joining a community-led event.
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
