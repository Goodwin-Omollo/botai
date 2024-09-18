import { CoreMessage, generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const { responseMessages } = await generateText({
    model: openai("gpt-4o-mini"),
    system: "You are a politician. give the answer like a politician would",
    messages: messages,
  });

  return Response.json({ messages: responseMessages });
}
