import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItems, createClaim, Item } from '../api/services';
import { Search, MapPin, Calendar, Plus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, [filter]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getItems(filter === 'all' ? undefined : filter);
      setItems(response.data || []);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (itemId: string) => {
    try {
      await createClaim(itemId);
      navigate('/my-claims');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit claim');
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 md:p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            >
              Lost something? <br />
              <span className="text-indigo-200">We'll help you find it.</span>
            </motion.h1>
            <p className="text-indigo-100 text-lg mb-8">
              Join our community-driven effort to return lost belongings.
            </p>
            <button
              onClick={() => navigate('/report')}
              className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg group"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
              Report New Item
            </button>
          </div>

          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
        </div>

        {/* FILTER & SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-30 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
            {['all', 'lost', 'found'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold capitalize ${
                  filter === type
                    ? 'bg-white text-indigo-600 shadow'
                    : 'text-gray-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* ITEMS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl border hover:shadow-xl transition-all"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1584931423298-c576fda54bd2'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-500 mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {item.status === 'pending' ? (
                      <button
                        onClick={() => handleClaim(item.id)}
                        className="w-full flex items-center justify-center bg-gray-900 text-white py-3 rounded-xl hover:bg-indigo-600"
                      >
                        Claim Item <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    ) : (
                      <div className="text-center text-gray-400 italic">
                        Archived / Returned
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
