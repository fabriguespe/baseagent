import { run, HandlerContext } from "@xmtp/message-kit";
import { handler as agent } from "./handler/agent.js";
import { handleSwap } from "./handler/swap.js";
import fs from "fs";
import path from "path";

const cacheDir = path.join(process.cwd(), ".cache");

try {
  const files = fs.readdirSync(cacheDir);
  console.log("Files in .cache directory:");
  files.forEach((file) => {
    console.log(file);
  });
} catch (error: any) {
  //2
  console.error("Error reading .cache directory:", error.message);
}
run(async (context: HandlerContext) => {
  const {
    message: {
      typeId,
      content: { content: text, command, params },
    },
  } = context;

  if (typeId !== "text") return;

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
});
