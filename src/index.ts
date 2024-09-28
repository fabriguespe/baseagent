import { run, HandlerContext } from "@xmtp/message-kit";
import { handler as agent } from "./handler/agent.js";
import { handleSwap } from "./handler/swap.js";
import { commands } from "./commands.js";

const commandHandlers = {
  "/swap": handleSwap,
};

const appConfig = { commands, commandHandlers };
run(async (context: HandlerContext) => {
  const {
    message: {
      typeId,
      content: { content: text, command, params },
    },
  } = context;
  if (typeId !== "text") return;
  console.log(text, params);
  if (text.includes("@swap")) {
    await agent(context);
  } else if (text.startsWith("/")) {
    await context.intent(text);
  } else if (
    text.startsWith("/swap") &&
    params.token_from &&
    params.token_to &&
    params.amount
  ) {
    await handleSwap(context);
  }
}, appConfig);
