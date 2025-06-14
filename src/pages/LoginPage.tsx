
import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Compact Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
            <p className="text-sm text-gray-600">Sign in to your HSE dashboard</p>
          </div>

          {/* Compact Login Form */}
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-green-600" />
                    Email
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@company.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    className="h-10 text-sm border-gray-200 focus:border-green-500 focus:ring-green-500/20" 
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-green-600" />
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
                      className="h-10 pr-10 text-sm border-gray-200 focus:border-green-500 focus:ring-green-500/20" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-10 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium text-sm shadow-md" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5" />
                      Sign In
                    </div>
                  )}
                </Button>
              </form>

              {/* Compact Demo Access */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-600 mb-3 text-center">Quick Demo Access</p>
                <div className="space-y-1.5">
                  <Button 
                    variant="outline" 
                    onClick={() => fillDemoCredentials('admin')} 
                    className="w-full h-8 justify-between text-xs border-gray-200 hover:border-green-300 hover:bg-green-50"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="h-3 w-3 text-green-600" />
                      <span>Store Manager</span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">ADMIN</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={() => fillDemoCredentials('hse')} 
                    className="w-full h-8 justify-between text-xs border-gray-200 hover:border-green-300 hover:bg-green-50"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3 text-green-600" />
                      <span>HSE Officer</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">HSE</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={() => fillDemoCredentials('maintenance')} 
                    className="w-full h-8 justify-between text-xs border-gray-200 hover:border-green-300 hover:bg-green-50"
                  >
                    <div className="flex items-center gap-2">
                      <Wrench className="h-3 w-3 text-green-600" />
                      <span>Maintenance Team</span>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">TECH</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Company Branding */}
      <div className="flex-1 bg-gradient-to-br from-green-600 via-green-700 to-green-800 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-5 w-16 h-16 border border-white rounded-full"></div>
        </div>

        <div className="relative z-10 text-center text-white max-w-md">
          {/* Compact Logo Section */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center mx-auto mb-4">
              <img 
                src="/lovable-uploads/11688d54-d446-4b80-a470-992728ced577.png" 
                alt="HSE Partner Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">YourHSEPartner</h1>
            <p className="text-lg text-green-100 font-medium mb-6">
              Health, Safety & Environment
            </p>
          </div>

          {/* Compact Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm">Safety First</h3>
                <p className="text-xs text-green-100">Complete safety management</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm">Analytics</h3>
                <p className="text-xs text-green-100">Real-time monitoring</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm">Team Collaboration</h3>
                <p className="text-xs text-green-100">Seamless coordination</p>
              </div>
            </div>
          </div>

          {/* Compact Footer */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex items-center justify-center gap-2 text-green-100">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs font-medium">Enterprise Security</span>
            </div>
            <p className="text-xs text-green-200 mt-1">© 2025 YourHSEPartner. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
