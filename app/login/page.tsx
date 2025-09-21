
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, CandlestickChart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (username === 'Rut' && password === 'Patel') ||
      (username === 'Prasanna' && password === 'Maybhate')
    ) {
      sessionStorage.setItem('authenticated', 'true');
      router.push('/input');
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
       <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center">
          <CandlestickChart className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Apnastocks.in</h1>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
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
            © 2025 Apnastocks.in. All rights reserved. The information provided by this tool is for informational purposes only and should not be considered financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
