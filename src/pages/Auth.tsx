
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage('登入失敗：' + error.message);
    } else {
      setMessage('登入成功！正在將您導向首頁...');
      navigate('/');
    }
    setLoading(false);
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      }
    });

    if (error) {
      setMessage('註冊失敗：' + error.message);
    } else {
      setMessage('註冊成功！請檢查您的電子郵件以進行驗證。');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{isSignUp ? '建立帳戶' : '登入您的帳戶'}</CardTitle>
          <CardDescription>
            {isSignUp ? '輸入您的電子郵件以註冊新帳戶' : '輸入您的電子郵件與密碼以登入'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">密碼</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {message && <p className="text-sm text-foreground/80 text-center">{message}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '處理中...' : (isSignUp ? '註冊' : '登入')}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            {isSignUp ? '已經有帳戶了？' : '還沒有帳戶？'}
            <button onClick={() => setIsSignUp(!isSignUp)} className="underline ml-1">
              {isSignUp ? '登入' : '註冊'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
