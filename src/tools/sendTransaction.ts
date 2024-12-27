import { Address, parseEther } from "viem";
import { createViemWalletClient } from "../viem/createViemWalletClient";
import { ToolConfig } from "./allTools";

interface SendTransactionArgs {
  to: Address;
  amount?: string;
}

export const sendTransactionTool: ToolConfig<SendTransactionArgs> = {
  definition: {
    type: "function",
    function: {
      name: "send_transaction",
      description: "Send a transaction from the AI bot's wallet",
      parameters: {
        type: "object",
        properties: {
          to: {
            type: "string",
            description: "The recipient wallet address",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          amount: {
            type: "string",
            description: "The amount of Ether to send (in Eth, not Wei)",
          },
        },
        required: ["to"],
      },
    },
  },
  handler: async ({ to, amount }) => {
    try {
      const walletClient = createViemWalletClient();
      const transaction = {
        to: to,
        value: parseEther(amount || "0"),
      };

      const transactionResponse = await walletClient.sendTransaction(
        transaction
      );

      return transactionResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error sending transaction: ${error.message}`);
      } else {
        throw new Error("Error sending transaction: Unknown error");
      }
    }
  },
};
