import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Calendar, Swords, BookOpen, Trophy, BarChart2, Home, Mail, LogOut, Menu, X, ChevronDown, MoreHorizontal } from 'lucide-react';
import LogoIcon from './LogoIcon';
import { useAuth } from '../context/AuthContext';
import { logout } from '../firebase/firebase';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Main navigation links - reduced to have more space
  const mainNavLinks = [
    { name: 'Code', path: '/code', icon: <Code size={22} /> },
    { name: 'Daily Question', path: '/question-of-the-day', icon: <Calendar size={22} /> },
    { name: 'Ranked Match', path: '/ranked-match', icon: <Swords size={22} /> },
  ];

  // Links moved to dropdown
  const dropdownLinks = [
    { name: 'Study', path: '/study', icon: <BookOpen size={20} /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={20} /> },
    { name: 'Stats', path: '/stats', icon: <BarChart2 size={20} /> },
    { name: 'Home', path: '/profile', icon: <Home size={20} /> },
    { name: 'Contact Us', path: '/contact', icon: <Mail size={20} /> },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-[var(--secondary)] backdrop-blur-md bg-opacity-80 shadow-lg py-6 sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-3 click-animate hover:scale-105 transition-transform"
        >
          <LogoIcon />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]">
            CodoSphere
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-14">
          {mainNavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="click-animate flex items-center gap-2 text-base font-medium transition-colors hover:text-[var(--accent)] relative overflow-hidden group"
            >
              <span className="group-hover:scale-110 transition-transform">
                {link.icon}
              </span>
              <span>{link.name}</span>
              {location.pathname === link.path && (
                <motion.div
                  className="h-1 w-full bg-[var(--accent)] absolute -bottom-1 left-0"
                  layoutId="navbar-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}

          {/* Dropdown for Other links */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="click-animate flex items-center gap-2 text-base font-medium transition-colors hover:text-[var(--accent)]"
            >
              <MoreHorizontal size={22} />
              <span>More</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-[var(--secondary)] rounded-lg shadow-lg overflow-hidden z-20 border border-white/10"
                >
                  {dropdownLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2 p-3 hover:bg-[var(--primary)] transition-colors ${
                        location.pathname === link.path ? 'text-[var(--accent)]' : 'text-[var(--text)]'
                      }`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  ))}
                  
                  {currentUser && (
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 p-3 w-full text-left hover:bg-[var(--primary)] transition-colors text-[var(--text)]"
                    >
                      <LogOut size={20} />
                      <span>Sign out</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {currentUser ? (
          <button 
            className="click-animate hidden md:flex items-center gap-1.5 text-base font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors"
            onClick={handleSignOut}
          >
            <LogOut size={22} />
            <span>Sign out</span>
          </button>
        ) : (
          <Link 
            to="/login"
            className="click-animate hidden md:flex items-center gap-1.5 text-base font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors"
          >
            <span>Sign in</span>
          </Link>
        )}
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-[var(--text)] p-2 rounded-lg hover:bg-[var(--accent)] hover:bg-opacity-10 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-[var(--secondary)] bg-opacity-95 backdrop-blur-md"
          >
            <div className="container-custom py-4 flex flex-col space-y-4">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 py-3 px-4 rounded-lg transition-colors ${
                    location.pathname === link.path 
                      ? 'bg-[var(--accent)] bg-opacity-20 text-[var(--accent)]' 
                      : 'text-[var(--text)] hover:bg-[var(--accent)] hover:bg-opacity-10'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}

              <div className="h-px bg-white/10 my-2"></div>
              
              {dropdownLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 py-3 px-4 rounded-lg transition-colors ${
                    location.pathname === link.path 
                      ? 'bg-[var(--accent)] bg-opacity-20 text-[var(--accent)]' 
                      : 'text-[var(--text)] hover:bg-[var(--accent)] hover:bg-opacity-10'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
              
              {currentUser ? (
                <button 
                  className="flex items-center gap-2 py-3 px-4 text-[var(--text)] hover:text-[var(--accent)]"
                  onClick={handleSignOut}
                >
                  <LogOut size={20} />
                  <span>Sign out</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 py-3 px-4 text-[var(--text)] hover:text-[var(--accent)]"
                >
                  <LogOut size={20} />
                  <span>Sign in</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;