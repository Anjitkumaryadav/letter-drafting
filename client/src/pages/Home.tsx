import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-xl font-bold text-blue-600">Bharat Business</Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Welcome, {user?.name}</span>
                            <button
                                onClick={logout}
                                className="flex items-center px-3 py-2 text-sm text-red-600 transition rounded hover:bg-red-50"
                            >
                                <LogOut size={16} className="mr-1" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="px-4 py-8 bg-white rounded-lg shadow sm:px-0">
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-gray-300 border-dashed rounded-lg">
                        <h2 className="text-2xl font-semibold text-gray-500">Dashboard</h2>
                        <p className="mt-2 text-gray-400">Select a module to get started</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
