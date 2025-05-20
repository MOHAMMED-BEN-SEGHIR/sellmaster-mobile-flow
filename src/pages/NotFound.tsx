
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-app-dark flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-6">Page Not Found</p>
      <Link to="/" className="px-6 py-3 bg-primary text-white font-medium rounded-lg">
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
