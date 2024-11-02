import { HandlerContext } from "@xmtp/message-kit";
import { getUserInfo, isOnXMTP } from "../lib/resolver.js";
import { agent_prompt } from "../prompt.js";
import { processResponseWithSkill, textGeneration } from "../lib/openai.js";

export const ensUrl = "https://app.ens.domains/";

export async function handler(context: HandlerContext) {
  const {
    message: {
      content: { command, params },
    },
  } = context;
  const baseUrl = "https://base-tx-frame.vercel.app/transaction";

  if (command == "send") {
    // Destructure and validate parameters for the send command
    const { amount: amountSend, token: tokenSend, username } = params; // [!code hl] // [!code focus]
    let senderInfo = await getUserInfo(username);
    console.log(username, senderInfo);
    if (!amountSend || !tokenSend || !senderInfo) {
      context.reply(
        "Missing required parameters. Please provide amount, token, and username."
      );
      return;
    }
    let sendUrl = `${baseUrl}/?transaction_type=send&amount=${amountSend}&token=${tokenSend}&receiver=${senderInfo.address}`;
    return {
      code: 200,
      message: sendUrl,
    };
  } else if (command == "swap") {
    // Destructure and validate parameters for the swap command
    const { amount, token_from, token_to } = params; // [!code hl] // [!code focus]

    if (!amount || !token_from || !token_to) {
      context.reply(
        "Missing required parameters. Please provide amount, token_from, and token_to."
      );
      return;
    }

    let swapUrl = `${baseUrl}/?transaction_type=swap&token_from=${token_from}&token_to=${token_to}&amount=${amount}`;
    return {
      code: 200,
      message: swapUrl,
    };
  } else if (command == "show") {
    return {
      code: 200,
      message: `${baseUrl.replace("/transaction", "")}`,
    };
  }
}

export async function baseTxAgent(context: HandlerContext) {
  if (!process?.env?.OPEN_AI_API_KEY) {
    console.log("No OPEN_AI_API_KEY found in .env");
    return;
  }

  const {
    message: {
      content: { content, params },
      sender,
    },
  } = context;

  try {
    let userPrompt = params?.prompt ?? content;
    const userInfo = await getUserInfo(sender.address);
    if (!userInfo) {
      console.log("User info not found");
      return;
    }
    const { reply } = await textGeneration(
      sender.address,
      userPrompt,
      await agent_prompt(userInfo)
    );
    await processResponseWithSkill(sender.address, reply, context);
  } catch (error) {
    console.error("Error during OpenAI call:", error);
    await context.reply("An error occurred while processing your request.");
  }
}
