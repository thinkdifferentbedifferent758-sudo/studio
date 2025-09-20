'use client';

import { useSearchParams } from 'next/navigation';
import {
  CandlestickChart,
  Landmark,
  Newspaper,
  Percent,
  PieChartIcon,
  ShieldAlert,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import type { CreateOptimizedPortfolioOutput } from '@/ai/flows/create-optimized-portfolio';
import { Suspense } from 'react';

const PortfolioPieChart = dynamic(
  () => import('@/components/portfolio-pie-chart'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[250px] w-full" />,
  }
);

function AnalysisContent() {
  const searchParams = useSearchParams();
  const resultString = searchParams.get('result');
  
  let result: CreateOptimizedPortfolioOutput | null = null;
  let error: string | null = null;

  if (resultString) {
    try {
      result = JSON.parse(resultString);
    } catch (e) {
      error = 'Failed to parse analysis results.';
    }
  } else {
    error = "No analysis data found. Please go back and generate a portfolio.";
  }


  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center">
          <CandlestickChart className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-xl font-bold text-foreground">PortfolioSage</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
            {error && (
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error}
                  <Button asChild variant="link">
                    <Link href="/input">Go back to input</Link>
                  </Button>
                </AlertDescription>
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

                <div className="text-center">
                  <Button asChild>
                    <Link href="/input">Analyze another portfolio</Link>
                  </Button>
                </div>
              </>
            )}
        </div>
      </main>
    </div>
  );
}


export default function AnalysisPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnalysisContent />
    </Suspense>
  )
}
