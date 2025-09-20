
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, CandlestickChart, LoaderCircle, Sparkles, LogOut, PlusCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  stocks: z.array(z.object({
    ticker: z.string().min(1, 'Ticker is required.').max(5, 'Ticker is too long.'),
    shares: z.coerce.number().min(1, 'Must be > 0.'),
  })).min(1, 'Please add at least one stock.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function InputPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

   useEffect(() => {
    const authStatus = sessionStorage.getItem('authenticated');
    if (authStatus !== 'true') {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stocks: [
        { ticker: 'GOOGL', shares: 10 },
        { ticker: 'AAPL', shares: 15 },
        { ticker: 'MSFT', shares: 8 },
        { ticker: 'AMZN', shares: 5 },
        { ticker: 'TSLA', shares: 12 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'stocks',
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

  const handleLogout = () => {
    sessionStorage.removeItem('authenticated');
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null; 
  }


  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <CandlestickChart className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Apnastocks.in</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
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
              Enter the stock tickers and the number of shares to get an AI-powered
              portfolio analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-start">
                       <FormField
                        control={form.control}
                        name={`stocks.${index}.ticker`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock {index + 1} Ticker</FormLabel>
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
                       <FormField
                        control={form.control}
                        name={`stocks.${index}.shares`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shares</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 10"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-8 text-destructive"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                      >
                        <XCircle className="h-5 w-5" />
                        <span className="sr-only">Remove stock</span>
                      </Button>
                    </div>
                  ))}
                </div>

                 <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => append({ ticker: '', shares: 1 })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Another Stock
                </Button>


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
      <footer className="mt-auto border-t w-full">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-2">Contact us</p>
          <div className="flex justify-center items-center gap-x-4 mb-4">
            <a href="mailto:rutpatel@apnastocks.in" className="text-primary hover:underline">
              Email: rutpatel@apnastocks.in
            </a>
            <span>WhatsApp: +91-7990898016</span>
          </div>
          <Separator className="my-4" />
          <p className="text-xs">
            © 2024 Apnastocks.in. All rights reserved. The information provided by this tool is for informational purposes only and should not be considered financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
