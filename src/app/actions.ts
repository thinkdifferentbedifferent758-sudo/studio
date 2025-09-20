'use server';

import {
  createOptimizedPortfolio,
  CreateOptimizedPortfolioOutput,
} from '@/ai/flows/create-optimized-portfolio';
import { z } from 'zod';

const FormSchema = z.object({
  stock1: z.string().min(1).max(5),
  stock2: z.string().min(1).max(5),
  stock3: z.string().min(1).max(5),
  stock4: z.string().min(1).max(5),
  stock5: z.string().min(1).max(5),
});

export async function getPortfolioAnalysis(
  data: z.infer<typeof FormSchema>
): Promise<{ data: CreateOptimizedPortfolioOutput | null; error: string | null }> {
  const validatedFields = FormSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      data: null,
      error: 'Invalid input. Please provide 5 valid stock tickers.',
    };
  }

  try {
    const stocks = Object.values(validatedFields.data).map((s) => s.toUpperCase());
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
