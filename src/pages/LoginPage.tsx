
import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff, Lock, Mail, Settings, Wrench, CheckCircle, Users, BarChart3 } from 'lucide-react';
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
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Login Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your HSE management dashboard</p>
          </div>

          {/* Login Form */}
          <Card className="shadow-xl border-0 bg-white">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-800 font-medium flex items-center gap-2">
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
                    className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-800 font-medium flex items-center gap-2">
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
                      className="h-12 pr-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg" 
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

              {/* Demo Access */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 text-center">Demo Access</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={() => fillDemoCredentials('admin')} 
                    className="w-full justify-between text-left border-gray-200 hover:border-green-300 hover:bg-green-50"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Store Manager</span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">ADMIN</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={() => fillDemoCredentials('hse')} 
                    className="w-full justify-between text-left border-gray-200 hover:border-green-300 hover:bg-green-50"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm">HSE Officer</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">HSE</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={() => fillDemoCredentials('maintenance')} 
                    className="w-full justify-between text-left border-gray-200 hover:border-green-300 hover:bg-green-50"
                  >
                    <div className="flex items-center gap-3">
                      <Wrench className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Maintenance Team</span>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">TECH</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Company Branding */}
      <div className="flex-1 bg-gradient-to-br from-green-500 via-green-600 to-green-700 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-10 w-24 h-24 border border-white rounded-full"></div>
        </div>

        <div className="relative z-10 text-center text-white max-w-lg">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-6">
              <img 
                src="/lovable-uploads/11688d54-d446-4b80-a470-992728ced577.png" 
                alt="HSE Partner Logo" 
                className="w-24 h-24 object-contain"
              />
            </div>
            <h1 className="text-5xl font-bold mb-4">YourHSEPartner</h1>
            <p className="text-xl text-green-100 font-medium mb-8">
              Health, Safety & Environment Management
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Safety First</h3>
                <p className="text-green-100">Comprehensive safety management system</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Real-time Analytics</h3>
                <p className="text-green-100">Monitor and track safety metrics</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Team Collaboration</h3>
                <p className="text-green-100">Seamless team coordination</p>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="flex items-center justify-center gap-2 text-green-100">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Enterprise-Grade Security</span>
            </div>
            <p className="text-sm text-green-200 mt-2">© 2025 YourHSEPartner. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
