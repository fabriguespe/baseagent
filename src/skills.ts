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
        example: "/swap 10 usdc eth",
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
        command: "/send [amount] [token] [username]",
        example: "/send 1 eth vitalik.eth",
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
        handler: handler,
        params: {},
        description: "Show the base url",
      },
    ],
  },
];
