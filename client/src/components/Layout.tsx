import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Building2, Users, FileText, Menu, X } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow-sm z-50 sticky top-0">
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
                                {user?.admin && (
                                    <Link
                                        to="/admin/verify"
                                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin/verify') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                                    >
                                        <Users size={18} className="mr-2" />
                                        Verify Accounts
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 text-sm hidden md:inline">Welcome, {user?.name}</span>
                            <button
                                onClick={logout}
                                className="hidden md:flex items-center px-3 py-2 text-sm text-red-600 transition rounded hover:bg-red-50"
                            >
                                <LogOut size={16} className="mr-1" />
                                <span>Logout</span>
                            </button>
                            <button
                                onClick={toggleMobileMenu}
                                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link
                                to="/"
                                onClick={closeMobileMenu}
                                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}
                            >
                                <FileText size={18} className="mr-2" />
                                Letters
                            </Link>
                            <Link
                                to="/businesses"
                                onClick={closeMobileMenu}
                                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${isActive('/businesses') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}
                            >
                                <Building2 size={18} className="mr-2" />
                                Businesses
                            </Link>
                            <Link
                                to="/recipients"
                                onClick={closeMobileMenu}
                                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${isActive('/recipients') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}
                            >
                                <Users size={18} className="mr-2" />
                                Recipients
                            </Link>
                            {user?.admin && (
                                <Link
                                    to="/admin/verify"
                                    onClick={closeMobileMenu}
                                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${isActive('/admin/verify') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}
                                >
                                    <Users size={18} className="mr-2" />
                                    Verify Accounts
                                </Link>
                            )}
                        </div>
                        <div className="pt-4 pb-4 border-t border-gray-200">
                            <div className="flex items-center px-5">
                                <div className="ml-3">
                                    <div className="text-base font-medium leading-none text-gray-800">{user?.name}</div>
                                    <div className="text-sm font-medium leading-none text-gray-500 mt-1">{user?.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 px-2 space-y-1">
                                <button
                                    onClick={() => { closeMobileMenu(); logout(); }}
                                    className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                >
                                    <LogOut size={18} className="mr-2" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
