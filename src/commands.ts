import type { CommandGroup } from "@xmtp/message-kit";
import { swapHandler } from "./handler/swap.js";
import { sendCommand } from "./handler/send.js";

export const commands: CommandGroup[] = [
  {
    name: "Swap Bot",
    description: "Swap bot for base.",
    commands: [
      {
        command: "/swap [amount] [token_from] [token_to]",
        triggers: ["/swap", "@swap"],
        handler: swapHandler,
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
        command: "/send [amount] [token] [address]",
        triggers: ["/send", "@send"],
        handler: sendCommand,
        description:
          "Send a specific amount of a token to a specified address.",
        params: {
          amount: {
            default: 10,
            type: "number",
          },
          token: {
            default: "eth",
            type: "string",
            values: ["eth", "dai", "usdc", "degen"], // Accepted tokens
          },
          address: {
            default: "",
            type: "address",
          },
        },
      },
    ],
  },
];
