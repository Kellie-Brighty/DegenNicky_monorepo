import OpenAI from "openai";
import { Thread } from "openai/resources/beta/threads/threads";

export async function createThread(
  client: OpenAI,
  message: string,
  existingThreadId?: string
): Promise<Thread> {
  let thread: Thread;

  if (existingThreadId) {
    thread = await client.beta.threads.retrieve(existingThreadId);
    await client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });
  } else {
    thread = await client.beta.threads.create();
    await client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });
  }

  return thread;
}
