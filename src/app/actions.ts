'use server';

import {
  createOptimizedPortfolio,
  CreateOptimizedPortfolioOutput,
} from '@/ai/flows/create-optimized-portfolio';
import { z } from 'zod';

const FormSchema = z.object({
  stocks: z.array(z.object({
    ticker: z.string().min(1).max(5),
    shares: z.coerce.number().min(1, 'Must be at least 1 share.'),
  })).length(5),
});

export async function getPortfolioAnalysis(
  data: z.infer<typeof FormSchema>
): Promise<{ data: CreateOptimizedPortfolioOutput | null; error: string | null }> {
  const validatedFields = FormSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      data: null,
      error: 'Invalid input. Please provide 5 valid stock tickers and their share counts.',
    };
  }

  try {
    const stocks = validatedFields.data.stocks.map((s) => ({
      ticker: s.ticker.toUpperCase(),
      shares: s.shares,
    }));
    const result = await createOptimizedPortfolio({ stocks });
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage =
      e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      data: null,
      error: `Failed to get analysis from AI. Please try again. Details: ${errorMessage}`,
    };
  }
}
