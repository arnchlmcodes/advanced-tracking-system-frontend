import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyClaims, Claim } from '../api/services';
import {
  MessageCircle,
  Calendar,
  Package,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: 'Approved'
        };
      case 'rejected':
        return {
          color: 'text-rose-700 bg-rose-50 border-rose-100',
          icon: <XCircle className="w-4 h-4" />,
          label: 'Declined'
        };
      default:
        return {
          color: 'text-amber-700 bg-amber-50 border-amber-100',
          icon: <Clock className="w-4 h-4" />,
          label: 'Under Review'
        };
    }
  };

  return (
    <Layout>
      {/* ✅ WHITE SURFACE FIX */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 pb-20 shadow-sm">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Track Your Claims
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Keep an eye on the items you've claimed or reported.
          </p>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div
                key={n}
                className="h-32 bg-gray-50 animate-pulse rounded-3xl border border-gray-100"
              />
            ))}
          </div>
        ) : claims.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 p-16 text-center"
          >
            <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-indigo-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No active claims</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-2">
              Find your lost items by browsing the community feed.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-8 bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
            >
              Start Browsing
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {claims.map((claim, index) => {
              const styles = getStatusStyles(claim.status);
              return (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all p-2"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6 p-4">
                    <div className="w-full md:w-32 h-24 rounded-2xl overflow-hidden bg-gray-100">
                      <img
                        src={claim.item?.imageUrl || 'https://via.placeholder.com/150'}
                        className="w-full h-full object-cover"
                        alt="claim-item"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {claim.item?.title || 'Item Name'}
                        </h3>
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles.color}`}
                        >
                          {styles.icon}
                          {styles.label}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(claim.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className="capitalize text-indigo-400">
                          {claim.item?.type} Item
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/claims/${claim.id}/chat`)}
                      className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Messages
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyClaims;
