
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
  ChevronRight,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthContext } from '../App';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import NotificationCenter from './common/NotificationCenter';

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
    { title: 'Dashboard', path: '/', icon: Home, description: 'System Overview' },
    { title: 'PPE Inventory', path: '/ppe', icon: Shield, description: 'Safety Equipment' },
    { title: 'Chemicals', path: '/chemicals', icon: Beaker, description: 'Chemical Management' },
    { title: 'General Store', path: '/general-store', icon: Archive, description: 'Supplies & Equipment' },
    { title: 'Stock Management', path: '/inventory', icon: Package, description: 'Inventory Control' },
    { title: 'Reports & Analytics', path: '/reports', icon: BarChart2, description: 'Data Insights' },
    { title: 'Safety Alerts', path: '/alerts', icon: AlertTriangle, description: 'Alert Management' },
    { title: 'User Management', path: '/users', icon: Users, description: 'Access Control' },
    { title: 'Settings', path: '/settings', icon: Settings, description: 'System Settings' },
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
          className="bg-white shadow-md border-gray-200 hover:bg-gray-50"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-100 shadow-xl transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:relative md:translate-x-0 flex flex-col h-full`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-50 bg-gradient-to-r from-green-50 to-emerald-50">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg bg-white p-1">
              <img 
                src="/lovable-uploads/11688d54-d446-4b80-a470-992728ced577.png" 
                alt="HSE Partner Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">YourHSEPartner</span>
              <p className="text-xs text-green-600 font-medium">Health, Safety & Environment</p>
            </div>
          </Link>
        </div>

        {/* User Profile Card */}
        <div className="px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-green-700 font-medium truncate">{user?.role}</p>
              <div className="flex items-center mt-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
            <NotificationCenter />
          </div>
        </div>

        {/* Navigation Menu */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path) 
                    ? 'bg-green-50 text-green-700 border-l-3 border-green-600 shadow-sm' 
                    : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive(item.path) 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
                  }`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-medium text-sm">{item.title}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  </div>
                </div>
                
                {isActive(item.path) ? (
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                )}
              </Link>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-gray-50 bg-gray-25">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white shadow-sm border border-gray-100 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-gray-900">{user?.name}</p>
              <p className="text-xs text-green-600 truncate font-medium">{user?.role}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Backdrop Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
