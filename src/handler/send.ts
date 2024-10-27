import { HandlerContext } from "@xmtp/message-kit";
import { textGeneration } from "../lib/openai.js";

export async function sendHandler(context: HandlerContext) {
  const {
    message: {
      content: { command, content, params },
    },
  } = context;
  const texttolower = content.toLowerCase();
  console.log("texttolower", texttolower);
  if (texttolower.includes("@send")) {
    await sendAgent(context);
  } else if (params.token && params.address && params.amount) {
    await sendCommand(context);
  }
}

export async function sendCommand(context: HandlerContext) {
  const {
    message: {
      content: { command, params },
    },
  } = context;

  const baseUrl = "https://base-frame-lyart.vercel.app/transaction";

  switch (command) {
    case "send":
      // Destructure and validate parameters for the swap command
      const { amount, token, address } = params;

      if (!amount || !token || !address) {
        context.reply(
          "Missing required parameters. Please provide amount, token, and address."
        );
        return;
      }
      // Generate URL for the swap transaction
      let url_send = generateFrameURL(baseUrl, "send", {
        amount,
        token,
        address,
      });
      context.send(`${url_send}`);
      break;
    default:
      // Handle unknown commands
      context.reply("Unknown command. Use help to see all available commands.");
  }
}

export async function sendAgent(context: HandlerContext) {
  if (!process?.env?.OPEN_AI_API_KEY) {
    console.log("No OPEN_AI_API_KEY found in .env");
    return;
  }

  const {
    message: {
      content: { content, params },
    },
  } = context;
  const systemPrompt = `You are a helpful and playful betting bot that lives inside a web3 messaging group.\n

  Users can start a send by tagging you in a prompt like "@send 1 eth to 0x0000000000000000000000000000000000000000"

  You then have an internal command to create a send: "/send [amount] [token] [address]"

  Format examples:

  /send 1 eth 0x0000000000000000000000000000000000000000
  /send 100 dai 0x0000000000000000000000000000000000000000
  /send 0.1 eth 0x0000000000000000000000000000000000000000`;
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

// Function to generate a URL with query parameters for transactions
function generateFrameURL(
  baseUrl: string,
  transaction_type: string,
  params: any
) {
  // Filter out undefined parameters
  let filteredParams: { [key: string]: any } = {};

  for (const key in params) {
    if (params[key] !== undefined) {
      filteredParams[key] = params[key];
    }
  }
  let queryParams = new URLSearchParams({
    transaction_type,
    ...filteredParams,
  }).toString();
  return `${baseUrl}?${queryParams}`;
}
