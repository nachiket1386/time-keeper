import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import loginHero from '@/assets/login-hero.jpg';

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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Hero Section */}
      <div className="relative flex-1 md:w-3/5 min-h-[320px] md:min-h-screen bg-primary overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <img 
          src={loginHero} 
          alt="Modern office building" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        
        {/* Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/70" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.12]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="login-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-grid)" />
          </svg>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-16 text-primary-foreground max-w-2xl w-full">
          <div className="mb-6">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl flex items-center justify-center">
              <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-[1.1]">
            Streamline your corporate attendance
          </h1>
          <p className="text-primary-foreground/80 text-base sm:text-lg max-w-md">
            Experience the next generation of workforce management with AttendanceMS. Secure, fast, and automated.
          </p>
        </div>
        
        {/* Floating Accent */}
        <div className="absolute -bottom-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Form Section */}
      <div className="flex-1 md:w-2/5 flex items-center justify-center p-5 sm:p-8 md:p-10 lg:p-16 bg-background">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Clock className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">AttendanceMS</span>
          </div>

          <div className="mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-foreground">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="pl-10 sm:pl-11 h-11 sm:h-12 bg-card border-input rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-10 sm:pl-11 pr-10 sm:pr-11 h-11 sm:h-12 bg-card border-input rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm sm:text-base"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3">
                <p className="text-xs sm:text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 sm:h-12 text-sm sm:text-base font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground mt-8 pt-6 border-t border-border">
            © 2024 Attendance Management System
          </p>
        </div>
      </div>
    </div>
  );
}
