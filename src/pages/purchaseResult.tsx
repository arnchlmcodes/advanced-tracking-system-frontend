import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

export default function PurchaseResult() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (itemId) purchaseItem(itemId);
  }, [itemId]);

  const purchaseItem = async (id: string) => {
    try {
      const res = await axios.post(`/api/sales/purchase/${id}`);
      setSuccess(res.data.success);
      setMessage(res.data.message);
    } catch (err: any) {
      setSuccess(false);
      setMessage(err.response?.data?.message || "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Processing purchase...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">

        {success ? (
          <>
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-3xl font-black mb-2">
              Purchase Successful
            </h1>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
            <h1 className="text-3xl font-black mb-2">
              Purchase Failed
            </h1>
          </>
        )}

        <p className="text-slate-500 mb-6">{message}</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/sales-marketplace")}
            className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-indigo-600"
          >
            Back to Marketplace
          </button>

          <button
            onClick={() => navigate("/my-claims")}
            className="w-full py-3 rounded-xl bg-slate-100 font-bold"
          >
            Go to My Claims
          </button>
        </div>
      </div>
    </div>
  );
}
