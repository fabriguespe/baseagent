import { registerSkill as swapSkill } from "./handlers/swap.js";
import { registerSkill as mintSkill } from "./handlers/mint.js";
import { registerSkill as dripSkill } from "./handlers/drip.js";
import { registerSkill as paySkill } from "./handlers/pay.js";
import { run, XMTPContext, agentReply, Agent } from "@xmtp/message-kit";
import { replaceVariables } from "@xmtp/message-kit";
import { systemPrompt } from "./prompt.js";

export const frameUrl = "https://ens.steer.fun/";
export const baseUrl = "https://base-tx-frame.vercel.app/transaction";
export const ensUrl = "https://app.ens.domains/";

export const agent: Agent = {
  name: "Swap Bot",
  tag: "@base",
  description: "Swap bot for base.",
  skills: [...swapSkill, ...mintSkill, ...dripSkill, ...paySkill],
};

run(
  async (context: XMTPContext) => {
    const {
      message: { sender },
      agent,
    } = context;

    let prompt = await replaceVariables(systemPrompt, sender.address, agent);
    await agentReply(context, prompt);
  },
  { agent }
);
