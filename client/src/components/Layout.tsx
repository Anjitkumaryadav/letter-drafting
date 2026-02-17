import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Building2, Users, FileText } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import logo from '../assets/logo.png';

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/letter-draft', label: 'Letters', icon: FileText },
        { path: '/businesses', label: 'Businesses', icon: Building2 },
        { path: '/recipients', label: 'Recipients', icon: Users },
    ];

    if (user?.admin) {
        // Admin link is handled separately in Row 2 as per request
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col font-sans overflow-x-hidden">
            {/* Navbar - Mobile First Design */}
            <nav className="bg-white/90 backdrop-blur-xl border-b border-neutral-200 sticky top-0 z-50 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex flex-col gap-3">
                        {/* Row 1: Logo & Main Navigation */}
                        <div className="flex items-center justify-between">
                            {/* Logo - Bigger as requested */}
                            <Link to="/letter-draft" className="flex-shrink-0 group hover:opacity-90 transition-opacity">
                                <img className="w-16 h-auto sm:w-20" src={logo} alt="Bharat Business" />
                            </Link>

                            {/* Main Nav Items */}
                            <div className="flex items-center gap-1 sm:gap-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex flex-col sm:flex-row items-center justify-center px-3 py-2 rounded-xl text-[10px] sm:text-sm font-semibold transition-all duration-200 group
                                        ${isActive(item.path)
                                                ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100'
                                                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                                            }`}
                                    >
                                        <item.icon size={20} strokeWidth={isActive(item.path) ? 2.5 : 2} className={`mb-1 sm:mb-0 sm:mr-2 transition-transform group-hover:scale-110 ${isActive(item.path) ? 'text-primary-600' : 'text-neutral-400'}`} />
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Row 2: Admin & User Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                            {/* User Info */}
                            <div className="flex items-center gap-2 text-neutral-600">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-100 to-primary-50 text-primary-700 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-neutral-800 leading-none">{user?.name}</span>
                                    {user?.admin && <span className="text-[10px] text-primary-600 font-semibold bg-primary-50 px-1.5 py-0.5 rounded mt-0.5 w-fit">ADMIN</span>}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {user?.admin && (
                                    <Link
                                        to="/admin/verify"
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                                        ${isActive('/admin/verify')
                                                ? 'bg-neutral-800 text-white shadow-md'
                                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                            }`}
                                    >
                                        <Users size={14} />
                                        <span>Manage Users</span>
                                    </Link>
                                )}

                                <button
                                    onClick={logout}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                                    title="Sign Out"
                                >
                                    <LogOut size={14} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in text-base">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
