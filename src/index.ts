import { run, HandlerContext } from "@xmtp/message-kit";
import { agentRun } from "@xmtp/message-kit";
import { skills } from "./skills.js";
import { defaultPromptTemplate } from "@xmtp/message-kit";

export async function agent_prompt(senderAddress: string) {
  let fineTuning = `
  ## Example response:

  1. When user wants to swap tokens:
    Hey {PREFERRED_NAME! I can help you swap tokens on Base.\nLet me help you swap 10 USDC to ETH\n/swap 10 usdc eth
  
  2. When user wants to swap a specific amount:
    Sure! I'll help you swap 5 DEGEN to DAI\n/swap 5 degen dai
  
  3. When user wants to pay a specific token:
    I'll help you pay 1 USDC to 0x123...\n/pay 1 {TOKEN} 0x123456789...
    *This will return a url to pay
  
  4. If the user wants to pay a eth domain:
    I'll help you pay 1 USDC to vitalik.eth\nBe aware that this only works on mobile with a installed wallet on Base network\n/pay 1 vitalik.eth
    *This will return a url to pay
  
  5. If the user wants to pay a username:
    I'll help you pay 1 USDC to @fabri\nBe aware that this only works on mobile with a installed wallet on Base network\n/pay 1 @fabri
    *This will return a url to pay
  
  6. When user asks about supported tokens:
    can help you swap or pay these tokens on Base:\n- ETH\n- USDC\n- DAI\n- DEGEN\nJust let me know the amount and which tokens you'd like to swap or send!
  
  7. When user wants to tip default to 1 usdc:
    Let's go ahead and tip 1 USDC to nick.eth\n/pay 1 usdc 0x123456789...
  
  8. If the users greets or wants to know more or what else can he do:
    I can assist you with swapping, minting, tipping, dripping testnet tokens and sending tokens (all on Base). Just let me know what you need help with!.
  
  9. If the user wants to mint they can specify the collection and token id or a Url from Coinbase Wallet URL or Zora URL:
    I'll help you mint the token with id 1 from collection 0x123456789...\n/mint 0x123456789... 1
    I'll help you mint the token from this url\n/url_mint https://wallet.coinbase.com/nft/mint/eip155:1:erc721:0x123456789...
    I'll help you mint the token from this url\n/url_mint https://zora.co/collect/base/0x123456789/1...
  
  10. If the user wants testnet tokens and doesn't specify the network:
    Just let me know which network you'd like to drip to Base Sepolia or Base Goerli?
  
  11. If the user wants testnet tokens and specifies the network:
    I'll help you get testnet tokens for Base Sepolia\n/drip base_sepolia 0x123456789...
`;

  return defaultPromptTemplate(fineTuning, senderAddress, skills, "@ens");
}

run(async (context: HandlerContext) => {
  agentRun(context, async (address: string) => {
    const result = (await agent_prompt(address)) ?? "No response available";
    return result;
  });
});
