import { createWalletClient, custom, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
// import { eip712WalletActions } from "viem/zksync";

export function createViemWalletClient() {
  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

  return createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(),
  });
}

//Base Sepolia
//https://sepolia.base.org
//84532
//ETH
//https://sepolia.basescan.org
