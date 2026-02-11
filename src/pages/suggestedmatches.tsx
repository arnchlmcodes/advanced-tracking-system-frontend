import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Search, ArrowRight, PackageSearch } from "lucide-react";
import Layout from "../components/Layout";

interface MatchItem {
  id: string;
  title: string;
  location: string;
  description: string;
  imageUrl?: string;
  confidenceScore: number; // backend computed
}

export default function SuggestedMatches() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const itemId = params.get("itemId"); // from ReportItem redirect

  useEffect(() => {
    if (!itemId) {
      setError("Invalid report reference.");
      setLoading(false);
      return;
    }

    fetchSuggestedMatches(itemId);
  }, [itemId]);

  const fetchSuggestedMatches = async (id: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/matches/suggested/${id}`
      );
      setMatches(res.data || []);
    } catch (err) {
      setError("Failed to fetch suggested matches.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- LOADING -------------------- */

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400">
          <Search className="w-10 h-10 mb-4 animate-pulse" />
          <p className="font-bold uppercase tracking-widest text-xs">
            Finding Possible Matches...
          </p>
        </div>
      </Layout>
    );
  }

  /* -------------------- ERROR -------------------- */

  if (error) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center text-red-500 font-bold">
          {error}
        </div>
      </Layout>
    );
  }

  /* -------------------- EMPTY -------------------- */

  if (matches.length === 0) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
          <PackageSearch className="w-16 h-16 text-slate-300 mb-6" />
          <h2 className="text-2xl font-black text-slate-700 mb-2">
            No Matches Found
          </h2>
          <p className="text-slate-500 mb-6 max-w-md">
            We couldn’t find any close matches yet. New items are added
            frequently — we’ll notify you if something appears.
          </p>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  /* -------------------- RESULTS -------------------- */

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900">
            Suggested Matches
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            These items closely match your report.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-2xl overflow-hidden hover:shadow-xl transition"
            >
              <div className="h-48 bg-slate-100">
                <img
                  src={
                    item.imageUrl ||
                    "https://images.unsplash.com/photo-1584931423298-c576fda54bd2"
                  }
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-xl">{item.title}</h3>
                  <p className="text-slate-500 text-sm">
                    Found at {item.location}
                  </p>
                </div>

                <p className="text-sm text-slate-600 line-clamp-2">
                  {item.description}
                </p>

                {/* Confidence */}
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400 uppercase tracking-wider">
                    Match Confidence
                  </span>
                  <span className="text-emerald-600">
                    {item.confidenceScore}%
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/claims/${item.id}`)}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 transition"
                >
                  View & Claim
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
