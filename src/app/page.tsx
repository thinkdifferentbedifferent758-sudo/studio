'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Bot,
  CandlestickChart,
  Landmark,
  LoaderCircle,
  Newspaper,
  Percent,
  PieChartIcon,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import dynamic from 'next/dynamic';

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

import type { CreateOptimizedPortfolioOutput } from '@/ai/flows/create-optimized-portfolio';
import { getPortfolioAnalysis } from './actions';

const PortfolioPieChart = dynamic(
  () => import('@/components/portfolio-pie-chart'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[250px] w-full" />,
  }
);

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

export default function Home() {
  const [result, setResult] =
    useState<CreateOptimizedPortfolioOutput | null>(null);
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
    setResult(null);

    const { data, error } = await getPortfolioAnalysis(values);

    if (error) {
      setError(error);
    } else {
      setResult(data);
    }

    setIsLoading(false);
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

      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="w-full sticky top-24">
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

          <div className="space-y-8">
            {isLoading && (
              <>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-8 w-64" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-8 w-56" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[250px] w-full rounded-full" />
                  </CardContent>
                </Card>
              </>
            )}

            {error && (
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Newspaper className="h-6 w-6" />
                      AI Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-card-foreground/90 leading-relaxed">
                      {result.analysis}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Landmark className="h-6 w-6" />
                      Suggested Portfolio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Stock</TableHead>
                          <TableHead className="text-right flex items-center justify-end gap-1">
                            <Percent className="h-4 w-4" /> Allocation
                          </TableHead>
                          <TableHead className="text-right flex items-center justify-end gap-1">
                            <ShieldAlert className="h-4 w-4" /> Risk
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.portfolio.map((item) => (
                          <TableRow key={item.stock}>
                            <TableCell className="font-medium">
                              {item.stock}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {item.allocation.toFixed(2)}%
                            </TableCell>
                            <TableCell className="text-right">
                              {item.isRisky ? (
                                <Badge variant="destructive">High</Badge>
                              ) : (
                                <Badge variant="secondary">Low</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="h-6 w-6" />
                      Allocation Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PortfolioPieChart data={result.portfolio} />
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
