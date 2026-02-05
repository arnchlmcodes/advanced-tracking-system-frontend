import React, { useEffect, useState } from 'react';
import { getPendingClaims, approveClaim, rejectClaim, Claim } from '../api/services';
import { Check, X, Calendar } from 'lucide-react';
import Layout from '../components/Layout';

const Admin: React.FC = () => {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

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
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg">
                        {claims.length} Pending Claims
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : claims.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-500">No pending claims to review</p>
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
                                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                            <span className={`px-2 py-1 rounded-full ${claim.item?.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {claim.item?.type}
                                            </span>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(claim.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => handleApprove(claim.id)}
                                        disabled={actionLoading === claim.id}
                                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                                    >
                                        <Check className="w-5 h-5" />
                                        <span>Approve</span>
                                    </button>
                                    <button
                                        onClick={() => handleReject(claim.id)}
                                        disabled={actionLoading === claim.id}
                                        className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                                    >
                                        <X className="w-5 h-5" />
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
