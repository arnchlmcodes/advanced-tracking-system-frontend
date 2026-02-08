import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../api/services';
import { User, Mail, Shield, IdCard, Save, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [formData, setFormData] = useState({
        displayName: '',
        phoneNumber: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await getProfile();
            setProfile(response.data);
            setFormData({
                displayName: response.data.displayName || '',
                phoneNumber: response.data.phoneNumber || ''
            });
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMsg('');
        try {
            await updateProfile(formData);
            setSuccessMsg('Profile updated successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Your Profile</h1>
                        <p className="text-gray-400 mt-1">Manage your account settings and information</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center space-y-4">
                            <div className="w-24 h-24 bg-indigo-600 rounded-full mx-auto flex items-center justify-center">
                                <User className="w-12 h-12 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">{profile?.displayName || 'User'}</h2>
                                <p className="text-sm text-gray-500 capitalize">{profile?.role || 'Member'}</p>
                            </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Account Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3 text-gray-300">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm truncate">{profile?.email}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-300">
                                    <IdCard className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">ID: {profile?.campusId || profile?.uid?.slice(0, 8)}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-300">
                                    <Shield className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm capitalize">{profile?.role} Account</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Settings */}
                    <div className="md:col-span-2">
                        <form onSubmit={handleUpdate} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-800">
                                <h3 className="text-lg font-medium text-white">Personal Information</h3>
                                <p className="text-sm text-gray-400">Update your public information</p>
                            </div>

                            <div className="p-6 space-y-6">
                                {successMsg && (
                                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm">
                                        {successMsg}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.displayName}
                                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                            placeholder="Enter your name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                            Phone Number (Optional)
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-900/50 border-t border-gray-800 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
