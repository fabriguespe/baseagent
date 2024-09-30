import { HandlerContext } from "@xmtp/message-kit";

export async function handleSwap(context: HandlerContext) {
  const {
    message: {
      content: { content, command, params },
    },
  } = context;

  const baseUrl = "https://base-frame-lyart.vercel.app/transaction";

  switch (command) {
    case "swap":
      // Destructure and validate parameters for the swap command
      const { amount, token_from, token_to } = params;

      if (!amount || !token_from || !token_to) {
        context.reply(
          "Missing required parameters. Please provide amount, token_from, and token_to."
        );
        return;
      }
      // Generate URL for the swap transaction
      let url_swap = generateFrameURL(baseUrl, "swap", {
        amount,
        token_from,
        token_to,
      });
      context.send(`${url_swap}`);
      break;
    default:
      // Handle unknown commands
      context.reply("Unknown command. Use help to see all available commands.");
  }
}

// Function to generate a URL with query parameters for transactions
function generateFrameURL(
  baseUrl: string,
  transaction_type: string,
  params: any
) {
  // Filter out undefined parameters
  let filteredParams: { [key: string]: any } = {};

  for (const key in params) {
    if (params[key] !== undefined) {
      filteredParams[key] = params[key];
    }
  }
  let queryParams = new URLSearchParams({
    transaction_type,
    ...filteredParams,
  }).toString();
  return `${baseUrl}?${queryParams}`;
}
