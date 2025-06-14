import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { AuthContext } from '../App';
const LoginPage = () => {
  const {
    user,
    login
  } = useContext(AuthContext);
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
  return <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-600 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">YourHSEPartner</h1>
          <p className="text-gray-600">Professional Inventory Management System</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Enter your credentials to access your account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="h-11" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required className="h-11 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3 text-center">Demo Credentials:</p>
              <div className="space-y-2">
                <Button variant="outline" onClick={() => fillDemoCredentials('admin')} className="w-full justify-start text-left h-auto p-3">
                  <div>
                    <div className="font-medium">Store Manager</div>
                    <div className="text-xs text-gray-500">admin@hsepartner.com</div>
                  </div>
                </Button>
                <Button variant="outline" onClick={() => fillDemoCredentials('hse')} className="w-full justify-start text-left h-auto p-3">
                  <div>
                    <div className="font-medium">HSE Officer</div>
                    <div className="text-xs text-gray-500">hse@hsepartner.com</div>
                  </div>
                </Button>
                <Button variant="outline" onClick={() => fillDemoCredentials('maintenance')} className="w-full justify-start text-left h-auto p-3">
                  <div>
                    <div className="font-medium">Maintenance Team</div>
                    <div className="text-xs text-gray-500">maint@hsepartner.com</div>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">© 2025 YourHSEPartner. All rights reserved.</div>
      </div>
    </div>;
};
export default LoginPage;