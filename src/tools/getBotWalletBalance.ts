import { formatEther } from "viem";
import { createViemWalletClient } from "../viem/createViemWalletClient";
import { ToolConfig } from "./allTools";
import { createViemPublicClient } from "../viem/creatViemPublicClient";

interface GetBotWalletBalanceArgs {}

export const getBotWalletBalanceTool: ToolConfig<GetBotWalletBalanceArgs> = {
  definition: {
    type: "function",
    function: {
      name: "get_bot_wallet_balance",
      description: "Get the AI bot's wallet balance",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  handler: async () => {
    try {
      const walletClient = createViemWalletClient();
      const publicClient = createViemPublicClient();
      const balance = await publicClient.getBalance({
        address: walletClient.account.address,
      });

      return formatEther(balance);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting wallet balance: ${error.message}`);
      } else {
        throw new Error("Error getting wallet balance: Unknown error");
      }
    }
  },
};
