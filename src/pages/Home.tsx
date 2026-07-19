import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Game } from '../types';
import GameCard from '../components/game/GameCard';
import ParticleBackground from '../components/layout/ParticleBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [trendingGames, setTrendingGames] = useState<Game[]>([]);
  const [latestGames, setLatestGames] = useState<Game[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // If no games in DB, use some mock data for preview
        const mockGames: Game[] = [
          {
            id: 'mock-1',
            title: 'CYBERPUNK: REDUX',
            developer: 'CDPR',
            publisher: 'CDPR',
            releaseDate: '2024-01-01',
            version: '2.1',
            genres: ['RPG', 'Action'],
            platforms: ['PC', 'PS5'],
            rating: 9.5,
            reviewScore: 'Overwhelmingly Positive',
            coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
            bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
            logoUrl: '',
            screenshots: [],
            story: 'A dark future awaits.',
            description: '',
            features: [],
            systemRequirements: { minimum: '', recommended: '' },
            downloadLinks: [],
            categories: ['RPG'],
            featured: true,
            trending: true,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
        ];

        if (!db) {
          console.warn("Firestore not configured. Using mock data.");
          setTrendingGames(mockGames);
          setLatestGames(mockGames);
          return;
        }

        const gamesRef = collection(db, 'games');
        
        // Fetch trending
        const trendingQuery = query(gamesRef, orderBy('rating', 'desc'), limit(5));
        const trendingSnapshot = await getDocs(trendingQuery);
        const trendingData = trendingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Game);
        
        if (trendingData.length === 0) {
          setTrendingGames(mockGames);
          setLatestGames(mockGames);
        } else {
          setTrendingGames(trendingData);
          setLatestGames(trendingData); // In a real app, query by createdAt
        }
        } catch (error: any) {
          console.error("Error fetching games:", error);
          if (error.code === 'permission-denied') {
            console.warn("Permission denied. Ensure Firestore security rules are deployed.");
          }
          // Use mock data as fallback for preview if it fails
          const mockGames: Game[] = [
            {
              id: 'mock-1',
              title: 'CYBERPUNK: REDUX',
              developer: 'CDPR',
              publisher: 'CDPR',
              releaseDate: '2024-01-01',
              version: '2.1',
              genres: ['RPG', 'Action'],
              platforms: ['PC', 'PS5'],
              rating: 9.5,
              reviewScore: 'Overwhelmingly Positive',
              coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
              bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
              logoUrl: '',
              screenshots: [],
              story: 'A dark future awaits.',
              description: '',
              features: [],
              systemRequirements: { minimum: '', recommended: '' },
              downloadLinks: [],
              categories: ['RPG'],
              featured: true,
              trending: true,
              createdAt: Date.now(),
              updatedAt: Date.now()
            }
          ];
          setTrendingGames(mockGames);
          setLatestGames(mockGames);
        } finally {
          setLoading(false);
        }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    if (trendingGames.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % trendingGames.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [trendingGames]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center font-horror text-3xl neon-text animate-pulse">LOADING CORE...</div>;
  }

  const heroGame = trendingGames[currentHeroIndex];

  return (
    <div className="relative w-full">
      <ParticleBackground />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {heroGame && (
            <motion.div
              key={heroGame.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img 
                src={heroGame.bannerUrl} 
                alt={heroGame.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/80 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-blood-red/10 mix-blend-overlay"></div>
              
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <motion.div 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="max-w-2xl"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="bg-neon-red text-white text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-sm">Featured</span>
                      <span className="text-gray-400 text-sm font-tech tracking-wider uppercase">{heroGame.genres.join(' • ')}</span>
                    </div>
                    
                    <h2 className="font-horror text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-wider text-shadow-lg leading-tight">
                      {heroGame.title}
                    </h2>
                    
                    <p className="text-gray-300 font-sans text-lg mb-8 line-clamp-3 leading-relaxed max-w-xl">
                      {heroGame.story || "Experience the ultimate gaming adventure. Download now and dive into the darkness."}
                    </p>
                    
                    <div className="flex items-center space-x-6">
                      <Link 
                        to={`/games/${heroGame.id}`}
                        className="group flex items-center space-x-2 bg-blood-red hover:bg-neon-red text-white px-8 py-4 rounded-sm font-tech font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(201,11,11,0.4)]"
                      >
                        <span>Download Now</span>
                        <Play className="w-4 h-4 fill-current group-hover:scale-125 transition-transform" />
                      </Link>
                      
                      <div className="flex space-x-2">
                        {trendingGames.map((_, idx) => (
                          <button 
                            key={idx}
                            onClick={() => setCurrentHeroIndex(idx)}
                            className={`h-1.5 transition-all duration-300 rounded-full ${idx === currentHeroIndex ? 'w-8 bg-neon-red shadow-[0_0_10px_rgba(255,26,26,0.8)]' : 'w-2 bg-gray-600 hover:bg-gray-400'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        
        {/* Trending Section */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-10 border-b border-white/5 pb-4">
            <div>
              <h2 className="font-tech text-3xl font-bold text-white uppercase tracking-widest flex items-center">
                <span className="w-2 h-8 bg-neon-red mr-4 shadow-[0_0_10px_rgba(255,26,26,0.6)]"></span>
                Latest Additions
              </h2>
            </div>
            <Link to="/?filter=latest" className="text-gray-400 hover:text-neon-red font-tech uppercase tracking-wider text-sm flex items-center transition-colors">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {latestGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
        
      </div>
    </div>
  );
}
