import { Address, parseEther } from "viem";
import { createViemWalletClient } from "../viem/createViemWalletClient";
import { ToolConfig } from "./allTools";
import { createViemPublicClient } from "../viem/creatViemPublicClient";

interface DeployERC20TokenArgs {
  name: string;
  symbol: string;
  initialSupply?: string;
}

const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newDeployedAddress",
        type: "address",
      },
    ],
    name: "TokenDeployed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_initialSupply",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "deployERC20Token",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const deployERC20TokenTool: ToolConfig<DeployERC20TokenArgs> = {
  definition: {
    type: "function",
    function: {
      name: "deploy_erc20_token",
      description: "Deploy an ERC20 token contract",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The name of the token",
          },
          symbol: {
            type: "string",
            description: "The symbol of the token",
          },
          initialSupply: {
            type: "string",
            description:
              "The initial supply of the token (in whole tokens, not Wei)",
            optional: true,
          },
        },
        required: ["name", "symbol"],
      },
    },
  },
  handler: async ({ name, symbol, initialSupply }: DeployERC20TokenArgs) => {
    try {
      const walletClient = createViemWalletClient();
      const publicClient = createViemPublicClient();
      const defaultSupply = "1000000000"; // 1 billion tokens
      const supply = initialSupply || defaultSupply;

      const hash = await walletClient.writeContract({
        abi: abi,
        address: "0x0e8920058072a955359d86d19d6b76f3e05bb011",
        args: [name, symbol, parseEther(supply), walletClient.account.address],
        functionName: "deployERC20Token",
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      //   console.log("hash:::", hash);

      console.log("reciept:", receipt.logs[0].topics[1]);

      if (!receipt.logs[0].topics[1]) {
        console.log(
          "Contract deployment failed, ca not found in transaction receipt"
        );
        throw new Error(
          "Contract deployment failed, ca not found in transaction receipt"
        );
      }

      const deployedAddress = "0x" + receipt.logs[0].topics[1].slice(26);
      console.log("Deployed Address:", deployedAddress);

      return deployedAddress;
    } catch (error) {
      console.log("error:::", error);
      if (error instanceof Error) {
        throw new Error(`Error deploying ERC20 token: ${error.message}`);
      } else {
        throw new Error("Error deploying ERC20 token: Unknown error");
      }
    }
  },
};
