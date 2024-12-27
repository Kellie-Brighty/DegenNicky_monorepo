import { deployERC20TokenTool } from "./deployERC20Token";
import { getBalanceTool } from "./getBalance";
import { getBotWalletBalanceTool } from "./getBotWalletBalance";
import { getDexscreenerTrendsTool } from "./getDexScreenerTrends";
import { getMemeTokenTrendsTool } from "./getNewTokenTrends";
import { getBotWalletAddressTool } from "./getWalletAddress";
import { sendTransactionTool } from "./sendTransaction";

export interface ToolConfig<T = any> {
  definition: {
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: {
        type: "object";
        properties: Record<string, unknown>;
        required: string[];
      };
    };
  };
  handler: (args: T) => Promise<any>;
}

export const tools: Record<string, ToolConfig> = {
  get_balance: getBalanceTool,
  get_wallet_address: getBotWalletAddressTool,
  send_transaction: sendTransactionTool,
  get_bot_wallet_balance: getBotWalletBalanceTool,
  deploy_erc20_token: deployERC20TokenTool,
  get_meme_token_trends: getMemeTokenTrendsTool,
  get_dexscreener_trends: getDexscreenerTrendsTool,
};
