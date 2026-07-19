import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Game } from '../types';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Game>>({
    title: '', developer: '', publisher: '', releaseDate: '', version: '',
    genres: [], platforms: [], rating: 0, story: '', description: '',
    coverUrl: '', bannerUrl: '', downloadLinks: [], screenshots: [],
    systemRequirements: { minimum: '', recommended: '' }
  });

  const addDownloadLink = () => {
    setFormData(prev => ({
      ...prev,
      downloadLinks: [...(prev.downloadLinks || []), { title: `Part ${(prev.downloadLinks?.length || 0) + 1}`, url: '' }]
    }));
  };

  const updateDownloadLink = (index: number, field: 'title' | 'url', value: string) => {
    const newLinks = [...(formData.downloadLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData(prev => ({ ...prev, downloadLinks: newLinks }));
  };

  const removeDownloadLink = (index: number) => {
    const newLinks = [...(formData.downloadLinks || [])];
    newLinks.splice(index, 1);
    setFormData(prev => ({ ...prev, downloadLinks: newLinks }));
  };

  const addScreenshot = () => {
    setFormData(prev => ({
      ...prev,
      screenshots: [...(prev.screenshots || []), '']
    }));
  };

  const updateScreenshot = (index: number, value: string) => {
    const newScreenshots = [...(formData.screenshots || [])];
    newScreenshots[index] = value;
    setFormData(prev => ({ ...prev, screenshots: newScreenshots }));
  };

  const removeScreenshot = (index: number) => {
    const newScreenshots = [...(formData.screenshots || [])];
    newScreenshots.splice(index, 1);
    setFormData(prev => ({ ...prev, screenshots: newScreenshots }));
  };

  const fetchGames = async () => {
    setLoading(true);
    try {
      if (!db) {
        setGames([]);
        setLoading(false);
        return;
      }
      const querySnapshot = await getDocs(collection(db, 'games'));
      const gamesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
      setGames(gamesData);
    } catch (error: any) {
      console.error("Error fetching games:", error);
      if (error.code === 'permission-denied') {
        alert("Permission denied. Please ensure you have deployed the Firestore Security Rules to your Firebase project:\n\n1. Go to Firebase Console -> Firestore -> Rules\n2. Copy the contents of firestore.rules from this project\n3. Paste and Publish");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      if (!db) {
        alert("Firebase is not configured. Please set up Firebase environment variables.");
        setUploading(false);
        return;
      }

      if (formData.id) {
        const gameRef = doc(db, 'games', formData.id);
        const updatedGame = {
          ...formData,
          updatedAt: Date.now()
        };
        await updateDoc(gameRef, updatedGame);
      } else {
        const newGame = {
          ...formData,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        await addDoc(collection(db, 'games'), newGame);
      }

      setIsAdding(false);
      setFormData({
        title: '', developer: '', publisher: '', releaseDate: '', version: '',
        genres: [], platforms: [], rating: 0, story: '', description: '',
        coverUrl: '', bannerUrl: '', downloadLinks: [], screenshots: [],
        systemRequirements: { minimum: '', recommended: '' }
      });
      fetchGames();
    } catch (error: any) {
      console.error("Error saving game:", error);
      if (error.code === 'permission-denied') {
        alert("Permission denied. Ensure your Firestore rules allow the admin email to write.");
      } else {
        alert("Error saving game");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (game: Game) => {
    setFormData(game);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      await deleteDoc(doc(db, 'games', id));
      fetchGames();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-4">
        <h1 className="font-horror text-4xl text-white">CORE COMMAND</h1>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) {
              setFormData({
                title: '', developer: '', publisher: '', releaseDate: '', version: '',
                genres: [], platforms: [], rating: 0, story: '', description: '',
                coverUrl: '', bannerUrl: '', downloadLinks: [], screenshots: [],
                systemRequirements: { minimum: '', recommended: '' }
              });
            }
          }}
          className="bg-blood-red hover:bg-neon-red text-white px-6 py-2 rounded font-tech tracking-widest uppercase transition-colors flex items-center shadow-[0_0_15px_rgba(201,11,11,0.3)]"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-5 h-5 mr-2" /> Add Game</>}
        </button>
      </div>

      {isAdding && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 glass-panel p-8 rounded-xl border border-neon-red/30">
          <h2 className="font-tech text-2xl text-white mb-6 uppercase tracking-widest">New Game Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Title</label>
                <input required type="text" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-neon-red outline-none" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Developer</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-neon-red outline-none" value={formData.developer || ''} onChange={e => setFormData({...formData, developer: e.target.value})} />
              </div>
              
              {/* Image Links */}
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Cover Image URL</label>
                <input required type="url" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-neon-red outline-none text-sm placeholder:text-gray-600" placeholder="https://..." value={formData.coverUrl || ''} onChange={e => setFormData({...formData, coverUrl: e.target.value})} />
              </div>
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Banner Image URL</label>
                <input required type="url" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-neon-red outline-none text-sm placeholder:text-gray-600" placeholder="https://..." value={formData.bannerUrl || ''} onChange={e => setFormData({...formData, bannerUrl: e.target.value})} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Storyline</label>
                <textarea rows={4} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-neon-red outline-none" value={formData.story || ''} onChange={e => setFormData({...formData, story: e.target.value})} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">System Requirements (Minimum)</label>
                <textarea rows={3} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-neon-red outline-none placeholder:text-gray-600 font-sans" placeholder="OS: Windows 10&#10;Processor: i5&#10;Memory: 8GB..." value={formData.systemRequirements?.minimum || ''} onChange={e => setFormData({...formData, systemRequirements: { ...formData.systemRequirements, minimum: e.target.value } as any})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">System Requirements (Recommended)</label>
                <textarea rows={3} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-neon-red outline-none placeholder:text-gray-600 font-sans" placeholder="OS: Windows 11&#10;Processor: i7&#10;Memory: 16GB..." value={formData.systemRequirements?.recommended || ''} onChange={e => setFormData({...formData, systemRequirements: { ...formData.systemRequirements, recommended: e.target.value } as any})} />
              </div>

              {/* Screenshots Array */}
              <div className="md:col-span-2 border-t border-white/10 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-gray-400 text-xs uppercase tracking-wider">Gallery Images (Screenshots)</label>
                  <button type="button" onClick={addScreenshot} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded font-tech uppercase transition-colors flex items-center">
                    <Plus className="w-3 h-3 mr-1" /> Add Image
                  </button>
                </div>
                {formData.screenshots?.map((shot, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input type="url" required className="flex-1 bg-black/50 border border-white/10 rounded p-2 text-white focus:border-neon-red outline-none text-sm placeholder:text-gray-600" placeholder="Image URL..." value={shot} onChange={e => updateScreenshot(idx, e.target.value)} />
                    <button type="button" onClick={() => removeScreenshot(idx)} className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>

              {/* Download Links Array */}
              <div className="md:col-span-2 border-t border-white/10 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-gray-400 text-xs uppercase tracking-wider">Download Links</label>
                  <button type="button" onClick={addDownloadLink} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded font-tech uppercase transition-colors flex items-center">
                    <Plus className="w-3 h-3 mr-1" /> Add Part
                  </button>
                </div>
                {formData.downloadLinks?.map((link, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input type="text" required className="w-1/3 bg-black/50 border border-white/10 rounded p-2 text-white focus:border-neon-red outline-none text-sm placeholder:text-gray-600" placeholder="Title (e.g. Part 1)" value={link.title} onChange={e => updateDownloadLink(idx, 'title', e.target.value)} />
                    <input type="url" required className="flex-1 bg-black/50 border border-white/10 rounded p-2 text-white focus:border-neon-red outline-none text-sm placeholder:text-gray-600" placeholder="Download URL..." value={link.url} onChange={e => updateDownloadLink(idx, 'url', e.target.value)} />
                    <button type="button" onClick={() => removeDownloadLink(idx)} className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={uploading} className="bg-blood-red hover:bg-neon-red text-white px-8 py-3 rounded font-tech tracking-widest uppercase transition-all flex items-center justify-center w-full mt-8 disabled:opacity-50">
              {uploading ? <><Loader2 className="animate-spin w-5 h-5 mr-2" /> Processing...</> : 'Save Game'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Game List */}
      <div className="bg-black/40 rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/60 border-b border-white/10">
              <th className="p-4 font-tech text-gray-400 uppercase tracking-wider text-xs">Title</th>
              <th className="p-4 font-tech text-gray-400 uppercase tracking-wider text-xs">Developer</th>
              <th className="p-4 font-tech text-gray-400 uppercase tracking-wider text-xs">Added</th>
              <th className="p-4 font-tech text-gray-400 uppercase tracking-wider text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500 font-tech uppercase tracking-widest">Loading...</td></tr>
            ) : games.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500 font-tech uppercase tracking-widest">No games found</td></tr>
            ) : (
              games.map(game => (
                <tr key={game.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-sans">{game.title}</td>
                  <td className="p-4 text-gray-400 text-sm">{game.developer}</td>
                  <td className="p-4 text-gray-400 text-sm">{new Date(game.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right flex justify-end space-x-2">
                    <button onClick={() => handleEdit(game)} className="text-gray-400 hover:text-white p-2 rounded bg-white/5 hover:bg-white/10 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(game.id)} className="text-gray-400 hover:text-blood-red p-2 rounded bg-white/5 hover:bg-blood-red/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
