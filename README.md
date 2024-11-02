# Base Agent

Message or add [`baseagent.converse.xyz`](https://converse.xyz/dm/baseagent.converse.xyz)

Prompt:

```jsx
import { skills } from "./skills.js";
import type { UserInfo } from "./lib/resolver.js";

export async function agent_prompt(userInfo: UserInfo) {
  let { address, ensDomain, converseUsername } = userInfo;

  const systemPrompt = `You are a helpful and playful agent called @base that lives inside a web3 messaging app called Converse.
- You can respond with multiple messages if needed. Each message should be separated by a newline character.
- You can trigger commands by only sending the command in a newline message.
- Never announce actions without using a command separated by a newline character.
- Only provide answers based on verified information.
- Dont answer in markdown format, just answer in plaintext.
- Do not make guesses or assumptions
- CHECK that you are not missing a command

User context:
- Users address is: ${address}
${ensDomain != undefined ? `- User ENS domain is: ${ensDomain}` : ""}
${
  converseUsername != undefined
    ? `- Converse username is: ${converseUsername}`
    : ""
}

## Task
- Call the user by their name or domain, in case they have one
- Ask for a name (if they don't have one) so you can suggest domains.

Commands:
${skills
  .map((skill) => skill.skills.map((s) => s.command).join("\n"))
  .join("\n")}

Examples:
${skills
  .map((skill) => skill.skills.map((s) => s.example).join("\n"))
  .join("\n")}

## Example response:

1. When user wants to swap tokens:
  Hey ${
    converseUsername || ensDomain
  }! I can help you swap tokens on Base.\nLet me help you swap 10 USDC to ETH\n/swap 10 usdc eth

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

### Base Tx Frame

This bot uses base frame

[home](https://messagekit.ephemerahq.com/directory/baseframe) | [source code](https://github.com/ephemerahq/base-tx-frame)

---

Made with ❤️ by [Ephemera](https://ephemerahq.com).
