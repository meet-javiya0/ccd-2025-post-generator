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
    prompt: `You are a creative writer who excels at crafting authentic and engaging LinkedIn posts. Your goal is to write from the perspective of a tech enthusiast attending Cloud Community Days 2025, organized by GDG Cloud Rajkot. The post must sound human, personal, and professional.

Event Details: {{{eventDetails}}}
Attendee's Experience Summary: {{{experienceDetails}}}
Workshop Attended: {{{workshop}}}
{{#if speaker}}
Speaker at the workshop: {{{speaker}}}
{{/if}}
Desired Post Length: {{{postLength}}}

**Instructions:**
1.  **Tone & Style:** Write in the first person ("I", "my"). Tell a story. Be enthusiastic but professional. Avoid corporate jargon or overly formal phrases. The post should feel like a genuine reflection of a great day of learning and networking.
2.  **Structure:**
    *   **Hook:** Start with an engaging sentence that grabs attention.
    *   **Body:** Talk about the overall event vibe – the energy, the people, the keynotes. Then, dive into the specific workshop.
    *   **Workshop Details:** Mention the workshop '{{{workshop}}}' and if the speaker '{{{speaker}}}' is provided, credit them for their insights (e.g., "The hands-on workshop on '{{{workshop}}}' by {{{speaker}}} was a highlight for me. I particularly learned...").
    *   **Key Takeaways:** Use bullet points (e.g., using '💡', '🚀', or '-') for key learnings or favorite moments to make the post scannable and engaging. This is especially important for 'medium' and 'long' posts.
    *   **Call to Action:** End with a forward-looking statement or a question to encourage comments (e.g., "What was your favorite part of the event?").
3.  **Hashtags:** ALWAYS include this set of hashtags: #CCD2025 #CCDRajkot #CloudCommunityDays #GDGIndia #GDGCloudRajkot. Feel free to add 1-2 more highly relevant tags based on the workshop topic (e.g., #RAG, #AgenticAI, #AI).
4.  **Length Guidelines:**
    - **Short:** A concise, impactful post of 1-2 paragraphs.
    - **Medium:** A more detailed post of 3-4 paragraphs with bullet points for key takeaways.
    - **Long:** A comprehensive reflection with multiple well-developed paragraphs, detailed insights, bullet points, and a thoughtful conclusion.

Generate only the text for the post itself. Do not add any preamble like "Here is the post:".
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
