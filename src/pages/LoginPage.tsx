import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { login, register } from '../firebase/firebase';
import LogoIcon from '../components/LogoIcon';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Handle login
        const result = await login(email, password);
        if (result.error) {
          setError(result.error);
        } else if (result.user) {
          navigate('/profile');
        }
      } else {
        // Handle registration
        const result = await register(email, password);
        if (result.error) {
          setError(result.error);
        } else if (result.user) {
          navigate('/profile');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--primary)]">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center justify-center mb-6">
              <LogoIcon size={60} />
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-[var(--text)]">
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {isLogin
                ? 'Enter your credentials to access your account'
                : 'Fill out the form to create your account'}
            </p>
          </div>

          <div className="mt-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500 bg-opacity-20 text-red-400 p-3 rounded-lg mb-4"
              >
                {error}
              </motion.div>
            )}
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="mb-4">
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-[var(--text-secondary)]" />
                    </div>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none relative block w-full pl-10 pr-3 py-3 bg-[var(--secondary)] placeholder-[var(--text-secondary)] text-[var(--text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      placeholder="Email address"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-[var(--text-secondary)]" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none relative block w-full pl-10 pr-10 py-3 bg-[var(--secondary)] placeholder-[var(--text-secondary)] text-[var(--text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-[var(--text-secondary)] hover:text-[var(--text)]" />
                      ) : (
                        <Eye size={18} className="text-[var(--text-secondary)] hover:text-[var(--text)]" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {isLogin && (
                <div className="flex items-center justify-end">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
                      Forgot your password?
                    </a>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    {isLogin ? (
                      <>
                        <LogIn size={18} className="mr-2" />
                        Sign in
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} className="mr-2" />
                        Sign up
                      </>
                    )}
                  </span>
                )}
              </button>
            </form>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
      
      <footer className="py-4 text-center">
        <p className="text-xs text-[var(--text-secondary)]">
          © {new Date().getFullYear()} CodoSphere. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;