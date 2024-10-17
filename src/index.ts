import { run, HandlerContext } from "@xmtp/message-kit";
import { handler as agent } from "./handler/agent.js";
import { handleSwap } from "./handler/swap.js";

run(
  async (context: HandlerContext) => {
    const {
      message: {
        typeId,
        content: { content: text, command, params },
      },
    } = context;

    if (typeId !== "text") return;

    if (text.includes("@swap")) {
      await agent(context);
    } else if (
      text.startsWith("/swap") &&
      params.token_from &&
      params.token_to &&
      params.amount
    ) {
      await handleSwap(context);
    }
  },
  {
    logging: process.env.NODE_ENV === "production" ? "debug" : "off",
  }
);
