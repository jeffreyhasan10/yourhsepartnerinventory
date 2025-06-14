
import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Shield, 
  Beaker, 
  Archive, 
  BarChart2, 
  Menu, 
  X,
  Settings,
  Users,
  AlertTriangle,
  LogOut,
  User,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthContext } from '../App';
import { toast } from 'sonner';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { title: 'Dashboard', path: '/', icon: Home, description: 'Overview & Analytics' },
    { title: 'PPE Inventory', path: '/ppe', icon: Shield, description: 'Personal Protective Equipment' },
    { title: 'Chemicals', path: '/chemicals', icon: Beaker, description: 'Chemical Storage & Safety' },
    { title: 'General Store', path: '/general-store', icon: Archive, description: 'General Supplies & Equipment' },
    { title: 'Stock Management', path: '/inventory', icon: Package, description: 'Inventory Operations' },
    { title: 'Reports & Analytics', path: '/reports', icon: BarChart2, description: 'Data & Insights' },
    { title: 'Alerts & Expiry', path: '/alerts', icon: AlertTriangle, description: 'Safety Notifications' },
    { title: 'User Management', path: '/users', icon: Users, description: 'Access Control' },
    { title: 'Settings', path: '/settings', icon: Settings, description: 'System Configuration' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Navigation Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button 
          onClick={toggleSidebar} 
          variant="outline"
          size="sm"
          className="bg-white shadow-lg border-gray-200 hover:bg-gray-50"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200 shadow-2xl transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:relative md:translate-x-0 flex flex-col h-full`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-green-100">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-3 bg-green-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">YourHSEPartner</span>
              <p className="text-xs text-green-700 mt-1 font-medium">Professional Inventory Management</p>
            </div>
          </Link>
        </div>

        {/* User Info Badge */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-green-600 font-medium">{user?.role}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] ${
                isActive(item.path) 
                  ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 font-semibold shadow-md border-l-4 border-green-600' 
                  : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:shadow-sm'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg transition-colors ${
                  isActive(item.path) 
                    ? 'bg-green-200 text-green-700' 
                    : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
                }`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-medium text-sm">{item.title}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                </div>
              </div>
              
              {isActive(item.path) ? (
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></div>
                </div>
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-white shadow-sm border border-gray-100 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-gray-900">{user?.name}</p>
              <p className="text-xs text-green-600 truncate font-medium">{user?.role}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-all"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Backdrop Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
