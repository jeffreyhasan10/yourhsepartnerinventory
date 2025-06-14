
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
  User
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
    { title: 'Dashboard', path: '/', icon: Home },
    { title: 'PPE Inventory', path: '/ppe', icon: Shield },
    { title: 'Chemicals', path: '/chemicals', icon: Beaker },
    { title: 'General Store', path: '/general-store', icon: Archive },
    { title: 'Stock Management', path: '/inventory', icon: Package },
    { title: 'Reports & Analytics', path: '/reports', icon: BarChart2 },
    { title: 'Alerts & Expiry', path: '/alerts', icon: AlertTriangle },
    { title: 'User Management', path: '/users', icon: Users },
    { title: 'Settings', path: '/settings', icon: Settings },
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
          className="bg-white shadow-lg border-gray-200"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:relative md:translate-x-0 flex flex-col h-full`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-green-600 rounded-xl shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">YourHSEPartner</span>
              <p className="text-xs text-gray-500 mt-0.5">Inventory Management</p>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 ${
                isActive(item.path) 
                  ? 'bg-green-50 text-green-700 font-semibold shadow-sm border-l-4 border-green-600' 
                  : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className={`h-5 w-5 transition-colors ${
                isActive(item.path) ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-700'
              }`} />
              <span className="font-medium">{item.title}</span>
              
              {isActive(item.path) && (
                <div className="ml-auto">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-white shadow-sm">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full mt-3 justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Backdrop Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
