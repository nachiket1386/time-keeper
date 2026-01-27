import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import loginBg from '@/assets/login-bg.jpg';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim()) {
      setError('Please enter username');
      return;
    }
    if (!password.trim()) {
      setError('Please enter password');
      return;
    }

    setIsLoading(true);
    const result = await login(username, password);
    setIsLoading(false);
    
    if (result.success) {
      toast.success('Login successful');
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px]" />
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
          {/* Header Section */}
          <div className="bg-primary/10 px-8 py-8 text-center border-b border-border/30">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary shadow-lg">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Attendance Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to access your dashboard</p>
          </div>
          
          {/* Form Section */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="pl-10 h-11 bg-background/50 border-border/60 focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="pl-10 pr-10 h-11 bg-background/50 border-border/60 focus:border-primary"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>
              
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                  <p className="text-sm text-destructive text-center">{error}</p>
                </div>
              )}
              
              <Button type="submit" className="w-full h-11 text-base font-medium shadow-md" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            {/* Demo credentials hint */}
            <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border/40">
              <p className="font-semibold text-foreground text-sm mb-3">Demo Credentials</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1.5 px-2 bg-background/50 rounded-md">
                  <span className="font-medium text-primary">Root</span>
                  <span className="text-muted-foreground font-mono">root / root123</span>
                </div>
                <div className="flex justify-between items-center py-1.5 px-2 bg-background/50 rounded-md">
                  <span className="font-medium text-primary">Admin</span>
                  <span className="text-muted-foreground font-mono">admin / admin123</span>
                </div>
                <div className="flex justify-between items-center py-1.5 px-2 bg-background/50 rounded-md">
                  <span className="font-medium text-primary">Supervisor</span>
                  <span className="text-muted-foreground font-mono">supervisor / user123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2024 Attendance Management System
        </p>
      </div>
    </div>
  );
}
