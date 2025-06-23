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
    prompt: `You are an expert social media writer crafting a **genuine LinkedIn post** for someone who just attended *Cloud Community Days 2025*, hosted by GDG Cloud Rajkot in India.

The person wants to share their experience, key learnings, and maybe give a shoutout to the workshop they attended — all while keeping the tone professional but personal.

Inputs:
- Event Details: {{{eventDetails}}}
- Attendee Experience: {{{experienceDetails}}}
- Workshop Attended: {{{workshop}}}
{{#if speaker}}
- Workshop Speaker: {{{speaker}}}
{{/if}}
- Desired Length: {{{postLength}}}

**Instructions:**

1. **Structure:**
    - Begin with a short, engaging hook — something personal like “Spent my Sunday immersed in learning at #CCD2025.”
    - Share what stood out about the overall event — topics, vibe, people.
    - Highlight the specific workshop attended. If a speaker is mentioned, include a sentence of appreciation or insight related to their session.
    - End with a casual note like: “Great meeting so many passionate folks” or “Looking forward to applying these learnings!”
2. **Formatting Tips:**
    - Use paragraphs and line breaks.
    - For longer posts, include bullet points to make key takeaways skimmable.
3. **Tone:**
    - Indian-English, semi-formal. Avoid over-polished or buzzword-heavy writing.
    - Avoid corporate phrases like “delighted to be a part of…” or “an honor to attend…”
    - Use real, humble, thoughtful language — like you’re talking to your peers.
4. **Hashtags:** Always include:
    - #CCD2025 #CCDRajkot #CloudCommunityDays #GDGIndia #GDGCloudRajkot
    - Optionally add 1–2 relevant ones (e.g., #AI, #Networking, #Flutter)

5. **Output:** Only the post body text — do not add commentary or intro. Make it look like something a tech-savvy student or early-career engineer from India might post after attending an event.

Keep it crisp, natural, and insightful.
`,
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
