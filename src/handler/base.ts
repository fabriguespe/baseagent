import { HandlerContext } from "@xmtp/message-kit";
import { getUserInfo } from "@xmtp/message-kit";
import { clearMemory } from "@xmtp/message-kit";
import {
  Network,
  LearnWeb3Client,
  BASE_TX_FRAME_URL,
} from "../lib/learnweb3.js";
import { getRedisClient } from "../lib/redis.js";

export const ensUrl = "https://app.ens.domains/";

export async function handler(context: HandlerContext) {
  const {
    message: {
      content: { command, params },
      sender,
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
  } else if (command == "url_mint") {
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
  } else if (command == "drip") {
    const { network } = params;
    if (!network) {
      await context.send("Invalid network. Please select a valid option.");
      return;
    }
    context.send("Fetching testnet tokens...");
    const redisClient = await getRedisClient();

    const learnWeb3Client = new LearnWeb3Client();
    // Fetch supported networks from Redis cache or API
    let supportedNetworks: Network[];
    const cachedSupportedNetworksData = await redisClient.get(
      "supported-networks"
    );
    supportedNetworks = JSON.parse(
      cachedSupportedNetworksData!
    ).supportedNetworks;
    await context.send(
      "Your testnet tokens are being processed. Please wait a moment for the transaction to process."
    );
    const selectedNetwork = supportedNetworks.find(
      (n) => n.networkId.toLowerCase() === network.toLowerCase()
    );
    if (!selectedNetwork) {
      await context.send(
        "The network currently does not have funds provided by web3 api's\nTry again later..."
      );
      return;
    }
    const result = await learnWeb3Client.dripTokens(
      selectedNetwork!.networkId,
      sender.address
    );

    if (!result.ok) {
      await context.send(
        `❌ Sorry, there was an error processing your request:\n\n"${result.error!}"`
      );
      return;
    }

    await context.send("Here's your transaction receipt:");
    await context.send(
      `${BASE_TX_FRAME_URL}?txLink=${result.value}&networkLogo=${
        selectedNetwork?.networkLogo
      }&networkName=${selectedNetwork?.networkName.replaceAll(
        " ",
        "-"
      )}&tokenName=${selectedNetwork?.tokenName}&amount=${
        selectedNetwork?.dripAmount
      }`
    );
    // Clear any in-memory cache or state related to the prompt
    clearMemory();
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

export async function urlMint(context: HandlerContext) {}
