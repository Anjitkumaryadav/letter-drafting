import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Building2, Users, FileText, Menu, X } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/letter-draft', label: 'Letters', icon: FileText },
        { path: '/businesses', label: 'Businesses', icon: Building2 },
        { path: '/recipients', label: 'Recipients', icon: Users },
    ];

    //   const navItems = [
    //     { path: '/letter-draft', label: 'Letters'},
    //     { path: '/businesses', label: 'Businesses'},
    //     { path: '/recipients', label: 'Recipients' },
    // ];
    if (user?.admin) {
        navItems.push({ path: '/admin/verify', label: 'User Management', icon: Users });
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col font-sans overflow-x-hidden">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo & Desktop Nav */}
                        <div className="flex items-center gap-2">
                            <Link to="/letter-draft" className="flex items-center gap-2 group">
                                <span className="text-xl font-extrabold tracking-tight text-blue-700"><img className="w-12 h-10" src="./src/assets/logo.png" alt="" /></span>
                            </Link>

                            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mask-gradient pr-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex-shrink-0 flex items-center px-2 sm:px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200  
                                        ${item.path === '/admin/verify' ? 'hidden md:flex' : ''}
                                        ${isActive(item.path)
                                                ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100'
                                                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                                            }`}
                                    >
                                        <item.icon size={16} className={`mr-1.5 sm:mr-2 ${isActive(item.path) ? 'text-primary-600' : 'text-neutral-400'}`} />
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* User Profile & Mobile Actions */}
                        <div className="flex items-center gap-2 sm:gap-4 ml-auto pl-2">
                            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-neutral-200">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-semibold text-neutral-800 leading-none">{user?.name}</span>
                                    <span className="text-xs text-neutral-500 mt-1">{user?.email}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>

                            {/* Mobile Menu Button - Logout/Profile Only */}
                            <button
                                onClick={toggleMobileMenu}
                                className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
                                aria-label="Menu"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Admin Link - Mobile Only (Next Line) */}
                    {user?.admin && (
                        <div className="md:hidden pb-2 -mt-1 flex">
                            <Link
                                key="/admin/verify"
                                to="/admin/verify"
                                className={`flex-1 flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 bg-neutral-100 border border-neutral-200 ${isActive('/admin/verify')
                                    ? 'bg-neutral-900 text-white border-neutral-900'
                                    : 'text-neutral-600'
                                    }`}
                            >
                                <Users size={14} className="mr-1.5" />
                                Verify Accounts
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Overlay */}
                <div
                    className={`md:hidden fixed inset-0 z-40 bg-neutral-900/20 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    onClick={closeMobileMenu}
                />

                {/* Mobile Menu Content - Profile & Logout Only */}
                <div
                    className={`md:hidden fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                        <span className="font-semibold text-neutral-900">Account</span>
                        <button onClick={closeMobileMenu} className="p- text-neutral-500 hover:bg-neutral-100 rounded-lg">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-4">
                        <div className="flex items-center gap-3 mb-6 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xl border-2 border-white shadow-sm">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-neutral-900 truncate">{user?.name}</p>
                                <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => { closeMobileMenu(); logout(); }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-all shadow-sm"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
