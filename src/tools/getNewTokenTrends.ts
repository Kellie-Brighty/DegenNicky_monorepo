import { ToolConfig } from "./allTools";
import axios from "axios";

interface GetMemeTokenTrendsArgs {
  hashtag: string;
}

export const getMemeTokenTrendsTool: ToolConfig<GetMemeTokenTrendsArgs> = {
  definition: {
    type: "function",
    function: {
      name: "get_meme_token_trends",
      description: "Get the top meme token trends from Twitter",
      parameters: {
        type: "object",
        properties: {
          hashtag: {
            type: "string",
            description: "The hashtag to search for meme token trends",
          },
        },
        required: ["hashtag"],
      },
    },
  },
  handler: async ({ hashtag }) => {
    try {
      const response = await axios.get(
        `https://api.twitter.com/2/tweets/search/recent?query=%23${hashtag}&tweet.fields=public_metrics&expansions=author_id`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
          },
        }
      );

      const tweets = response.data.data;
      const trends = tweets.map((tweet: any) => ({
        text: tweet.text,
        author_id: tweet.author_id,
        retweet_count: tweet.public_metrics.retweet_count,
        like_count: tweet.public_metrics.like_count,
      }));

      console.log("trends:::", trends);

      return JSON.stringify(trends);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching meme token trends: ${error.message}`);
      } else {
        throw new Error("Error fetching meme token trends: Unknown error");
      }
    }
  },
};
