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
            alert(error.response?.data?.message || 'Failed to report item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Report an Item</h1>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="capitalize">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="e.g., Blue Backpack"
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                        </label>
                        <input
                            id="location"
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="e.g., Library 2nd Floor"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Provide detailed description..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image (Optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            {image ? (
                                <div className="space-y-4">
                                    <img src={image} alt="Preview" className="max-h-64 mx-auto rounded" />
                                    <button
                                        type="button"
                                        onClick={() => setImage('')}
                                        className="text-sm text-red-600 hover:text-red-700"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            ) : (
                                <label className="cursor-pointer">
                                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">Click to upload image</span>
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

                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
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
