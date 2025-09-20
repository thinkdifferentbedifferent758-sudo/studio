'use server';
/**
 * @fileOverview Analyzes a user-provided list of stocks and provides a portfolio analysis.
 *
 * - analyzeUserStockPortfolio - A function that analyzes the user's stock portfolio.
 * - AnalyzeUserStockPortfolioInput - The input type for the analyzeUserStockPortfolio function.
 * - AnalyzeUserStockPortfolioOutput - The return type for the analyzeUserStockPortfolio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserStockPortfolioInputSchema = z.object({
  stocks: z
    .array(z.string())
    .length(5)
    .describe('A list of 5 stock ticker symbols.'),
});
export type AnalyzeUserStockPortfolioInput = z.infer<
  typeof AnalyzeUserStockPortfolioInputSchema
>;

const AnalyzeUserStockPortfolioOutputSchema = z.object({
  analysis: z.string().describe('An analysis of the potential risks and rewards of the portfolio.'),
  riskyStocks: z
    .array(z.string())
    .describe('A list of stocks identified as particularly risky.'),
  suggestedAllocations: z
    .record(z.number())
    .describe('Suggested allocation percentages for each stock in the portfolio.'),
});
export type AnalyzeUserStockPortfolioOutput = z.infer<
  typeof AnalyzeUserStockPortfolioOutputSchema
>;

export async function analyzeUserStockPortfolio(
  input: AnalyzeUserStockPortfolioInput
): Promise<AnalyzeUserStockPortfolioOutput> {
  return analyzeUserStockPortfolioFlow(input);
}

const analyzeUserStockPortfolioPrompt = ai.definePrompt({
  name: 'analyzeUserStockPortfolioPrompt',
  input: {schema: AnalyzeUserStockPortfolioInputSchema},
  output: {schema: AnalyzeUserStockPortfolioOutputSchema},
  prompt: `You are a financial analyst specializing in portfolio risk assessment.

  Analyze the following list of stocks and their potential risks and rewards within a portfolio context.
  Consider market trends, and stock correlations. Suggest weighting of securities as appropriate.

  Stocks: {{stocks}}

  Provide an analysis of the portfolio, identify any particularly risky stocks, and suggest allocation percentages for each stock.
  Format the output as a JSON object with the following keys:
  - analysis: A string describing the overall portfolio analysis.
  - riskyStocks: An array of strings, where each string is a stock ticker symbol identified as risky.
  - suggestedAllocations: A JSON object where keys are stock ticker symbols and values are the suggested allocation percentages (as numbers between 0 and 100).`,
});

const analyzeUserStockPortfolioFlow = ai.defineFlow(
  {
    name: 'analyzeUserStockPortfolioFlow',
    inputSchema: AnalyzeUserStockPortfolioInputSchema,
    outputSchema: AnalyzeUserStockPortfolioOutputSchema,
  },
  async input => {
    const {output} = await analyzeUserStockPortfolioPrompt(input);
    return output!;
  }
);
