import { HandlerContext, User } from "@xmtp/message-kit";
import { textGeneration } from "../lib/openai.js";

export async function handler(context: HandlerContext) {
  if (!process?.env?.OPEN_AI_API_KEY) {
    console.log("No OPEN_AI_API_KEY found in .env");
    return;
  }

  const {
    message: {
      content: { content, params },
    },
  } = context;

  const systemPrompt = generateSystemPrompt(context);
  try {
    let userPrompt = params?.prompt ?? content;

    if (process?.env?.MSG_LOG === "true") {
      console.log("userPrompt", userPrompt);
    }

    const { reply } = await textGeneration(userPrompt, systemPrompt);
    console.log("intent:", reply);
    context.intent(reply);
  } catch (error) {
    console.error("Error during OpenAI call:", error);
    await context.reply("An error occurred while processing your request.");
  }
}

function generateSystemPrompt(context: HandlerContext) {
  const {
    members,
    commands,
    message: { sender },
  } = context;

  const systemPrompt = `You are a helpful and playful betting bot that lives inside a web3 messaging group.\n

    Users can start a swap by tagging you in a prompt like "@swap 1 eth to usdc"

    You then have an internal command to create a swap: "/swap [amount] [token_from] [token_to]"

    Format examples:

    /swap 1 eth usdc
    /swap 100 dai usdc
    /swap 0.1 eth usdt
  .`;

  return systemPrompt;
}
