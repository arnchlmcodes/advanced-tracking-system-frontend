import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home, Package, FileText, User } from 'lucide-react';

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
        <div className="min-h-screen bg-black">
            <nav className="bg-black border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-black/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <Link to="/" className="flex items-center space-x-2 text-xl font-semibold text-white hover:text-gray-300">
                                <Package className="w-5 h-5" />
                                <span>Lost & Found</span>
                            </Link>

                            {user && (
                                <div className="hidden md:flex space-x-1">
                                    {userProfile?.role === 'admin' ? (
                                        <>
                                            <Link to="/admin" className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg">
                                                <Home className="w-4 h-4" />
                                                <span>Dashboard</span>
                                            </Link>
                                            <Link to="/" className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg">
                                                <Package className="w-4 h-4" />
                                                <span>All Items</span>
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/" className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg">
                                                <Home className="w-4 h-4" />
                                                <span>Home</span>
                                            </Link>
                                            <Link to="/my-claims" className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg">
                                                <FileText className="w-4 h-4" />
                                                <span>My Claims</span>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {user && (
                            <div className="flex items-center space-x-4">
                                <Link to="/profile" className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg">
                                    <User className="w-4 h-4" />
                                    <span className="hidden sm:block">{user.email}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-300 hover:text-red-400 hover:bg-gray-900 rounded-lg"
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
