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
                return 'bg-green-100 text-green-700';
            case 'rejected':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">My Claims</h1>

                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : claims.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-500">You haven't submitted any claims yet</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                        >
                            Browse Items
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {claims.map((claim) => (
                            <div key={claim.id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {claim.item?.title || 'Item'}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {claim.item?.description}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 text-sm rounded-full capitalize ${getStatusColor(claim.status)}`}>
                                        {claim.status}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>Claimed on {new Date(claim.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    {claim.status === 'pending' && (
                                        <button
                                            onClick={() => navigate(`/claims/${claim.id}/chat`)}
                                            className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700"
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
