import { Address, formatEther } from "viem";
import { createViemPublicClient } from "../viem/creatViemPublicClient";
import { ToolConfig } from "./allTools";

interface GetBalanceArgs {
  wallet: Address;
}

export const getBalanceTool: ToolConfig<GetBalanceArgs> = {
  definition: {
    type: "function",
    function: {
      name: "get_balance",
      description: "Get the balance of a wallet",
      parameters: {
        type: "object",
        properties: {
          wallet: {
            type: "string",
            description: "The wallet address to get the balance of",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
        },
        required: ["wallet"],
      },
    },
  },
  handler: async ({ wallet }) => {
    const client = createViemPublicClient();
    const balance = await client.getBalance({ address: wallet });
    return formatEther(balance);
  },
};
