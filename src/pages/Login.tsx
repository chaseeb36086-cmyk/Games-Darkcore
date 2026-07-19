import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!auth) {
        setError('Firebase is not configured. Please set your credentials in the environment.');
        setLoading(false);
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.email === 'chaseeb.360.86@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blood-red/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-red/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10 p-8 glass-panel rounded-2xl border-t border-white/10 shadow-[0_0_50px_rgba(201,11,11,0.1)] relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-red to-transparent opacity-50 rounded-t-2xl"></div>
        
        <div className="text-center mb-10">
          <h2 className="font-horror text-3xl font-bold tracking-widest text-white mb-2">SIGN IN</h2>
          <p className="text-gray-400 font-sans text-sm">Access your Dark Core account</p>
        </div>

        {error && (
          <div className="bg-blood-red/20 border border-blood-red/50 text-red-200 px-4 py-3 rounded mb-6 text-sm font-sans text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-400 font-tech uppercase tracking-wider text-xs mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-red/50 focus:ring-1 focus:ring-neon-red/50 transition-all font-sans"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-tech uppercase tracking-wider text-xs mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-red/50 focus:ring-1 focus:ring-neon-red/50 transition-all font-sans"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blood-red hover:bg-neon-red text-white font-tech uppercase tracking-widest py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(201,11,11,0.3)] hover:shadow-[0_0_30px_rgba(255,26,26,0.5)] mt-4 relative overflow-hidden group"
          >
            <span className="relative z-10">{loading ? 'Authenticating...' : 'Sign In'}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
