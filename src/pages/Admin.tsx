import { useEffect, useState } from 'react';
import { getPendingClaims, approveClaim, rejectClaim, Claim } from '../api/services';
import { Check, Calendar, ShieldCheck, Clock, Package, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (claimId: string) => {
    const remarks = prompt('Enter approval remarks (optional):');
    setActionLoading(claimId);
    try {
      await approveClaim(claimId, remarks || undefined);
      await fetchPendingClaims();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed');
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
      await fetchPendingClaims();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Review Center
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Verify claims and manage item returns.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white border border-indigo-100 p-4 rounded-2xl shadow-sm flex items-center gap-4 min-w-[160px]">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Pending</p>
                <p className="text-2xl font-black text-gray-900">{claims.length}</p>
              </div>
            </div>

            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-200 flex items-center gap-4 min-w-[160px] text-white">
              <div className="p-3 bg-white/20 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-200 uppercase">Status</p>
                <p className="text-xl font-bold">Admin Mode</p>
              </div>
            </div>
          </div>
        </div>

        {/* CLAIM LIST */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-40 bg-gray-100 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : claims.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-20 text-center"
          >
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Inbox is clear!</h3>
            <p className="text-gray-500">All claims have been processed.</p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {claims.map((claim) => (
                <motion.div
                  key={claim.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 transition-all overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    
                    {/* IMAGE */}
                    <div className="md:w-64 h-48 md:h-auto relative bg-gray-100">
                      <img
                        src={claim.item?.imageUrl || 'https://via.placeholder.com/400'}
                        className="w-full h-full object-cover"
                        alt="item"
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg ${
                            claim.item?.type === 'lost'
                              ? 'bg-red-500 text-white'
                              : 'bg-emerald-500 text-white'
                          }`}
                        >
                          {claim.item?.type}
                        </span>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {claim.item?.title}
                          </h3>
                          <p className="text-gray-500 line-clamp-2 italic">
                            "{claim.item?.description}"
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-gray-600 text-sm font-semibold">
                            <Calendar className="w-4 h-4" />
                            {new Date(claim.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* FOOTER */}
                      <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-gray-50 pt-6">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">
                                Claimant ID
                              </p>
                              <p className="text-sm font-bold text-gray-700">
                                {claim.userId?.slice(0, 12) ?? 'Unknown'}...
                              </p>
                            </div>
                          </div>

                          <button className="text-indigo-600 hover:text-indigo-700 p-2 hover:bg-indigo-50 rounded-lg transition-colors">
                            <MessageSquare className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleReject(claim.id)}
                            disabled={actionLoading === claim.id}
                            className="px-6 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
                          >
                            Reject
                          </button>

                          <button
                            onClick={() => handleApprove(claim.id)}
                            disabled={actionLoading === claim.id}
                            className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
                          >
                            {actionLoading === claim.id ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <Check className="w-5 h-5" />
                                Approve Claim
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
