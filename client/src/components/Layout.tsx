import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Building2, Users, FileText } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow z-10">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <Link to="/" className="text-xl font-bold text-blue-600">Bharat Business Deals</Link>
                            <div className="hidden md:flex space-x-4">
                                <Link
                                    to="/"
                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                                >
                                    <FileText size={18} className="mr-2" />
                                    Letters
                                </Link>
                                <Link
                                    to="/businesses"
                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/businesses') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                                >
                                    <Building2 size={18} className="mr-2" />
                                    Businesses
                                </Link>
                                <Link
                                    to="/recipients"
                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/recipients') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                                >
                                    <Users size={18} className="mr-2" />
                                    Recipients
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 text-sm hidden sm:inline">Welcome, {user?.name}</span>
                            <button
                                onClick={logout}
                                className="flex items-center px-3 py-2 text-sm text-red-600 transition rounded hover:bg-red-50"
                            >
                                <LogOut size={16} className="mr-1" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
