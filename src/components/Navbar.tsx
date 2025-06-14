
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Shield, 
  Beaker, 
  Archive, 
  BarChart2, 
  Menu, 
  X,
  ChevronRight,
  Settings,
  Users,
  FileText,
  AlertTriangle
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { title: 'Dashboard', path: '/', icon: Home },
    { title: 'PPE Inventory', path: '/ppe', icon: Shield },
    { title: 'Chemicals', path: '/chemicals', icon: Beaker },
    { title: 'General Store', path: '/general-store', icon: Archive },
    { title: 'Stock Management', path: '/inventaire', icon: Package },
    { title: 'Reports & Analytics', path: '/statistiques', icon: BarChart2 },
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
        <button 
          onClick={toggleSidebar} 
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all active:scale-95"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:relative md:translate-x-0 flex flex-col h-full overflow-y-auto`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800">StoreKeep Pro</span>
          </Link>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${
                isActive(item.path) 
                  ? 'bg-green-50 text-green-700 font-medium border-l-4 border-green-600' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-green-600' : 'text-gray-500'}`} />
              <span>{item.title}</span>
              
              {isActive(item.path) && (
                <div className="ml-auto flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  <ChevronRight className="h-4 w-4 text-green-600 ml-1" />
                </div>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-green-700">SM</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-gray-800">Store Manager</p>
              <p className="text-xs text-gray-500 truncate">admin@inventory.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;
