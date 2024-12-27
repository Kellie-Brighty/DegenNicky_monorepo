import { ToolConfig } from "./allTools";
import axios from "axios";

interface GetDexscreenerTrendsArgs {
  timeframe: string;
}

export const getDexscreenerTrendsTool: ToolConfig<GetDexscreenerTrendsArgs> = {
  definition: {
    type: "function",
    function: {
      name: "get_dexscreener_trends",
      description: "Get the top trending ERC20 meme tokens from Dexscreener",
      parameters: {
        type: "object",
        properties: {
          timeframe: {
            type: "string",
            description:
              "The timeframe to get the trends for (e.g., '5h', '7d')",
          },
        },
        required: ["timeframe"],
      },
    },
  },
  handler: async ({ timeframe }) => {
    try {
      // Query Dexscreener API to get the latest pairs (Ethereum)
      const response = await axios.get(
        "https://api.dexscreener.com/latest/dex/search/?q=ethereum"
      );

      const pairs = response.data.pairs;

    //   console.log("pairs:", pairs);

      // Filter pairs to consider only those in the specified timeframe
      const filteredPairs = pairs.filter((pair: any) => {
        const lastUpdated = new Date(pair.pairCreatedAt * 1000);
        const now = new Date();
        const hoursDifference =
          (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
        return timeframe === "5h"
          ? hoursDifference <= 5
          : hoursDifference <= 24 * 7;
      });

      // Rank pairs by volume in descending order
      const sortedPairs = filteredPairs.sort(
        (a: any, b: any) => b.volumeUsd24h - a.volumeUsd24h
      );

    //   console.log("Sorted Pairs:", sortedPairs);

      const topTrendingPairs = sortedPairs.map((pair: any) => ({
        baseToken: pair.baseToken.symbol,
        quoteToken: pair.quoteToken.symbol,
        priceUsd: pair.priceUsd,
        volumeUsd24h: pair.volumeUsd24h,
        liquidity: pair.liquidity.usd,
        trendingScore: pair.volumeUsd24h, // Using 24h volume as an indicator of trending score
      }));

      console.log("Top Trending Meme Tokens:");
      console.log(topTrendingPairs);

      return JSON.stringify(topTrendingPairs);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching Dexscreener trends: ${error.message}`);
      } else {
        throw new Error("Error fetching Dexscreener trends: Unknown error");
      }
    }
  },
};
