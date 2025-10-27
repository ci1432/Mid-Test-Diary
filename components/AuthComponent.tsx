"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// --- (1/4) Checkbox 컴포넌트를 import 합니다. ---
import { Checkbox } from "@/components/ui/checkbox";

export function AuthComponent() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // --- (2/4) '자동 로그인' 체크박스 상태를 추가합니다. (기본값: false) ---
  const [autoLogin, setAutoLogin] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    // --- (3/4) signIn 함수에 autoLogin 상태를 전달합니다. ---
    const { user, error } = await signIn(loginEmail, loginPassword, autoLogin);
    if (error) {
      setError(error.message);
    } else if (user) {
      router.push('/dashboard');
      setLoginEmail('');
      setLoginPassword('');
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    const { user, error } = await signUp(signupEmail, signupPassword);
    if (error) {
      setError(error.message);
    } else if (user) {
      router.push('/dashboard');
      setSignupEmail('');
      setSignupPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials to log in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email-login">Email</Label>
                <Input 
                  id="email-login" 
                  type="email" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)} 
                  disabled={loading} 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password-login">Password</Label>
                <Input 
                  id="password-login" 
                  type="password" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  disabled={loading} 
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </CardContent>
            {/* --- (4/4) CardFooter를 수정해 체크박스를 추가합니다. --- */}
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="auto-login" 
                  checked={autoLogin} 
                  onCheckedChange={(checked) => setAutoLogin(checked === true)}
                />
                <Label
                  htmlFor="auto-login"
                  className="text-sm font-normal cursor-pointer"
                >
                  자동 로그인
                </Label>
              </div>
              <Button onClick={handleLogin} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create a new account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email-signup">Email</Label>
                <Input 
                  id="email-signup" 
                  type="email" 
                  value={signupEmail} 
                  onChange={(e) => setSignupEmail(e.target.value)} 
                  disabled={loading} 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password-signup">Password</Label>
                <Input 
                  id="password-signup" 
                  type="password" 
                  value={signupPassword} 
                  onChange={(e) => setSignupPassword(e.target.value)} 
                  disabled={loading} 
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSignUp} disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}