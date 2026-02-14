import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-2 md:col-span-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start mb-4">
                            <span className="text-2xl font-extrabold tracking-tight text-white">Quick Letters</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">
                            Empowering professionals with AI-driven documentation tools. Simplify your workflow today.
                        </p>
                        <div className="flex space-x-4 justify-center md:justify-start">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li><Link to="/features" className="text-base text-gray-400 hover:text-white transition-colors">Features</Link></li>
                            <li><Link to="/pricing" className="text-base text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                            <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Templates</a></li>
                            <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Showcase</a></li>
                        </ul>
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-base text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                            <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Careers</a></li>
                            <li><Link to="/contact" className="text-base text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div className="col-span-2 md:col-span-1 text-center md:text-left">
                        <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <p className="text-base text-gray-400 mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} Quick Letters. All rights reserved.
                    </p>
                    <div className="items-center flex">
                        <a href="mailto:support@quickletters.online" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            support@quickletters.online
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
