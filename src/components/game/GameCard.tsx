import { useState, useRef, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Game } from '../../types';
import { motion } from 'framer-motion';

export default function GameCard({ game }: { game: Game }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const maxRotation = 10;
    
    const rotX = ((y - centerY) / centerY) * -maxRotation;
    const rotY = ((x - centerX) / centerX) * maxRotation;
    
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: isHovered ? 'none' : 'transform 0.5s ease',
      }}
      className="relative group rounded-xl overflow-hidden glass-card cursor-pointer"
    >
      <Link to={`/games/${game.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img 
            src={game.coverUrl} 
            alt={game.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-tech font-bold text-xl text-white tracking-wide mb-1 line-clamp-1">{game.title}</h3>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-neon-red font-sans text-xs font-semibold px-2 py-1 bg-neon-red/10 border border-neon-red/20 rounded">
                {game.genres[0] || 'Unknown'}
              </span>
              <span className="text-gray-300 font-sans text-xs flex items-center">
                <span className="text-yellow-500 mr-1">★</span> {game.rating}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {game.platforms.slice(0, 3).map(p => (
                <span key={p} className="text-[10px] text-gray-400 font-tech uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
