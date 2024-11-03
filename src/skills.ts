import type { SkillGroup } from "@xmtp/message-kit";
import { handler } from "./handler/base.js";

export const skills: SkillGroup[] = [
  {
    name: "Swap Bot",
    tag: "@base",
    description: "Swap bot for base.",
    skills: [
      {
        command: "/swap [amount] [token_from] [token_to]",
        triggers: ["/swap"],
        examples: ["/swap 10 usdc eth", "/swap 1 dai usdc"],
        handler: handler,
        description: "Exchange one type of cryptocurrency for another.",
        params: {
          amount: {
            default: 10,
            type: "number",
          },
          token_from: {
            default: "usdc",
            type: "string",
            values: ["eth", "dai", "usdc", "degen"], // Accepted tokens
          },
          token_to: {
            default: "eth",
            type: "string",
            values: ["eth", "dai", "usdc", "degen"], // Accepted tokenss
          },
        },
      },
      {
        command: "/drip [network] [address]",
        triggers: ["/drip"],
        handler: handler,
        examples: [
          "/drip base_sepolia 0x123456789",
          "/drip base_goerli 0x123456789",
        ],
        description: "Drip testnet tokens to a specified address.",
        params: {
          network: {
            default: "base",
            type: "string",
            values: ["base_sepolia", "base_goerli"],
          },
          address: {
            default: "",
            type: "address",
          },
        },
      },
      // Zora mints
      {
        command: "/url_mint [url]",
        triggers: ["/url_mint"],
        handler: handler,
        examples: ["/url_mint https://zora.co/collect/base/0x123456789/1..."],
        description:
          "Return a Frame to mint From a Zora URL or Coinbase Wallet URL",
        params: {
          url: {
            type: "url",
          },
        },
      },
      {
        command: "/mint [collection] [token_id]",
        examples: ["/mint 0x73a333cb82862d4f66f0154229755b184fb4f5b0 1"],
        triggers: ["/mint"],
        handler: handler,
        description: "Mint a specific token from a collection.",
        params: {
          collection: {
            default: "0x73a333cb82862d4f66f0154229755b184fb4f5b0",
            type: "string",
          },
          token_id: {
            default: "1",
            type: "number",
          },
        },
      },
      {
        command: "/send [amount] [token] [username]",
        examples: ["/send 1 eth vitalik.eth", "/send 1 usdc 0x123456789..."],
        triggers: ["/send"],
        handler: handler,
        description:
          "Send a specific amount of a token to a specified address.",
        params: {
          amount: {
            default: 1,
            type: "number",
          },
          token: {
            default: "eth",
            type: "string",
            values: ["eth", "dai", "usdc", "degen"], // Accepted tokens
          },
          username: {
            default: "",
            type: "string",
          },
        },
      },
      {
        command: "/show",
        triggers: ["/show"],
        examples: ["/show"],
        handler: handler,
        params: {},
        description: "Show the base url",
      },
    ],
  },
];
