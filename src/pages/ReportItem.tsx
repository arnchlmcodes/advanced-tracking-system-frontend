import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem, uploadItemImage } from '../api/services';
import { Upload } from 'lucide-react';
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

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
            navigate('/');
        } catch (error: any) {
            console.error('Report submission error:', error);
            const message = error.response?.data?.message || error.message || 'Check your internet connection';
            alert(`Failed to report item: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-semibold text-white mb-6 tracking-tight">Report an Item</h1>

                <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Item Type
                        </label>
                        <div className="flex space-x-4">
                            {['lost', 'found'].map((type) => (
                                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value={type}
                                        checked={formData.type === type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                        className="text-white focus:ring-white"
                                    />
                                    <span className="capitalize text-sm font-medium text-gray-300">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1.5">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none text-sm text-white placeholder-gray-500"
                            placeholder="e.g., Blue Backpack"
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1.5">
                            Location
                        </label>
                        <input
                            id="location"
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none text-sm text-white placeholder-gray-500"
                            placeholder="e.g., Library 2nd Floor"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1.5">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={4}
                            className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none text-sm resize-none text-white placeholder-gray-500"
                            placeholder="Provide detailed description..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Image (Optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-600 transition-colors">
                            {image ? (
                                <div className="space-y-4">
                                    <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={() => setImage('')}
                                        className="text-sm text-red-400 hover:text-red-300 font-medium"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            ) : (
                                <label className="cursor-pointer">
                                    <Upload className="w-12 h-12 mx-auto text-gray-500 mb-2" />
                                    <span className="text-sm text-gray-400">Click to upload image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-4 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="flex-1 bg-gray-800 text-gray-300 py-2.5 px-4 rounded-lg hover:bg-gray-700 font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-white text-black py-2.5 px-4 rounded-lg hover:bg-gray-200 disabled:opacity-50 font-medium text-sm"
                        >
                            {loading ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default ReportItem;
