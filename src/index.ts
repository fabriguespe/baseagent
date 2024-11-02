import { run, HandlerContext } from "@xmtp/message-kit";
import { baseTxAgent } from "./handler/base.js";

run(async (context: HandlerContext) => {
  /*All the commands are handled through the commands file*/
  /* If its just text, it will be handled by the ensAgent*/
  /* If its a group message, it will be handled by the groupAgent*/

  baseTxAgent(context);
});
