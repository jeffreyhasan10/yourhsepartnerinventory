
import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { AuthContext } from '../App';

const LoginPage = () => {
  const { user, login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (login(email, password)) {
      toast.success('Welcome to YourHSEPartner!', {
        description: 'You have been successfully logged in.'
      });
    } else {
      toast.error('Invalid credentials', {
        description: 'Please check your email and password.'
      });
    }
    setIsLoading(false);
  };

  const fillDemoCredentials = (role: string) => {
    switch (role) {
      case 'admin':
        setEmail('admin@hsepartner.com');
        setPassword('admin123');
        break;
      case 'hse':
        setEmail('hse@hsepartner.com');
        setPassword('hse123');
        break;
      case 'maintenance':
        setEmail('maint@hsepartner.com');
        setPassword('maint123');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo and Title */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-3">
                <img 
                  src="/lovable-uploads/11688d54-d446-4b80-a470-992728ced577.png" 
                  alt="HSE Partner Logo" 
                  className="w-12 h-12 object-contain filter brightness-0 invert"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
              YourHSEPartner
            </h1>
            <p className="text-gray-600 font-medium">Professional Inventory Management System</p>
            <div className="w-16 h-1 bg-gradient-to-r from-green-600 to-green-500 rounded-full mx-auto"></div>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-2xl border border-green-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-6 bg-gradient-to-r from-green-50 to-green-100/50 rounded-t-lg">
            <CardTitle className="text-2xl text-center font-bold text-green-800">Welcome Back</CardTitle>
            <p className="text-sm text-green-600 text-center font-medium">
              Sign in to access your HSE dashboard
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-700 font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email address" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    className="h-12 pl-4 pr-4 border-green-200 focus:border-green-500 focus:ring-green-500 bg-white/70 backdrop-blur-sm transition-all duration-200" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-700 font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    className="h-12 pl-4 pr-12 border-green-200 focus:border-green-500 focus:ring-green-500 bg-white/70 backdrop-blur-sm transition-all duration-200" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-700 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing you in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Sign In Securely
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-green-100">
              <div className="text-center mb-4">
                <h3 className="text-sm font-semibold text-green-700 mb-1">Demo Access</h3>
                <p className="text-xs text-green-600">Try different user roles</p>
              </div>
              <div className="grid gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => fillDemoCredentials('admin')} 
                  className="w-full justify-between text-left h-auto p-4 border-green-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-all duration-200">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-green-800">Store Manager</div>
                      <div className="text-xs text-green-600">admin@hsepartner.com</div>
                    </div>
                  </div>
                  <div className="text-xs text-green-500 font-medium">Admin</div>
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => fillDemoCredentials('hse')} 
                  className="w-full justify-between text-left h-auto p-4 border-green-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-all duration-200">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-green-800">HSE Officer</div>
                      <div className="text-xs text-green-600">hse@hsepartner.com</div>
                    </div>
                  </div>
                  <div className="text-xs text-green-500 font-medium">HSE</div>
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => fillDemoCredentials('maintenance')} 
                  className="w-full justify-between text-left h-auto p-4 border-green-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-all duration-200">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-green-800">Maintenance Team</div>
                      <div className="text-xs text-green-600">maint@hsepartner.com</div>
                    </div>
                  </div>
                  <div className="text-xs text-green-500 font-medium">Tech</div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-green-600 mb-2">
            <Shield className="h-4 w-4" />
            <span className="font-medium">Secure & Protected</span>
          </div>
          <p className="text-xs text-green-500">© 2025 YourHSEPartner. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
