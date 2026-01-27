import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Eye, EyeOff, User, Lock, CheckCircle2 } from 'lucide-react';
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

  const features = [
    'Real-time attendance tracking',
    'Comprehensive reporting'
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          src={loginHero} 
          alt="Office building" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">AttendanceMS</span>
            </div>
          </div>
          
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Streamline Your Workforce Management
            </h1>
            <p className="text-white/80 text-lg mb-8">
              The complete attendance solution for modern businesses. Track, manage, and optimize your team's productivity.
            </p>
            
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-white/90" />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-white/60 text-sm">
            © 2024 Attendance Management System
          </p>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <Clock className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">AttendanceMS</span>
          </div>
          
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Welcome back
            </h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="pl-11 h-12 text-base"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-11 pr-11 h-12 text-base"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          
          {/* Mobile Footer */}
          <p className="lg:hidden text-center text-xs text-muted-foreground mt-8">
            © 2024 Attendance Management System
          </p>
        </div>
      </div>
    </div>
  );
}
