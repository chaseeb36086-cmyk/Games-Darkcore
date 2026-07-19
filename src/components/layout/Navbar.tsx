import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { Search, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const navLinks = [
    { name: 'Latest Games', path: '/?filter=latest' },
    { name: 'Trending', path: '/?filter=trending' },
    { name: 'Popular', path: '/?filter=popular' },
    { name: 'Top Rated', path: '/?filter=top-rated' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-blood-red/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group relative">
            <div className="absolute inset-0 bg-neon-red/20 blur-xl rounded-full group-hover:bg-neon-red/40 transition-all duration-500"></div>
            <h1 className="font-horror text-3xl font-black tracking-wider text-red-600 neon-text relative z-10 flex items-center">
              <span className="text-white metallic-text mr-1">DARK</span>
              CORE
            </h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-300 hover:text-white hover:neon-text font-tech text-sm uppercase tracking-widest transition-all duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blood-red transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Nav */}
          <div className="flex items-center space-x-6">
            <button className="text-gray-400 hover:text-neon-red transition-colors duration-300">
              <Search className="w-5 h-5" />
            </button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-blood-red transition-colors duration-300 flex items-center space-x-2 font-tech text-sm uppercase tracking-wider"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-5 py-2 rounded-full border border-blood-red/30 bg-blood-red/5 hover:bg-blood-red/20 text-white font-tech tracking-wider text-sm transition-all duration-300 shadow-[0_0_15px_rgba(201,11,11,0.15)] hover:shadow-[0_0_20px_rgba(201,11,11,0.3)]"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
