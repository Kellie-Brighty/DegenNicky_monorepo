import { ToolConfig } from "./allTools";
import { createViemWalletClient } from "../viem/createViemWalletClient";

interface GetBotWalletAddressArgs {}

export const getBotWalletAddressTool: ToolConfig<GetBotWalletAddressArgs> = {
  definition: {
    type: "function",
    function: {
      name: "get_wallet_address",
      description: "Get the AI bot's wallet address",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  handler: async () => {
    const publicClient = createViemWalletClient();
    return publicClient.account.address;
  },
};
