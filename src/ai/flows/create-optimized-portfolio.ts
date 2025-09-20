'use server';

/**
 * @fileOverview An AI agent that creates an optimized portfolio based on a list of stocks.
 *
 * - createOptimizedPortfolio - A function that handles the portfolio creation process.
 * - CreateOptimizedPortfolioInput - The input type for the createOptimizedPortfolio function.
 * - CreateOptimizedPortfolioOutput - The return type for the createOptimizedPortfolio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StockInputSchema = z.object({
  ticker: z.string().describe('The stock ticker symbol.'),
  shares: z.number().describe('The number of shares for the stock.'),
});

const CreateOptimizedPortfolioInputSchema = z.object({
  stocks: z
    .array(StockInputSchema)
    .min(1)
    .describe('A list of stocks to analyze and create a portfolio from.'),
});
export type CreateOptimizedPortfolioInput = z.infer<
  typeof CreateOptimizedPortfolioInputSchema
>;

const CompetitorStockSchema = z.object({
  ticker: z.string().describe('The competitor stock ticker symbol.'),
  name: z.string().describe("The competitor's company name."),
  marketCap: z.number().describe("The competitor's market capitalization in billions of USD."),
  peRatio: z.number().describe("The competitor's Price-to-Earnings (P/E) ratio."),
  dividendYield: z
    .number()
    .describe("The competitor's dividend yield as a percentage."),
});

const CreateOptimizedPortfolioOutputSchema = z.object({
  portfolio: z
    .array(
      z.object({
        stock: z.string().describe('The stock ticker symbol.'),
        allocation: z
          .number()
          .describe('The suggested allocation percentage for the stock.'),
        isRisky: z.boolean().describe('Whether the stock is considered risky.'),
      })
    )
    .describe(
      'The optimized portfolio with stock allocations and risk assessments.'
    ),
  analysis: z.string().describe('The analysis of the portfolio.'),
  competitorAnalysis: z
    .object({
      summary: z
        .string()
        .describe(
          'A summary of how the portfolio compares to key competitors.'
        ),
      competitors: z
        .array(CompetitorStockSchema)
        .describe(
          'A list of 3-5 key competitor stocks with their financial metrics.'
        ),
    })
    .describe('An analysis of the portfolio against its main competitors.'),
});
export type CreateOptimizedPortfolioOutput = z.infer<
  typeof CreateOptimizedPortfolioOutputSchema
>;

export async function createOptimizedPortfolio(
  input: CreateOptimizedPortfolioInput
): Promise<CreateOptimizedPortfolioOutput> {
  return createOptimizedPortfolioFlow(input);
}

const createOptimizedPortfolioPrompt = ai.definePrompt({
  name: 'createOptimizedPortfolioPrompt',
  input: {schema: CreateOptimizedPortfolioInputSchema},
  output: {schema: CreateOptimizedPortfolioOutputSchema},
  prompt: `You are an expert financial advisor specializing in portfolio optimization.

  Based on the list of stocks and the number of shares for each, analyze their potential risks and rewards within a portfolio context. Consider market trends, correlations, and other relevant factors to determine an optimal allocation for each stock.

  Pay special attention to adjust weighting of securities as appropriate based on market trends and correlation. The number of shares represents the user's current holdings and should influence your analysis.
  
  Identify any stocks that may pose a higher risk to the portfolio and flag them accordingly.

  Also, provide an analysis of the created portfolio against 3-5 of its main competitors. For each competitor, provide their stock ticker, name, market capitalization (in billions), P/E ratio, and dividend yield (as a percentage). Include a summary of this competitive analysis.

  Present the portfolio with suggested allocations for each stock, highlighting any potentially risky stocks.
  \nStocks:
  {{#each stocks}}
  - Ticker: {{this.ticker}}, Shares: {{this.shares}}
  {{/each}}
  \nPortfolio:`,
});

const createOptimizedPortfolioFlow = ai.defineFlow(
  {
    name: 'createOptimizedPortfolioFlow',
    inputSchema: CreateOptimizedPortfolioInputSchema,
    outputSchema: CreateOptimizedPortfolioOutputSchema,
  },
  async input => {
    const {output} = await createOptimizedPortfolioPrompt(input);
    return output!;
  }
);
