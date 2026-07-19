import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-bg/80 backdrop-blur-md mt-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blood-red to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <h2 className="font-horror text-2xl font-black tracking-wider text-red-600 neon-text flex items-center">
                <span className="text-white metallic-text mr-1">DARK</span>
                CORE
              </h2>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm font-sans leading-relaxed">
              The ultimate premium destination for AAA PC gaming. Immerse yourself in the dark, discover trending titles, and experience gaming at its absolute peak.
            </p>
          </div>
          
          <div>
            <h3 className="font-tech text-white uppercase tracking-widest text-lg mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm text-gray-400 font-sans">
              <li><Link to="/?filter=latest" className="hover:text-neon-red transition-colors">Latest Games</Link></li>
              <li><Link to="/?filter=trending" className="hover:text-neon-red transition-colors">Trending</Link></li>
              <li><Link to="/categories" className="hover:text-neon-red transition-colors">Categories</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-tech text-white uppercase tracking-widest text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400 font-sans">
              <li><Link to="/about" className="hover:text-neon-red transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-neon-red transition-colors">Contact</Link></li>
              <li><Link to="/dmca" className="hover:text-neon-red transition-colors">DMCA</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs font-sans">
            &copy; {new Date().getFullYear()} DARK CORE. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-xs text-gray-500 font-sans">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
