
import React, { useState, useEffect } from 'react';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Icons based on type
  const icons = {
    success: <CheckCircle className="text-green-400" size={20} />,
    error: <AlertCircle className="text-red-400" size={20} />,
    info: <AlertCircle className="text-blue-400" size={20} />,
  };

  // Background colors based on type
  const bgColors = {
    success: 'bg-green-900 bg-opacity-30 border-green-500',
    error: 'bg-red-900 bg-opacity-30 border-red-500',
    info: 'bg-blue-900 bg-opacity-30 border-blue-500',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to finish
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed bottom-20 left-0 right-0 mx-auto w-11/12 max-w-md p-3 rounded-lg border 
                 ${bgColors[type]} flex items-center justify-between
                 transform transition-all duration-300 ${
                   isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                 }`}
    >
      <div className="flex items-center">
        {icons[type]}
        <span className="ml-2 text-white">{message}</span>
      </div>
      <button onClick={() => setIsVisible(false)} className="text-white p-1">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
