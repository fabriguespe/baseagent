import { XMTPContext, getUserInfo } from "@xmtp/message-kit";
import type { skillAction } from "@xmtp/message-kit";
import { txpayUrl } from "../index.js";

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

  let receiverInfo = await getUserInfo(username);
  console.log(receiverInfo);
  if (!amountSend || !tokenSend || !receiverInfo) {
    context.reply(
      "Missing required parameters. Please provide amount, token, and username."
    );
    return;
  }
  let sendUrl = `${txpayUrl}/?amount=${amountSend}&token=${tokenSend}&receiver=${receiverInfo.address}`;
  return {
    code: 200,
    message: sendUrl,
  };
}
