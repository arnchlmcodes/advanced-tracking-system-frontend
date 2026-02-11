/*import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem, uploadItemImage } from '../api/services';
import { Upload, X, MapPin, Tag, AlignLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';

const ReportItem: React.FC = () => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'lost' as 'lost' | 'found',
        location: '',
        description: '',
    });
    const [image, setImage] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isLost = formData.type === 'lost';

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await createItem(formData);
            const itemId = response.data.id;
            if (image) await uploadItemImage(itemId, image);
            alert('Item reported successfully!');
            navigate('/');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to report item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto pb-20">*/
                {/* Header Section */}
                /*<div className="mb-8 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black text-gray-900 tracking-tight"
                    >
                        Report an Item
                    </motion.h1>
                    <p className="text-gray-500 mt-2 font-medium">Help the community by providing accurate details.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">*/
                    {/* --- TYPE SELECTION CARD --- */}
                   /* <div className="grid grid-cols-2 gap-4">
                        {['lost', 'found'].map((type) => (
                            <label 
                                key={type}
                                className={`relative flex flex-col items-center justify-center p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${
                                    formData.type === type 
                                    ? (type === 'lost' ? 'border-red-500 bg-red-50/50 shadow-lg shadow-red-100' : 'border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-100')
                                    : 'border-gray-100 bg-white hover:border-gray-200'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="type"
                                    value={type}
                                    checked={formData.type === type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                    className="hidden"
                                />
                                {type === 'lost' ? (
                                    <AlertCircle className={`w-8 h-8 mb-2 ${formData.type === type ? 'text-red-500' : 'text-gray-400'}`} />
                                ) : (
                                    <CheckCircle2 className={`w-8 h-8 mb-2 ${formData.type === type ? 'text-emerald-500' : 'text-gray-400'}`} />
                                )}
                                <span className={`font-bold uppercase tracking-widest text-xs ${formData.type === type ? (type === 'lost' ? 'text-red-600' : 'text-emerald-600') : 'text-gray-500'}`}>
                                    I {type === 'lost' ? 'Lost' : 'Found'} Something
                                </span>
                            </label>
                        ))}
                    </div>*/

                    {/* --- MAIN FORM CARD --- */}
                    /*<div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-50/50 border border-gray-100 overflow-hidden">
                        <div className={`h-2 w-full transition-colors duration-500 ${isLost ? 'bg-red-500' : 'bg-emerald-500'}`} />
                        
                        <div className="p-8 md:p-10 space-y-8">*/
                            {/* Title Input */}
                          /*  <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">
                                    <Tag className="w-4 h-4 text-indigo-500" /> Item Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-50 transition-all text-lg font-medium placeholder:text-gray-300"
                                    placeholder="e.g., iPhone 13 with a clear case"
                                />
                            </div>*/

                            {/* Location Input */}
                           /* <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">
                                    <MapPin className="w-4 h-4 text-indigo-500" /> Where was it {formData.type}?
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-50 transition-all text-lg font-medium placeholder:text-gray-300"
                                    placeholder="e.g., Cafeteria, North Table"
                                />
                            </div>*/

                            {/* Description Input */}
                            /*<div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">
                                    <AlignLeft className="w-4 h-4 text-indigo-500" /> Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows={4}
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-50 transition-all text-lg font-medium placeholder:text-gray-300 resize-none"
                                    placeholder="Provide unique identifiers (stickers, scratches, serial numbers)..."
                                />
                            </div>*/

                            {/* Image Upload Area */}
                            /*<div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">
                                    Photo Evidence
                                </label>
                                <div className={`relative group border-4 border-dashed rounded-[2rem] transition-all duration-300 ${
                                    image ? 'border-indigo-100 bg-white' : 'border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30'
                                }`}>
                                    <AnimatePresence mode="wait">
                                        {image ? (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                                className="p-4"
                                            >
                                                <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100 shadow-inner">
                                                    <img src={image} alt="Preview" className="w-full h-full object-contain" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setImage('')}
                                                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
                                                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                                    <Upload className="w-8 h-8" />
                                                </div>
                                                <span className="text-gray-900 font-bold">Upload a photo</span>
                                                <span className="text-gray-400 text-sm">PNG, JPG or JPEG (Max 5MB)</span>
                                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                            </label>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>*/

                        {/* --- ACTION BUTTONS --- */}
                       /* <div className="bg-gray-50 p-8 flex flex-col md:flex-row gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="flex-1 px-8 py-4 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                            >
                                Discard
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-[2] relative overflow-hidden group px-8 py-4 rounded-2xl text-white font-black text-lg transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 ${
                                    isLost ? 'bg-gray-900 hover:bg-red-600 shadow-red-100' : 'bg-gray-900 hover:bg-emerald-600 shadow-emerald-100'
                                }`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Submit {formData.type} report</>
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default ReportItem;*/



import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem, uploadItemImage } from '../api/services';
import {
  Upload,
  X,
  MapPin,
  Tag,
  AlignLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';

/* ---------------- TYPES ---------------- */

type ItemType = 'lost' | 'found';

interface FormData {
  title: string;
  type: ItemType;
  location: string;
  description: string;
}

/* ---------------- COMPONENT ---------------- */

const ReportItem: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    type: 'lost',
    location: '',
    description: '',
  });

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isLost = formData.type === 'lost';

  /* ---------- IMAGE HANDLER ---------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createItem(formData);
      const itemId = response.data.id;

      if (image) {
        await uploadItemImage(itemId, image);
      }

      alert('Item reported successfully!');
      navigate('/'); // back to dashboard
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to report item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto pb-20">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-gray-900"
          >
            Report an Item
          </motion.h1>
          <p className="text-gray-500 mt-2">
            Help the community by providing accurate details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TYPE SELECT */}
          <div className="grid grid-cols-2 gap-4">
            {(['lost', 'found'] as ItemType[]).map((type) => (
              <label
                key={type}
                className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 cursor-pointer transition ${
                  formData.type === type
                    ? type === 'lost'
                      ? 'border-red-500 bg-red-50'
                      : 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-100 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={formData.type === type}
                  onChange={() =>
                    setFormData({ ...formData, type })
                  }
                  className="hidden"
                />
                {type === 'lost' ? (
                  <AlertCircle className="w-8 h-8 text-red-500" />
                ) : (
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                )}
                <span className="mt-2 font-bold uppercase text-xs">
                  I {type === 'lost' ? 'Lost' : 'Found'} Something
                </span>
              </label>
            ))}
          </div>

          {/* FORM CARD */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border overflow-hidden">
            <div
              className={`h-2 ${
                isLost ? 'bg-red-500' : 'bg-emerald-500'
              }`}
            />

            <div className="p-8 space-y-6">
              <InputField
                label="Item Name"
                icon={<Tag className="w-4 h-4" />}
                value={formData.title}
                placeholder="e.g. iPhone 13 with clear case"
                onChange={(v) =>
                  setFormData({ ...formData, title: v })
                }
              />

              <InputField
                label={`Where was it ${formData.type}?`}
                icon={<MapPin className="w-4 h-4" />}
                value={formData.location}
                placeholder="e.g. Cafeteria North Table"
                onChange={(v) =>
                  setFormData({ ...formData, location: v })
                }
              />

              <TextAreaField
                label="Description"
                icon={<AlignLeft className="w-4 h-4" />}
                value={formData.description}
                placeholder="Unique marks, serial numbers..."
                onChange={(v) =>
                  setFormData({ ...formData, description: v })
                }
              />

              {/* IMAGE UPLOAD */}
              <div>
                <label className="font-bold mb-2 block">
                  Photo Evidence
                </label>

                <div className="border-2 border-dashed rounded-2xl p-6">
                  <AnimatePresence>
                    {image ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative"
                      >
                        <img
                          src={image}
                          className="rounded-xl max-h-64 mx-auto"
                        />
                        <button
                          type="button"
                          onClick={() => setImage(null)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                        >
                          <X />
                        </button>
                      </motion.div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center">
                        <Upload className="w-8 h-8 mb-2" />
                        <span>Upload a photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="bg-gray-50 p-6 flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 text-gray-500 font-bold"
              >
                Discard
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`flex-[2] py-4 rounded-2xl font-black text-white ${
                  isLost
                    ? 'bg-gray-900 hover:bg-red-600'
                    : 'bg-gray-900 hover:bg-emerald-600'
                }`}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ReportItem;

/* ---------------- REUSABLE FIELDS ---------------- */

const InputField = ({
  label,
  icon,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <label className="flex items-center gap-2 font-bold mb-2">
      {icon} {label}
    </label>
    <input
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-4 bg-gray-50 rounded-xl"
    />
  </div>
);

const TextAreaField = ({
  label,
  icon,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <label className="flex items-center gap-2 font-bold mb-2">
      {icon} {label}
    </label>
    <textarea
      required
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-4 bg-gray-50 rounded-xl resize-none"
    />
  </div>
);



     