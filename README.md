# Base Agent

Message or add [`baseagent.converse.xyz`](https://converse.xyz/dm/baseagent.converse.xyz)

Prompt:

```jsx
import { skills } from "./skills.js";
import { UserInfo, PROMPT_USER_CONTENT } from "@xmtp/message-kit";
import { PROMPT_RULES, PROMPT_SKILLS_AND_EXAMPLES } from "./lib/openai.js";

export async function agent_prompt(userInfo: UserInfo) {
  let { address, ensDomain, converseUsername, preferredName } = userInfo;

  //Update the name of the agent with predefined prompt
  let systemPrompt = PROMPT_RULES.replace("{NAME}", "@base");

  //Add user context to the prompt
  systemPrompt += PROMPT_USER_CONTENT(address, ensDomain, converseUsername);

  //Add skills and examples to the prompt
  systemPrompt += PROMPT_SKILLS_AND_EXAMPLES(skills);

  systemPrompt += `
## Task


## Example response:

1. When user wants to swap tokens:
  Hey ${preferredName}! I can help you swap tokens on Base.\nLet me help you swap 10 USDC to ETH\n/swap 10 usdc eth

2. When user wants to swap a specific amount:
  Sure! I'll help you swap 5 DEGEN to DAI\n/swap 5 degen dai

3. When user wants to send tokens:
  I'll help you send 1 USDC to 0x123...\n/send 1 usdc 0x123456789...

4. When user wants to send a specific token:
  I'll help you send 1 USDC to 0x123...\n/send 1 usdc 0x123456789...

5. When user asks about supported tokens:
   can help you swap or send these tokens on Base:\n- ETH\n- USDC\n- DAI\n- DEGEN\nJust let me know the amount and which tokens you'd like to swap or send!

6. When user wants to tip an ens domain default to 1 usdc:
  Let's go ahead and tip 1 USDC to nick.eth\n/send 1 usdc 0x123456789...

7. If the users wants to know more:
  I can assist you with swapping, minting and sending tokens on Base. Just let me know what you need help with!.\nThis is the base url of the Frame yo ucan also navigate to it by clicking\n/show
`;
  return systemPrompt;
}
```

## Skills

```jsx
import type { SkillGroup } from "@xmtp/message-kit";
import { handler } from "./handler/base.js";

export const skills: SkillGroup[] = [
  {
    name: "Swap Bot",
    tag: "@base",
    description: "Swap bot for base.",
    skills: [
      {
        command: "/swap [amount] [token_from] [token_to]",
        triggers: ["/swap"],
        example: "/swap 10 usdc eth",
        handler: handler,
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
      {
        command: "/send [amount] [token] [username]",
        example: "/send 1 eth vitalik.eth",
        triggers: ["/send"],
        handler: handler,
        description:
          "Send a specific amount of a token to a specified address.",
        params: {
          amount: {
            default: 1,
            type: "number",
          },
          token: {
            default: "eth",
            type: "string",
            values: ["eth", "dai", "usdc", "degen"], // Accepted tokens
          },
          username: {
            default: "",
            type: "string",
          },
        },
      },
      {
        command: "/show",
        triggers: ["/show"],
        handler: handler,
        params: {},
        description: "Show the base url",
      },
    ],
  },
];
```

### Frames Used

This bot uses base frame

[Base Tx Frame](https://messagekit.ephemerahq.com/directory/basetxframe)
[Base Receipt Frame](https://messagekit.ephemerahq.com/directory/txreceipt)

---

Made with ❤️ by [Ephemera](https://ephemerahq.com).
