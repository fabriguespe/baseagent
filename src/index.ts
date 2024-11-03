import { run, HandlerContext } from "@xmtp/message-kit";
import { agentResponse } from "./lib/openai.js";
import { getUserInfo } from "./lib/resolver.js";
import { agent_prompt } from "./prompt.js";
run(
  async (context: HandlerContext) => {
    /*All the commands are handled through the commands file*/
    /* If its just text, it will be handled by the ensAgent*/
    /* If its a group message, it will be handled by the groupAgent*/
    if (!process?.env?.OPEN_AI_API_KEY) {
      console.log("No OPEN_AI_API_KEY found in .env");
      return;
    }

    const {
      message: {
        content: { content, params },
        sender,
      },
    } = context;

    try {
      let userPrompt = params?.prompt ?? content;
      const userInfo = await getUserInfo(sender.address);
      if (!userInfo) {
        console.log("User info not found");
        return;
      }
      let prompt = await agent_prompt(userInfo);

      await agentResponse(sender, userPrompt, prompt, context);
    } catch (error) {
      console.error("Error during OpenAI call:", error);
      await context.reply("An error occurred while processing your request.");
    }
  },
  {
    client: {
      logging: process.env.NODE_ENV === "production" ? "debug" : "off",
    },
  }
);
