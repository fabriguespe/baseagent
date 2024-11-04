import { skills } from "./skills.js";
import { UserInfo, PROMPT_USER_CONTENT } from "./lib/resolver.js";
import { PROMPT_RULES, PROMPT_SKILLS_AND_EXAMPLES } from "./lib/gpt.js";

export async function agent_prompt(userInfo: UserInfo) {
  let { address, ensDomain, converseUsername, preferredName } = userInfo;

  //Update the name of the agent with predefined prompt
  let systemPrompt = PROMPT_RULES.replace("{NAME}", skills?.[0]?.tag ?? "@ens");

  //Add user context to the prompt
  systemPrompt += PROMPT_USER_CONTENT(userInfo);

  //Add skills and examples to the prompt
  systemPrompt += PROMPT_SKILLS_AND_EXAMPLES(skills, "@ens");

  systemPrompt += `
  
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

7. If the users wants to know more or what else can he do:
  I can assist you with swapping, minting, tipping, dripping testnet tokens and sending tokens on Base. Just let me know what you need help with!.

8. If the user wants to mint they can specify the collection and token id or a Url from Coinbase Wallet URL or Zora URL:
  I'll help you mint the token with id 1 from collection 0x123456789...\n/mint 0x123456789... 1
  I'll help you mint the token from this url\n/url_mint https://wallet.coinbase.com/nft/mint/eip155:1:erc721:0x123456789...
  I'll help you mint the token from this url\n/url_mint https://zora.co/collect/base/0x123456789/1...
  
 9. If the user wants testnet tokens:
  I can help you drip testnet tokens to your address. Just let me know how many and which network you'd like to drip to.
  /drip base_sepolia 0x123456789...
  /drip base_goerli 0x123456789...`;
  return systemPrompt;
}
