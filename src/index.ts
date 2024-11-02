import { run, HandlerContext } from "@xmtp/message-kit";
import { baseTxAgent } from "./handler/transaction.js";

run(
  async (context: HandlerContext) => {
    baseTxAgent(context);
  },
  {
    client: {},
  }
);
