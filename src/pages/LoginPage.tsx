
import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff, Lock, Mail, User, Settings, Wrench } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-300 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo and Company Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-gray-100 group-hover:shadow-3xl transition-all duration-300">
                <img 
                  src="/lovable-uploads/11688d54-d446-4b80-a470-992728ced577.png" 
                  alt="HSE Partner Logo" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              YourHSEPartner
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Health, Safety & Environment Management
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
              <Shield className="h-4 w-4" />
              <span className="font-semibold">Secure Professional Platform</span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-8 pt-10 px-10">
            <CardTitle className="text-2xl text-center font-bold text-gray-900 mb-2">
              Welcome Back
            </CardTitle>
            <p className="text-center text-gray-600 font-medium">
              Sign in to access your HSE management dashboard
            </p>
          </CardHeader>
          
          <CardContent className="px-10 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-gray-800 font-semibold text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4 text-green-600" />
                  Email Address
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your work email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="h-12 text-base border-gray-200 focus:border-green-500 focus:ring-green-500/20 bg-white transition-all duration-200 rounded-lg" 
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="password" className="text-gray-800 font-semibold text-sm flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-600" />
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
                    className="h-12 text-base pr-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 bg-white transition-all duration-200 rounded-lg" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-lg" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing you in...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5" />
                    Sign In Securely
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Access Section */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Demo Access</h3>
                <p className="text-sm text-gray-600">Explore different user roles and capabilities</p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={() => fillDemoCredentials('admin')} 
                  className="w-full h-16 justify-between text-left border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all duration-200 group rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center group-hover:from-green-100 group-hover:to-green-200 transition-all duration-200">
                      <Settings className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900 text-base">Store Manager</div>
                      <div className="text-sm text-gray-500">admin@hsepartner.com</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    ADMIN
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => fillDemoCredentials('hse')} 
                  className="w-full h-16 justify-between text-left border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all duration-200 group rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center group-hover:from-green-100 group-hover:to-green-200 transition-all duration-200">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900 text-base">HSE Officer</div>
                      <div className="text-sm text-gray-500">hse@hsepartner.com</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                    HSE
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => fillDemoCredentials('maintenance')} 
                  className="w-full h-16 justify-between text-left border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all duration-200 group rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center group-hover:from-green-100 group-hover:to-green-200 transition-all duration-200">
                      <Wrench className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900 text-base">Maintenance Team</div>
                      <div className="text-sm text-gray-500">maint@hsepartner.com</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                    TECH
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 space-y-3">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-sm">Enterprise-Grade Security</span>
          </div>
          <p className="text-xs text-gray-400">© 2025 YourHSEPartner. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
