import { run, HandlerContext } from "@xmtp/message-kit";
run(async (context: HandlerContext) => {}, {
  client: {
    logging: process.env.NODE_ENV === "production" ? "debug" : "off",
  },
});

// Function to generate a URL with query parameters for transactions
export function generateFrameURL(
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
