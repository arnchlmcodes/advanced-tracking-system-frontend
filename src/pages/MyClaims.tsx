import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyClaims, Claim } from '../api/services';
import { MessageCircle, Calendar } from 'lucide-react';
import Layout from '../components/Layout';

const MyClaims: React.FC = () => {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        setLoading(true);
        try {
            const response = await getMyClaims();
            setClaims(response.data || []);
        } catch (error) {
            console.error('Failed to fetch claims:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-900/30 text-green-300 border-green-800';
            case 'rejected':
                return 'bg-red-900/30 text-red-300 border-red-800';
            default:
                return 'bg-yellow-900/30 text-yellow-300 border-yellow-800';
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-3xl font-semibold text-white tracking-tight">My Claims</h1>

                {loading ? (
                    <div className="text-center py-12 text-gray-400">Loading...</div>
                ) : claims.length === 0 ? (
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
                        <p className="text-gray-400 mb-4">You haven't submitted any claims yet</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-white text-black px-6 py-2.5 rounded-lg hover:bg-gray-200 font-medium text-sm"
                        >
                            Browse Items
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {claims.map((claim) => (
                            <div key={claim.id} className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 hover:shadow-lg transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white">
                                            {claim.item?.title || 'Item'}
                                        </h3>
                                        <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                                            {claim.item?.description}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize border ${getStatusColor(claim.status)}`}>
                                        {claim.status}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center space-x-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <span>Claimed on {
                                            claim.createdAt
                                                ? (typeof claim.createdAt === 'object' && '_seconds' in (claim.createdAt as any))
                                                    ? new Date((claim.createdAt as any)._seconds * 1000).toLocaleDateString()
                                                    : new Date(claim.createdAt).toLocaleDateString()
                                                : 'N/A'
                                        }</span>
                                    </div>

                                    {claim.status === 'pending' && (
                                        <button
                                            onClick={() => navigate(`/claims/${claim.id}/chat`)}
                                            className="flex items-center space-x-1.5 text-gray-300 hover:text-white font-medium"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            <span>View Chat</span>
                                        </button>
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

export default MyClaims;
