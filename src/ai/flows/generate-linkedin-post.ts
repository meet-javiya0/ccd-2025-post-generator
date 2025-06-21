'use server';

/**
 * @fileOverview A LinkedIn post generator for event attendees.
 *
 * - generateLinkedInPost - A function that generates a LinkedIn post based on event experience details.
 * - GenerateLinkedInPostInput - The input type for the generateLinkedInPost function.
 * - GenerateLinkedInPostOutput - The return type for the generateLinkedInPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLinkedInPostInputSchema = z.object({
  eventDetails: z.string().describe('Details about the event, including name and date.'),
  experienceDetails: z.string().describe("Details about the attendee's experience at the event."),
  postLength: z.enum(['short', 'medium', 'long']).describe('The desired length of the post.'),
  workshop: z.string().describe('The workshop the attendee participated in.'),
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
  input: {schema: GenerateLinkedInPostInputSchema},
  output: {schema: GenerateLinkedInPostOutputSchema},
  prompt: `You are an expert social media manager specializing in crafting engaging LinkedIn posts for event attendees.

Based on the attendee's experience and the event details, generate a personalized LinkedIn post that sounds human and professional. The post must be well-formatted for readability on LinkedIn.

Event Details: {{{eventDetails}}}
Attendee Experience: {{{experienceDetails}}}
Workshop Attended: {{{workshop}}}
Desired Post Length: {{{postLength}}}

**Instructions:**
1.  **Structure:** Start with a strong hook to grab attention. The body of the post should elaborate on the experience, mentioning the workshop. Conclude with a key takeaway or a question to encourage engagement.
2.  **Formatting:** Use paragraphs and line breaks to make the post easy to read. For 'medium' and 'long' posts, use bullet points (e.g., using '-' or '•') to highlight key learnings or favorite moments.
3.  **Tone:** Maintain a professional, yet enthusiastic tone.
4.  **Hashtags:** Include relevant hashtags like #CloudCommunityDays #GDGRajkot #GoogleCloud #AI and a hashtag for the workshop topic.
5.  **Length Guidelines:**
    - **Short:** A concise post of 1-2 short paragraphs.
    - **Medium:** A more detailed post of 3-4 paragraphs. Use bullet points for key takeaways if it makes sense.
    - **Long:** A comprehensive post with multiple well-developed paragraphs, detailed insights, bullet points for lists, and a thoughtful conclusion.

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
    const {output} = await prompt(input);
    return output!;
  }
);
