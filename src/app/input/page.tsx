'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Bot,
  CandlestickChart,
  LoaderCircle,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getPortfolioAnalysis } from '../actions';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

const formSchema = z.object({
  stock1: z
    .string()
    .min(1, 'Stock ticker is required.')
    .max(5, 'Ticker is too long.'),
  stock2: z
    .string()
    .min(1, 'Stock ticker is required.')
    .max(5, 'Ticker is too long.'),
  stock3: z
    .string()
    .min(1, 'Stock ticker is required.')
    .max(5, 'Ticker is too long.'),
  stock4: z
    .string()
    .min(1, 'Stock ticker is required.')
    .max(5, 'Ticker is too long.'),
  stock5: z
    .string()
    .min(1, 'Stock ticker is required.')
    .max(5, 'Ticker is too long.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function InputPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stock1: 'GOOGL',
      stock2: 'AAPL',
      stock3: 'MSFT',
      stock4: 'AMZN',
      stock5: 'TSLA',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setError(null);

    const { data, error } = await getPortfolioAnalysis(values);

    if (error) {
      setError(error);
      setIsLoading(false);
    } else if (data) {
      const params = new URLSearchParams();
      params.set('result', JSON.stringify(data));
      router.push(`/analysis?${params.toString()}`);
    }
  }

  const stockInputs: (keyof FormValues)[] = [
    'stock1',
    'stock2',
    'stock3',
    'stock4',
    'stock5',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center">
          <CandlestickChart className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-xl font-bold text-foreground">PortfolioSage</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8 flex justify-center items-start">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6" />
              Analyze Your Stocks
            </CardTitle>
            <CardDescription>
              Enter 5 stock tickers to get an AI-powered portfolio analysis and
              suggested allocation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stockInputs.map((name, index) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock {index + 1}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., AAPL"
                              {...field}
                              onInput={(e) => {
                                e.currentTarget.value = e.currentTarget.value.toUpperCase();
                                field.onChange(e);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button
                  type="submit"
                  className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Portfolio
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
