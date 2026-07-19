import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10">
        <span className="font-horror text-[40vw] text-blood-red blur-sm select-none">404</span>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 text-center"
      >
        <h1 className="font-horror text-6xl md:text-8xl text-white mb-6 neon-text tracking-widest">VOID</h1>
        <p className="text-gray-400 font-sans text-lg mb-8 max-w-md mx-auto">The sector you are looking for has been expunged from the core database.</p>
        <Link 
          to="/" 
          className="inline-block border border-blood-red/50 bg-blood-red/10 hover:bg-blood-red/30 text-white font-tech uppercase tracking-widest py-3 px-8 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,11,11,0.4)]"
        >
          Return to Core
        </Link>
      </motion.div>
    </div>
  );
}
