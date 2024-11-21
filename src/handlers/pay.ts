import { XMTPContext, getUserInfo } from "@xmtp/message-kit";
import type { skillAction } from "@xmtp/message-kit";

export const registerSkill: skillAction[] = [
  {
    skill: "/pay [amount] [token] [username]",
    examples: ["/pay 10 vitalik.eth"],
    description:
      "Send a specified amount of a cryptocurrency to a destination address.",
    handler: handler,
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
];

export async function handler(context: XMTPContext) {
  const { params } = context.message.content;

  const { amount: amountSend, token: tokenSend, username } = params;

  await context.sendPayment(amountSend, tokenSend, username);
}