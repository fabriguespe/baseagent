import { HandlerContext } from "@xmtp/message-kit";
import { getUserInfo, isOnXMTP } from "../lib/resolver.js";
import { agent_prompt } from "../prompt.js";
import { processResponseWithSkill, textGeneration } from "../lib/openai.js";

export const ensUrl = "https://app.ens.domains/";
// Main handler function for processing commands
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
    if (!amountSend || !tokenSend || !senderInfo) {
      context.reply(
        "Missing required parameters. Please provide amount, token, and username."
      );
      return;
    }
    let sendUrl = `${baseUrl}/?transaction_type=send&amount=${amountSend}&token=${tokenSend}&receiver=${senderInfo.address}`;
    context.send(`${sendUrl}`);
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
    context.send(`${swapUrl}`);
  } else if (command == "info") {
    const { domain } = params;

    const data = await getUserInfo(domain);
    if (!data) {
      return {
        code: 404,
        message: "Domain not found.",
      };
    }

    const formattedData = {
      Address: data?.address,
      "Avatar URL": data?.ensInfo?.avatar,
      Description: data?.ensInfo?.description,
      ENS: data?.ensDomain,
      "Primary ENS": data?.ensInfo?.ens_primary,
      GitHub: data?.ensInfo?.github,
      Resolver: data?.ensInfo?.resolverAddress,
      Twitter: data?.ensInfo?.twitter,
      URL: `${ensUrl}${domain}`,
    };

    let message = "Domain information:\n\n";
    for (const [key, value] of Object.entries(formattedData)) {
      if (value) {
        message += `${key}: ${value}\n`;
      }
    }
    message = message.trim();
    if (
      await isOnXMTP(
        context.v2client,
        data?.ensInfo?.ens,
        data?.ensInfo?.address
      )
    ) {
      await context.send(
        `Ah, this domains is in XMTP, you can message it directly: https://converse.xyz/dm/${domain}`
      );
    }
    return { code: 200, message };
  } else if (command == "show") {
    context.reply(`${baseUrl.replace("/transaction", "")}`);
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
