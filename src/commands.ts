import type { CommandGroup } from "@xmtp/message-kit";
import { handleSwap } from "./handler/swap.js";
export const commands: CommandGroup[] = [
  {
    name: "Swap Bot",
    description: "Swap bot for base.",
    triggers: ["/swap", "@swap", "@swapbot"],
    commands: [
      {
        command: "/swap [amount] [token_from] [token_to]",
        handler: handleSwap,
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
    ],
  },
];
