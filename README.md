# Base Agent

Message or add [`baseagent.converse.xyz`](https://converse.xyz/dm/baseagent.converse.xyz)

## Fine tunning

```jsx
import { skills } from "./skills.js";
import { UserInfo, PROMPT_USER_CONTENT } from "@xmtp/message-kit";
import {
  PROMPT_REPLACE_VARIABLES,
  PROMPT_SKILLS_AND_EXAMPLES,
  PROMPT_RULES,
} from "@xmtp/message-kit";

export async function agent_prompt(userInfo: UserInfo) {
  //Add user context to the prompt
  let systemPrompt =
    PROMPT_RULES +
    PROMPT_USER_CONTENT(userInfo) +
    PROMPT_SKILLS_AND_EXAMPLES(skills, "@base");

  //Add additional
  systemPrompt += `
  
## Example response:

1. When user wants to swap tokens:
  Hey {PREFERRED_NAME! I can help you swap tokens on Base.\nLet me help you swap 10 USDC to ETH\n/swap 10 usdc eth

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

7. If the users wants to know more or what else can he do:
  I can assist you with swapping, minting, tipping, dripping testnet tokens and sending tokens (all on Base). Just let me know what you need help with!.

8. If the user wants to mint they can specify the collection and token id or a Url from Coinbase Wallet URL or Zora URL:
  I'll help you mint the token with id 1 from collection 0x123456789...\n/mint 0x123456789... 1
  I'll help you mint the token from this url\n/url_mint https://wallet.coinbase.com/nft/mint/eip155:1:erc721:0x123456789...
  I'll help you mint the token from this url\n/url_mint https://zora.co/collect/base/0x123456789/1...
  
9. If the user wants testnet tokens and doesn't specify the network:
  Just let me know which network you'd like to drip to Base Sepolia or Base Goerli?

10. If the user wants testnet tokens and specifies the network:
  I'll help you get testnet tokens for Base Sepolia\n/drip base_sepolia 0x123456789...

11. If the user wants to pay a user (pay is different from send):
  I'll help you pay 1 USDC to vitalik.eth\nBe aware that this only works on mobile with a installed wallet on Base network\n/pay 1 vitalik.eth
  `;
  systemPrompt = PROMPT_REPLACE_VARIABLES(
    systemPrompt,
    userInfo?.address ?? "",
    userInfo,
    "@base"
  );
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
        skill: "/swap [amount] [token_from] [token_to]",
        triggers: ["/swap"],
        examples: ["/swap 10 usdc eth", "/swap 1 dai usdc"],
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
        skill: "/drip [network] [address]",
        triggers: ["/drip"],
        handler: handler,
        examples: [
          "/drip base_sepolia 0x123456789",
          "/drip base_goerli 0x123456789",
        ],
        description:
          "Drip a default amount of testnet tokens to a specified address.",
        params: {
          network: {
            default: "base",
            type: "string",
            values: ["base_sepolia", "base_goerli"],
          },
          address: {
            default: "",
            type: "address",
          },
        },
      },
      // Zora mints
      {
        skill: "/url_mint [url]",
        triggers: ["/url_mint"],
        handler: handler,
        examples: ["/url_mint https://zora.co/collect/base/0x123456789/1..."],
        description:
          "Return a Frame to mint From a Zora URL or Coinbase Wallet URL",
        params: {
          url: {
            type: "url",
          },
        },
      },
      {
        skill: "/mint [collection] [token_id]",
        examples: ["/mint 0x73a333cb82862d4f66f0154229755b184fb4f5b0 1"],
        triggers: ["/mint"],
        handler: handler,
        description: "Mint a specific token from a collection.",
        params: {
          collection: {
            default: "0x73a333cb82862d4f66f0154229755b184fb4f5b0",
            type: "string",
          },
          token_id: {
            default: "1",
            type: "number",
          },
        },
      },
      {
        skill: "/send [amount] [token] [username]",
        examples: ["/send 1 eth vitalik.eth", "/send 1 usdc 0x123456789..."],
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
        skill: "/pay [amount] [username]",
        triggers: ["/pay"],
        handler: handler,
        examples: ["/pay 1 vitalik.eth", "/pay 1 0x123456789..."],
        description: "Pay a user with a specified amount of USDC.",
        params: {
          amount: {
            default: 1,
            type: "number",
          },
          username: {
            default: "",
            type: "string",
          },
        },
      },
      {
        skill: "/show",
        triggers: ["/show"],
        examples: ["/show"],
        handler: handler,
        params: {},
        description: "Show the base url",
      },
    ],
  },
];
```

### Frames

This bot uses base frame

- [Base Tx Frame](https://messagekit.ephemerahq.com/directory/basetxframe)
- [Base Receipt Frame](https://messagekit.ephemerahq.com/directory/txreceipt)
- [Base Link](https://github.com/fabriguespe/baselink)

---

Made with ❤️ by [XMTP](https://xmtp.org).
