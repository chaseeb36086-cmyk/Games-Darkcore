import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Game } from '../types';
import { motion } from 'framer-motion';
import { Download, Monitor, HardDrive, Cpu, MemoryStick } from 'lucide-react';
import ParticleBackground from '../components/layout/ParticleBackground';

export default function GameDetails() {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      if (!id) return;
      try {
        const mockGameData = {
              id: 'mock-1',
              title: 'CYBERPUNK: REDUX',
              developer: 'CD Projekt Red',
              publisher: 'CD Projekt Red',
              releaseDate: '2024-01-01',
              version: '2.1.0',
              genres: ['RPG', 'Action', 'Sci-Fi'],
              platforms: ['PC'],
              rating: 9.5,
              reviewScore: 'Overwhelmingly Positive',
              coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070',
              bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070',
              logoUrl: '',
              screenshots: [
                'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070',
                'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2070'
              ],
              story: 'In the dark future, survival is the only option. Navigate a sprawling metropolis obsessed with power, glamour, and body modification.',
              description: 'A deeply immersive action RPG featuring branching storylines, intense combat, and next-gen visuals.',
              features: ['Next-Gen Ray Tracing', 'Unlimited Modding', 'All DLCs Included'],
              systemRequirements: { 
                minimum: 'OS: Windows 10\nProcessor: Intel Core i5-3570K\nMemory: 8 GB RAM\nGraphics: GTX 970\nStorage: 70 GB', 
                recommended: 'OS: Windows 11\nProcessor: Intel Core i7-4790\nMemory: 16 GB RAM\nGraphics: RTX 2060\nStorage: 70 GB SSD' 
              },
              downloadLinks: [
                { title: 'Download Part 1', url: '#' },
                { title: 'Download Part 2', url: '#' }
              ],
              categories: ['RPG'],
              featured: true,
              trending: true,
              createdAt: Date.now(),
              updatedAt: Date.now()
        };

        if (!db) {
          if (id === 'mock-1') {
            setGame(mockGameData as Game);
          } else {
            setGame(null);
          }
          setLoading(false);
          return;
        }

        const docRef = doc(db, 'games', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGame({ id: docSnap.id, ...docSnap.data() } as Game);
        } else {
          // If mock for preview
          if (id === 'mock-1') {
             setGame(mockGameData as Game);
          }
        }
      } catch (error) {
        console.error("Error fetching game:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-horror text-2xl neon-text">LOADING...</div>;
  if (!game) return <div className="min-h-screen flex items-center justify-center font-horror text-2xl text-red-500">GAME NOT FOUND</div>;

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      
      {/* Banner */}
      <div className="relative h-[60vh] w-full">
        <img src={game.bannerUrl || game.coverUrl} alt={game.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent"></div>
        <div className="absolute inset-0 bg-blood-red/5 mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Column (Cover) */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="md:w-1/3 lg:w-1/4 shrink-0"
          >
            <div className="glass-panel p-2 rounded-xl shadow-[0_0_30px_rgba(201,11,11,0.2)]">
              <img src={game.coverUrl} alt={game.title} className="w-full rounded-lg" />
            </div>
            
            <div className="mt-6 glass-panel rounded-xl p-6">
              <h3 className="font-tech text-white uppercase tracking-widest text-lg mb-4 border-b border-white/10 pb-2">Information</h3>
              <div className="space-y-3 text-sm font-sans">
                <div className="flex justify-between"><span className="text-gray-400">Developer</span><span className="text-white text-right">{game.developer}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Publisher</span><span className="text-white text-right">{game.publisher}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Release Date</span><span className="text-white">{game.releaseDate}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Version</span><span className="text-white">{game.version}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Rating</span><span className="text-neon-red font-bold">{game.rating} / 10</span></div>
              </div>
            </div>
          </motion.div>

          {/* Right Column (Details) */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="md:w-2/3 lg:w-3/4"
          >
            <h1 className="font-horror text-4xl md:text-6xl font-black text-white uppercase tracking-wider mb-2 text-shadow-md">
              {game.title}
            </h1>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {game.genres.map(g => (
                <span key={g} className="text-xs font-tech tracking-widest uppercase bg-white/5 border border-white/10 px-3 py-1 rounded text-gray-300">
                  {g}
                </span>
              ))}
            </div>

            <div className="mb-12">
              <h2 className="font-tech text-2xl text-white uppercase tracking-widest mb-4 flex items-center">
                <span className="w-2 h-6 bg-blood-red mr-3"></span>
                Storyline
              </h2>
              <p className="text-gray-300 font-sans leading-relaxed text-lg">
                {game.story}
              </p>
            </div>

            {/* Screenshots */}
            {game.screenshots && game.screenshots.length > 0 && (
              <div className="mb-12">
                <h2 className="font-tech text-2xl text-white uppercase tracking-widest mb-6 flex items-center">
                  <span className="w-2 h-6 bg-blood-red mr-3"></span>
                  Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {game.screenshots.map((shot, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-colors">
                      <img src={shot} alt={`Screenshot ${idx + 1}`} className="w-full h-auto" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Requirements */}
            <div className="mb-12">
              <h2 className="font-tech text-2xl text-white uppercase tracking-widest mb-6 flex items-center">
                <span className="w-2 h-6 bg-blood-red mr-3"></span>
                System Requirements
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-xl">
                  <h3 className="font-tech text-gray-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Minimum</h3>
                  <pre className="text-sm font-sans text-gray-300 whitespace-pre-wrap">{game.systemRequirements?.minimum || 'TBA'}</pre>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-blood-red/20 bg-gradient-to-br from-black/40 to-blood-red/5">
                  <h3 className="font-tech text-white uppercase tracking-widest mb-4 border-b border-blood-red/30 pb-2">Recommended</h3>
                  <pre className="text-sm font-sans text-gray-200 whitespace-pre-wrap">{game.systemRequirements?.recommended || 'TBA'}</pre>
                </div>
              </div>
            </div>

            {/* Download Section */}
            <div className="mb-8 glass-panel rounded-xl p-8 border border-neon-red/30 shadow-[0_0_40px_rgba(201,11,11,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blood-red/10 blur-[100px] rounded-full"></div>
              
              <h2 className="font-horror text-3xl text-white mb-6 flex items-center">
                <Download className="w-8 h-8 text-neon-red mr-4" />
                DOWNLOAD LINKS
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {game.downloadLinks?.map((link, idx) => (
                  <a 
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-blood-red/10 border border-blood-red/30 hover:border-neon-red hover:bg-blood-red/20 p-4 rounded-lg flex items-center justify-between transition-all duration-300 shadow-[0_0_15px_rgba(201,11,11,0.1)] hover:shadow-[0_0_20px_rgba(255,26,26,0.3)]"
                  >
                    <span className="font-tech text-white uppercase tracking-widest font-bold text-lg">{link.title}</span>
                    <Download className="w-6 h-6 text-neon-red group-hover:scale-110 transition-transform" />
                  </a>
                ))}
                {(!game.downloadLinks || game.downloadLinks.length === 0) && (
                  <p className="text-gray-500 italic">Links are being updated.</p>
                )}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
