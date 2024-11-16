import type { SkillGroup } from "@xmtp/message-kit";
import { handler as baseHandler } from "./handler.js";

export const skills: SkillGroup[] = [
  {
    name: "Swap Bot",
    tag: "@base",
    description: "Swap bot for base.",
    skills: [
      {
        skill: "/swap [amount] [token_from] [token_to]",
        examples: ["/swap 10 usdc eth", "/swap 1 dai usdc"],
        handler: baseHandler,
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
        skill: "/drip [network] [address]",

        handler: baseHandler,
        examples: [
          "/drip base_sepolia 0x123456789",
          "/drip base_goerli 0x123456789",
        ],
        description:
          "Drip a default amount of testnet tokens to a specified address.",
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
      {
        skill: "/url_mint [url]",

        handler: baseHandler,
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
        skill: "/mint [collection] [token_id]",
        examples: ["/mint 0x73a333cb82862d4f66f0154229755b184fb4f5b0 1"],

        handler: baseHandler,
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
        skill: "/pay [amount] [token] [username]",

        examples: ["/pay 10 vitalik.eth"],
        description:
          "Send a specified amount of a cryptocurrency to a destination address.",
        handler: baseHandler,
        params: {
          amount: {
            default: 10,
            type: "number",
          },
          token: {
            default: "usdc",
            type: "string",
            values: ["eth", "dai", "usdc", "degen"], // Accepted tokens
          },
          username: {
            default: "",
            type: "username",
          },
        },
      },

      {
        skill: "/show",

        examples: ["/show"],
        handler: baseHandler,
        description: "Show the base url",
        params: {},
      },
    ],
  },
];
