import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from "ai";

// Set the runtime to edge for best performance
export const runtime = "edge";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const prompt = `Create a list of three open-ended and
engaging questions formatted as a single string. Each
question should be separated by '||'. These questions are
for an anonymous social messaging platform, like Qooh.me,
and should be suitable for a diverse audience. Avoid
personal or sensitive topics, focusing instead on
universal themes that encourage friendly interaction. For
example, your output should be structured like this:
'What's a hobby you've recently started?||If you could
have dinner with any historical figure, who would it be?||
What's a simple thing that makes you happy?'. Ensure the
questions are intriguing, foster curiosity, and
contribute to a positive and welcoming conversational
environment.`;

    const result = streamText({
      model: openrouter('openai/gpt-oss-120b:free'),
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("An unexpected error occurred", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}