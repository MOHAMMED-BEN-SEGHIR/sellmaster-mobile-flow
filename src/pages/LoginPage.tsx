
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">SellMaster</h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>
        
        <div className="bg-app-card rounded-lg p-6">
          {error && (
            <div className="bg-red-900 bg-opacity-30 border border-red-500 text-white p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="w-full bg-app-lighter text-white pl-10 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Your email"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-400 mt-1 text-sm"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      className="w-full bg-app-lighter text-white pl-10 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Your password"
                    />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-400 mt-1 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full p-3 rounded-lg text-white font-medium ${
                    isSubmitting ? 'bg-gray-500' : 'bg-primary hover:bg-primary-hover'
                  }`}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    Don't have an account? <span className="text-primary cursor-pointer">Contact us</span>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        
        {/* Demo mode login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400 mb-2">For demonstration:</p>
          <button 
            onClick={() => handleSubmit({ email: 'demo@example.com', password: 'password123' })}
            className="py-2 px-4 bg-accent-orange hover:bg-opacity-90 rounded-lg text-white"
          >
            Continue as Demo User
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
