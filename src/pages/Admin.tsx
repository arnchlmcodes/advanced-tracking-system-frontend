import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingClaims, approveClaim, rejectClaim, Claim } from '../api/services';
import { Check, X, Calendar, MessageCircle } from 'lucide-react';
import Layout from '../components/Layout';

const Admin: React.FC = () => {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingClaims();
    }, []);

    const fetchPendingClaims = async () => {
        setLoading(true);
        try {
            const response = await getPendingClaims();
            setClaims(response.data || []);
        } catch (error) {
            console.error('Failed to fetch pending claims:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (claimId: string) => {
        const remarks = prompt('Enter approval remarks (optional):');
        setActionLoading(claimId);

        try {
            await approveClaim(claimId, remarks || undefined);
            alert('Claim approved successfully!');
            await fetchPendingClaims();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to approve claim');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (claimId: string) => {
        const remarks = prompt('Enter rejection reason:');
        if (!remarks) return;

        setActionLoading(claimId);
        try {
            await rejectClaim(claimId, remarks);
            alert('Claim rejected successfully!');
            await fetchPendingClaims();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to reject claim');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-white tracking-tight">Admin Dashboard</h1>
                    <div className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg font-medium text-sm border border-gray-700">
                        {claims.length} Pending Claims
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-400">Loading...</div>
                ) : claims.length === 0 ? (
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
                        <p className="text-gray-400">No pending claims to review</p>
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
                                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${claim.item?.type === 'lost'
                                                ? 'bg-red-900/30 text-red-300 border-red-800'
                                                : 'bg-green-900/30 text-green-300 border-green-800'
                                                }`}>
                                                {claim.item?.type}
                                            </span>
                                            <div className="flex items-center space-x-1.5">
                                                <Calendar className="w-4 h-4" />
                                                <span>{
                                                    claim.createdAt
                                                        ? (typeof claim.createdAt === 'object' && '_seconds' in (claim.createdAt as any))
                                                            ? new Date((claim.createdAt as any)._seconds * 1000).toLocaleDateString()
                                                            : new Date(claim.createdAt).toLocaleDateString()
                                                        : 'N/A'
                                                }</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-3 pt-2">
                                    <button
                                        onClick={() => navigate(`/claims/${claim.id}/chat`)}
                                        className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 font-medium text-sm"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span>View Chat</span>
                                    </button>
                                    <button
                                        onClick={() => handleApprove(claim.id)}
                                        disabled={actionLoading === claim.id}
                                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium text-sm"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span>Approve</span>
                                    </button>
                                    <button
                                        onClick={() => handleReject(claim.id)}
                                        disabled={actionLoading === claim.id}
                                        className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium text-sm"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Reject</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Admin;
