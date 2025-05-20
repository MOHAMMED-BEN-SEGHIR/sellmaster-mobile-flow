
import React, { useState } from 'react';
import Header from '../components/Header';
import SideDrawer from '../components/SideDrawer';
import BottomNavigation from '../components/BottomNavigation';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../utils/helpers';
import { Calendar, CreditCard, TrendingUp, Wallet } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { state: authState } = useAuth();
  const { state: paymentState } = usePayment();
  
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  
  // Sample data for overview cards
  const overviewData = [
    { 
      title: 'Monthly Total', 
      value: paymentState.monthData?.total || 0,
      icon: <Wallet className="text-primary" size={24} />,
      currency: true
    },
    { 
      title: 'This Week', 
      value: paymentState.monthData?.weeks[0]?.total || 0,
      icon: <Calendar className="text-accent-orange" size={24} />,
      currency: true
    },
    { 
      title: 'Transactions', 
      value: 24,
      icon: <CreditCard className="text-accent-yellow" size={24} />,
      currency: false
    },
    { 
      title: 'Growth', 
      value: '+15%',
      icon: <TrendingUp className="text-green-500" size={24} />,
      currency: false
    },
  ];
  
  // Prepare chart data
  const chartData = paymentState.monthData?.weeks.map(week => ({
    name: `Week ${week.weekNumber}`,
    amount: week.total
  })) || [];
  
  return (
    <div className="bg-app-dark min-h-screen pb-20">
      <Header 
        title="Dashboard" 
        onMenuToggle={toggleDrawer}
      />
      
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <nav className="mt-4">
          <ul>
            <li className="mb-2">
              <a href="#" className="block p-2 rounded hover:bg-app-lighter text-white">
                Countries
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block p-2 rounded hover:bg-app-lighter text-white">
                Currencies
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block p-2 rounded hover:bg-app-lighter text-white">
                Languages
              </a>
            </li>
          </ul>
        </nav>
      </SideDrawer>
      
      <main className="p-4">
        {/* User greeting */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Hello, {authState.user?.name || 'User'}
          </h2>
          <p className="text-gray-400">
            Welcome to your dashboard
          </p>
        </div>
        
        {/* Overview cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {overviewData.map((item, index) => (
            <div key={index} className="bg-app-card p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">{item.title}</h3>
                {item.icon}
              </div>
              <p className="text-xl font-bold text-white">
                {item.currency 
                  ? formatCurrency(item.value, authState.user?.preferredCurrency || 'MAD')
                  : item.value}
              </p>
            </div>
          ))}
        </div>
        
        {/* Chart */}
        <div className="bg-app-card p-4 rounded-lg mb-6">
          <h3 className="text-white font-bold mb-4">Weekly Overview</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                <YAxis tick={{ fill: '#9ca3af' }} />
                <Tooltip 
                  formatter={(value: number) => [
                    formatCurrency(value, authState.user?.preferredCurrency || 'MAD'),
                    'Amount'
                  ]}
                />
                <Bar dataKey="amount" fill="#04be94" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Recent activity */}
        <div className="bg-app-card p-4 rounded-lg">
          <h3 className="text-white font-bold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-app-lighter rounded-lg">
                <div>
                  <p className="text-white">Payment #{index + 1}</p>
                  <p className="text-sm text-gray-400">Today at {10 + index}:00 AM</p>
                </div>
                <span className="text-primary font-medium">
                  {formatCurrency(150 * (index + 1), authState.user?.preferredCurrency || 'MAD')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default DashboardPage;
