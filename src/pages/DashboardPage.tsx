
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Calendar, Settings, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Card } from '../components/ui/card';
import SideDrawer from '../components/SideDrawer';
import BottomNavigation from '../components/BottomNavigation';
import { useIsMobile } from '../hooks/use-mobile';
import { getCurrencySymbol } from '../lib/utils';

const DashboardPage = () => {
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Demo data
  const currentMonthPayments = 4850;
  const lastMonthPayments = 3200;
  const monthlyChange = ((currentMonthPayments - lastMonthPayments) / lastMonthPayments) * 100;
  const upcomingDueCount = 3;
  const activeCustomerCount = 12;
  
  const currencyCode = authState.user?.preferredCurrency || 'MAD';
  const currencySymbol = getCurrencySymbol(currencyCode);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  const quickActions = [
    { 
      name: 'Payments', 
      icon: <Calendar size={28} className="text-primary" />,
      onClick: () => navigate('/payments')
    },
    { 
      name: 'Customers', 
      icon: <Users size={28} className="text-primary" />,
      onClick: () => {}
    },
    { 
      name: 'Settings', 
      icon: <Settings size={28} className="text-primary" />,
      onClick: () => navigate('/settings')
    }
  ];
  
  const stats = [
    {
      title: 'Monthly Income',
      value: `${currencySymbol} ${currentMonthPayments.toLocaleString()}`,
      change: monthlyChange.toFixed(1),
      positive: monthlyChange > 0
    },
    {
      title: 'Upcoming Payments',
      value: upcomingDueCount.toString(),
      label: 'Due soon'
    },
    {
      title: 'Active Customers',
      value: activeCustomerCount.toString(),
      label: 'This month'
    }
  ];

  return (
    <div className="min-h-screen bg-app-dark text-white">
      <SideDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} children={null} />
      
      <div className="flex flex-col h-screen">
        <Header 
          title="Dashboard" 
          onMenuToggle={toggleDrawer}
        />
        
        <main className="flex-1 p-4 pb-16 overflow-y-auto">
          {/* Welcome section */}
          <section className="mb-6">
            <h2 className="text-xl font-medium">
              Welcome back, {authState.user?.name || 'User'}
            </h2>
            <p className="text-gray-400">
              {authState.currentWorkspace?.name || 'Your workspace'}
            </p>
          </section>
          
          {/* Stats cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-app-card p-4 border-none">
                <h3 className="text-sm text-gray-400">{stat.title}</h3>
                <p className="text-2xl font-medium mt-2">{stat.value}</p>
                {stat.change && (
                  <span className={`text-xs ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.positive ? '+' : ''}{stat.change}%
                  </span>
                )}
                {stat.label && (
                  <span className="text-xs text-gray-400">
                    {stat.label}
                  </span>
                )}
              </Card>
            ))}
          </section>
          
          {/* Quick actions */}
          <section className="mb-6">
            <h3 className="text-lg mb-3">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Card 
                  key={index} 
                  className="bg-app-card border-none cursor-pointer hover:bg-opacity-80 transition-all"
                  onClick={action.onClick}
                >
                  <div className="flex flex-col items-center p-4">
                    {action.icon}
                    <span className="mt-2 text-sm text-gray-300">{action.name}</span>
                  </div>
                </Card>
              ))}
            </div>
          </section>
          
          {/* Chart placeholder */}
          <section>
            <Card className="bg-app-card p-4 border-none">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Payment Activity</h3>
                <span className="text-xs text-gray-400">Last 30 days</span>
              </div>
              <div className="flex items-center justify-center h-48 bg-app-lighter rounded-md">
                <BarChart size={32} className="text-gray-500" />
              </div>
            </Card>
          </section>
        </main>
        
        {isMobile && (
          <BottomNavigation />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
