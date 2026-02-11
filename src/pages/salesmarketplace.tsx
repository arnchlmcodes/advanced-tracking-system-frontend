import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowUpRight, Sparkles, Tag, ShieldCheck, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

type SaleItem = {
  id: string;
  name: string;
  price: number;
  status: "available" | "sold";
  category?: string;
  imageUrl?: string;
};

export default function SaleMarketplace() {
  const navigate = useNavigate();
  const [items, setItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSaleItems(); }, []);

  const fetchSaleItems = async () => {
    try {
      const res = await axios.get("/api/sales/items");
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch sale items", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-black text-indigo-900 animate-pulse tracking-widest uppercase text-xs">Loading Boutique</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-rose-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        
        {/* --- HERO HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <Sparkles size={12} className="fill-current" /> Second Life Marketplace
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]"
            >
              Campus <span className="text-indigo-600 block md:inline">Finds.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-slate-500 text-lg md:text-xl font-medium max-w-md leading-relaxed"
            >
              Exclusive unclaimed items from the lost & found, revitalized for your campus life.
            </motion.p>
          </div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
             className="hidden lg:flex flex-col items-end text-right border-l border-slate-200 pl-8"
          >
            <span className="text-4xl font-black text-slate-200 italic leading-none">01—B</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Active Drops</span>
            <span className="text-2xl font-black">{items.filter(i => i.status === 'available').length}</span>
          </motion.div>
        </header>

        {/* --- SEARCH & FILTERS BAR --- */}
        <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                    type="text" 
                    placeholder="Search the drops..." 
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-medium"
                />
            </div>
            <button className="bg-white border border-slate-200 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <Tag size={20} className="text-slate-600" />
            </button>
        </div>

        {/* --- PRODUCT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-20px_rgba(79,70,229,0.15)] transition-all duration-500 overflow-hidden"
              >
                {/* Visual Area */}
                <div className="aspect-[5/4] bg-slate-50 overflow-hidden relative">
                  <img 
                    src={item.imageUrl || `https://source.unsplash.com/featured/?${item.name}`} 
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${item.status === 'sold' ? 'grayscale opacity-40' : ''}`}
                    alt={item.name}
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 border border-white/20 shadow-sm">
                      {item.category || 'Limited Drop'}
                    </span>
                  </div>

                  {item.status === "sold" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-slate-900 text-white px-8 py-2 rounded-full font-black text-sm uppercase tracking-tighter rotate-[-5deg] shadow-2xl">
                            Sold to someone fast
                        </div>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold tracking-tight text-slate-800 leading-none">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-50">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Asking Price</span>
                        <span className="text-3xl font-black text-slate-900 leading-none">${item.price}</span>
                    </div>

                    <button
                      disabled={item.status === "sold"}
                      onClick={() => navigate(`/purchase-result/${item.id}`)}
                      className={`h-14 px-6 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95
                        ${
                          item.status === "sold"
                            ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                            : "bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-indigo-100 group-hover:translate-x-1"
                        }`}
                    >
                      {item.status === "sold" ? "Claimed" : "Purchase"}
                      <ArrowUpRight size={18} className={item.status === "sold" ? "hidden" : "block"} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- TRUST BAR --- */}
        <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            className="mt-24 p-12 rounded-[3rem] bg-indigo-900 text-white flex flex-wrap justify-around gap-8 text-center"
        >
            <div className="space-y-2">
                <ShieldCheck className="mx-auto text-indigo-300" size={32} />
                <p className="font-bold uppercase tracking-widest text-[10px]">Verified Quality</p>
                <p className="text-indigo-200 text-xs">All items sanitized & tested</p>
            </div>
            <div className="w-px h-16 bg-white/10 hidden md:block" />
            <div className="space-y-2">
                <ShoppingBag className="mx-auto text-indigo-300" size={32} />
                <p className="font-bold uppercase tracking-widest text-[10px]">Sustainability</p>
                <p className="text-indigo-200 text-xs">Proceeds fund campus green tech</p>
            </div>
        </motion.div>
      </div>
    </div>
  );
}