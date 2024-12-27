import OpenAI from "openai";
import { createAssistant } from "./openai_folder/createAssistant";
import { createThread } from "./openai_folder/createThread";
import { createRun } from "./openai_folder/createRun";
import { performRun } from "./openai_folder/performRun";
import "dotenv/config";
import readline from "readline";

async function main() {
  const client = new OpenAI();
  const assistant = await createAssistant(client);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(
    "Welcome to chat with Nicky! Type 'exit' to end the conversation."
  );

  let threadId: string | undefined = undefined;

  while (true) {
    const message = await new Promise<string>((resolve) => {
      rl.question("You: ", resolve);
    });

    if (message.toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
      break;
    }

    try {
      const thread = await createThread(client, message, threadId);
      threadId = thread.id;

      const run = await createRun(client, thread, assistant.id);
      const result = await performRun(client, thread, run);

      if ("text" in result) {
        console.log(`Nicky: ${JSON.stringify(result.text.value)}`);
      } else {
        console.log("Nicky: [Non-text response]");
      }
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : error}`);
    }
  }
}

main();
