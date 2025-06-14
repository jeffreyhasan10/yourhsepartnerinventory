
import React from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CRMProvider } from "./contexts/CRMContext";
import { StatisticsProvider } from "./contexts/StatisticsContext";
import { AppSettingsProvider } from "./contexts/AppSettingsContext";
import { trackPageView } from "./utils/analytics";
import LoginPage from "./pages/LoginPage";
import Index from "./pages/Index";
import PPEInventoryPage from "./pages/PPEInventoryPage";
import ChemicalsPage from "./pages/ChemicalsPage";
import GeneralStorePage from "./pages/GeneralStorePage";
import InventoryPage from "./pages/InventoryPage";
import StatsPage from "./pages/StatsPage";
import AlertsPage from "./pages/AlertsPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

// Authentication context
interface AuthUser {
  email: string;
  role: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
});

// Demo credentials
const demoCredentials = [
  { email: 'admin@hsepartner.com', password: 'admin123', role: 'Store Manager', name: 'John Smith' },
  { email: 'hse@hsepartner.com', password: 'hse123', role: 'HSE Officer', name: 'Sarah Johnson' },
  { email: 'maint@hsepartner.com', password: 'maint123', role: 'Maintenance Team', name: 'Mike Wilson' },
];

// Define routes configuration
const protectedRoutes = [
  { path: "/", element: <Index /> },
  { path: "/dashboard", element: <Navigate to="/" replace /> },
  { path: "/ppe", element: <PPEInventoryPage /> },
  { path: "/chemicals", element: <ChemicalsPage /> },
  { path: "/general-store", element: <GeneralStorePage /> },
  { path: "/inventory", element: <InventoryPage /> },
  { path: "/reports", element: <StatisticsProvider><StatsPage /></StatisticsProvider> },
  { path: "/alerts", element: <AlertsPage /> },
  { path: "/users", element: <UsersPage /> },
  { path: "/settings", element: <SettingsPage /> },
  { path: "*", element: <NotFound /> }
];

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = JSON.parse(localStorage.getItem('hsepartner_user') || 'null');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Auth Provider Component
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('hsepartner_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const credential = demoCredentials.find(
      cred => cred.email === email && cred.password === password
    );
    
    if (credential) {
      const user = { email: credential.email, role: credential.role, name: credential.name };
      setUser(user);
      localStorage.setItem('hsepartner_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hsepartner_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Router change handler component
const RouterChangeHandler = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const currentPath = window.location.pathname;
    const pageName = currentPath === '/' ? 'dashboard' : currentPath.replace(/^\//, '');
    trackPageView(pageName);
  }, [location.pathname]);
  
  return null;
};

// Main App component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppSettingsProvider>
        <AuthProvider>
          <CRMProvider>
            <BrowserRouter>
              <TooltipProvider>
                <RouterChangeHandler />
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  {protectedRoutes.map((route) => (
                    <Route 
                      key={route.path} 
                      path={route.path} 
                      element={
                        <ProtectedRoute>
                          {route.element}
                        </ProtectedRoute>
                      } 
                    />
                  ))}
                </Routes>
              </TooltipProvider>
            </BrowserRouter>
          </CRMProvider>
        </AuthProvider>
      </AppSettingsProvider>
    </QueryClientProvider>
  );
};

export default App;
