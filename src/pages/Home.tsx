import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItems, createClaim, Item } from '../api/services';
import { Search, MapPin, Calendar, Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
    const { userProfile } = useAuth();
    const [items, setItems] = useState<Item[]>([]);
    const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (userProfile?.role === 'admin') {
            navigate('/admin');
            return;
        }
        fetchItems();
    }, [filter, userProfile]);

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
            alert('Claim submitted successfully!');
            navigate('/my-claims');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to submit claim');
        }
    };

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-white tracking-tight">Items</h1>
                    <button
                        onClick={() => navigate('/report')}
                        className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 font-medium text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Report Item</span>
                    </button>
                </div>

                <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none text-sm text-white placeholder-gray-500"
                        />
                    </div>

                    <div className="flex space-x-2">
                        {['all', 'lost', 'found'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type as any)}
                                className={`px-4 py-2 rounded-lg capitalize text-sm font-medium transition-all ${filter === type
                                    ? 'bg-white text-black'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-400">Loading...</div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">No items found</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 hover:shadow-lg transition-all overflow-hidden">
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-5 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${item.type === 'lost'
                                            ? 'bg-red-900/30 text-red-300 border-red-800'
                                            : 'bg-green-900/30 text-green-300 border-green-800'
                                            }`}>
                                            {item.type}
                                        </span>
                                    </div>

                                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{item.description}</p>

                                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                                        <div className="flex items-center space-x-1.5">
                                            <MapPin className="w-4 h-4" />
                                            <span>{item.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5">
                                            <Calendar className="w-4 h-4" />
                                            <span>{
                                                item.createdAt
                                                    ? (typeof item.createdAt === 'object' && '_seconds' in (item.createdAt as any))
                                                        ? new Date((item.createdAt as any)._seconds * 1000).toLocaleDateString()
                                                        : new Date(item.createdAt).toLocaleDateString()
                                                    : 'N/A'
                                            }</span>
                                        </div>
                                    </div>

                                    {item.status === 'pending' && (
                                        <button
                                            onClick={() => handleClaim(item.id)}
                                            className="w-full bg-white text-black py-2.5 rounded-lg hover:bg-gray-200 font-medium text-sm"
                                        >
                                            Claim This Item
                                        </button>
                                    )}
                                    {item.status === 'returned' && (
                                        <div className="text-center text-sm text-gray-500 py-2">Already Returned</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Home;
