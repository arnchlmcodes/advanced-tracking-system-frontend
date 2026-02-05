import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home, Package, FileText, Shield } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, userProfile, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <Link to="/" className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
                                <Package className="w-6 h-6" />
                                <span>Lost & Found</span>
                            </Link>

                            {user && (
                                <div className="hidden md:flex space-x-4">
                                    <Link to="/" className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900">
                                        <Home className="w-4 h-4" />
                                        <span>Home</span>
                                    </Link>
                                    <Link to="/my-claims" className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900">
                                        <FileText className="w-4 h-4" />
                                        <span>My Claims</span>
                                    </Link>
                                    {userProfile?.role === 'admin' && (
                                        <Link to="/admin" className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900">
                                            <Shield className="w-4 h-4" />
                                            <span>Admin</span>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {user && (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">{user.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:text-red-700"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
