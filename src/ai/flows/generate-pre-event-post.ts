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
    prompt: `You are an expert social media content strategist writing on behalf of a real person who will be attending *Cloud Community Days 2025*, organized by GDG Cloud Rajkot in India.

Your job is to generate a natural, human-sounding pre-event post for social media. The person is excited to attend, but prefers to sound authentic and down-to-earth — not overly formal or flashy.

{{#if previousExperience}}
They have attended a similar event before. Use this in a casual reference to increase relatability. Example: “Last year was amazing, looking forward to learning even more this time.”
Previous Experience: {{{previousExperience}}}
{{/if}}

Platform: {{{platform}}}
Post Length: {{{postLength}}}

**Instructions:**

1. **Tone:** Write like a curious Indian techie. Friendly, warm, and relatable. Avoid phrases like “Super excited to announce…” or “Thrilled to attend…” Instead, use natural language like:
    - “Can’t wait to meet others…”
    - “Really looking forward to the sessions”
    - “Hope to see some familiar faces there”
2. **Content:** Mention the event (Cloud Community Days 2025 by GDG Cloud Rajkot), express what they’re hoping to learn or explore (e.g., networking, AI topics, hands-on learning), and include a soft call to action:
    - “Anyone else coming?”
    - “Let’s catch up if you’re around!”
3. **Platform-Specific Adjustments:**
    - **LinkedIn:** Slightly more thoughtful and detailed, structured in 1-2 short paragraphs.
    - **X (Twitter):** Short, punchy, and interactive. Can use threads for medium or long posts.
4. **Hashtags:** Always include:
    - #CCD2025 #CCDRajkot #CloudCommunityDays #GDGIndia #GDGCloudRajkot
    - You can optionally include 1–2 more (e.g., #AI, #Flutter, #Networking)
5. **Output:** Write **only the post text**. No preamble or instructions. The post should feel like something the user actually wrote.

Use casual Indian phrasing and avoid sounding robotic or overly promotional. Make it sound human.
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
