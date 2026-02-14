import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const PublicNavbar = () => {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="ml-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-blue-700">
                            <img className="w-10 h-10 sm:w-16 sm:h-16" src={logo} alt="Quick Letters" />
                        </Link>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default PublicNavbar;
