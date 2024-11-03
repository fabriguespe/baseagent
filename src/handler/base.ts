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
  }
  if (command == "mint") {
    // Destructure and validate parameters for the send command
    const { collection, token_id } = params; // [!code hl] // [!code focus]
    console.log(collection, token_id);
    if (!collection || !token_id) {
      context.reply(
        "Missing required parameters. Please provide collection and token_id."
      );
      return;
    }
    let mintUrl = `${baseUrl}/?transaction_type=mint&collection=${collection}&token_id=${token_id}`;
    return {
      code: 200,
      message: mintUrl,
    };
  } else if (command == "drip") {
    return {
      code: 200,
      message: "drip",
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

export async function urlMint(context: HandlerContext) {
  const MINT_URL = "https://xmtp-mintiaml.vercel.app";
  const { url } = context.message.content.params;

  const urlPatterns = [
    {
      pattern: /https?:\/\/zora\.co\/collect\/([^:]+):([^/]+)\/(\d+)/,
      transform: (chain: string, address: string, tokenId: string) =>
        `${MINT_URL}/${chain}/${address}/${tokenId}`,
    },
    {
      pattern:
        /https?:\/\/wallet\.coinbase\.com\/nft\/mint\/eip155:(\d+):erc721:([^:]+)/,
      transform: (chain: string, address: string) =>
        `${MINT_URL}/eip155/${chain}/erc721/${address}`,
    },
    {
      pattern:
        /https?:\/\/wallet\.coinbase\.com\/nft\/mint\/eip155:(\d+):erc1155:([^:]+):(\d+)/,
      transform: (chain: string, address: string, tokenId: string) =>
        `${MINT_URL}/eip155/${chain}/erc1155/${address}/${tokenId}`,
    },
  ];
  //https://wallet.coinbase.com/nft/mint/eip155:8453:erc1155:0x9a83e7b27b8a9b68e8dc665a0049f2f004287a20:1
  //https://wallet.coinbase.com/nft/mint/eip155:8453:erc721:0x2a8e46E78BA9667c661326820801695dcf1c403E
  //https://zora.co/collect/base:0xa902601ece8b81d906b7deceb67f5badcbdff7df/1

  //https://xmtp-mintiaml.vercel.app/eip155/8453/erc721/0xf16755b43eE1a458161f0faE5a9124729f4f6B1B
  let parsedUrl = null;
  for (const { pattern, transform } of urlPatterns) {
    const match = url.match(pattern);

    if (match) {
      parsedUrl = transform(match[1], match[2], match[3]);
      break;
    }
  }
  if (parsedUrl) {
    await context.send("Here is your Mint Frame URL: ");
    await context.send(parsedUrl);
    return;
  } else {
    await context.send(
      "Error: Unable to parse the provided URL. Please ensure you're sending a valid Zora or Coinbase Wallet URL."
    );
    return;
  }
}
