import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, LayoutTemplate, Smartphone } from 'lucide-react';

const LandingPage = () => {
    const [videoLanguage, setVideoLanguage] = useState<'hindi' | 'english'>('hindi');

    return (
        <main className="flex-grow font-sans">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-8 pb-4 lg:pt-8 lg:pb-5 bg-neutral-50">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-2 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                        </span>
                        AI-Powered Business Correspondence
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 tracking-tight mb-6 max-w-4xl mx-auto leading-tight animate-slide-up">
                        Write professional letters <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                            in seconds, not hours.
                        </span>
                    </h1>

                    <p className="mt-1 max-w-2xl mx-auto text-xl text-neutral-600 mb-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Create, format, and manage business correspondence with intelligent templates and AI assistance. Perfect for Indian businesses.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Link to="/register" className="btn btn-primary px-8 py-4 text-lg rounded-2xl shadow-lg shadow-primary-500/30">
                            Start Drafting Free
                        </Link>
                        <Link to="#features" className="btn btn-secondary px-8 py-4 text-lg rounded-2xl">
                            View Features
                        </Link>
                    </div>

                    {/* Hero Visual Abstract */}
                    {/* <div className="mt-20 relative w-full max-w-5xl mx-auto perspective-1000 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="relative rounded-2xl bg-white border border-neutral-200 shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] transform rotate-x-12 hover:rotate-0 transition-transform duration-700 ease-out group">
                            <div className="absolute inset-0 bg-neutral-100/50" />
                            <div className="absolute top-0 left-0 w-full h-12 bg-white border-b border-neutral-100 flex items-center px-4 space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="p-8 md:p-12 flex justify-center items-center h-full">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Zap size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-900">AI Editor Preview</h3>
                                    <p className="text-neutral-500">Your drafted letters appear here...</p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    {/* Video Section */}

                </div>
            </section>
            <section className="py-2 bg-neutral-50 border-t border-neutral-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-display font-bold text-neutral-900 mb-8 animate-slide-up">
                        See How It Works
                    </h2>

                    <div className="mb-8 inline-flex space-x-2 p-1 bg-white rounded-full border border-neutral-200 shadow-sm animate-slide-up">
                        <button
                            onClick={() => setVideoLanguage('hindi')}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${videoLanguage === 'hindi'
                                ? 'bg-primary-600 text-white shadow-md transform scale-105'
                                : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                        >
                            Hindi
                        </button>
                        <button
                            onClick={() => setVideoLanguage('english')}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${videoLanguage === 'english'
                                ? 'bg-primary-600 text-white shadow-md transform scale-105'
                                : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                        >
                            English
                        </button>
                    </div>

                    <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-2xl shadow-xl bg-neutral-900 border-4 border-white animate-slide-up">
                        <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={videoLanguage === 'hindi'
                                ? "https://www.youtube.com/embed/YGrHrcHg6zY?si=hXf-gmlynsnSrOAL" // Replace with Hindi Video ID
                                : "https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with English Video ID
                            }
                            title="Product Demo"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-display font-bold text-neutral-900 sm:text-4xl">
                            Everything you need to write better
                        </h2>
                        <p className="mt-4 text-lg text-neutral-600">
                            Powerful tools designed to streamline your communication workflow.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card p-8 hover:border-primary-200 transition-colors group">
                            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                <LayoutTemplate size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-3">Custom Designs</h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Choose from professionally crafted templates suitable for official, legal, and business use.
                            </p>
                        </div>
                        <div className="card p-8 hover:border-primary-200 transition-colors group">
                            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                <CheckCircle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-3">AI Powered Writing</h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Let our AI engine expand your bullet points into polite, professional full letters in seconds.
                            </p>
                        </div>
                        <div className="card p-8 hover:border-primary-200 transition-colors group">
                            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Smartphone size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-3">Mobile Optimized</h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Edit, save, and export PDFs directly from your phone. Perfect for business on the go.
                            </p>
                        </div>
                    </div>
                </div>
            </section>



            {/* Pricing Section */}
            <section className="py-24 bg-white border-t border-neutral-200">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-display font-bold text-neutral-900 sm:text-4xl mb-6">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-lg text-neutral-600 mb-12">
                        One simple plan for unlimited access. No hidden fees.
                    </p>

                    <div className="relative transform hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute inset-0 bg-primary-600 blur-3xl opacity-10 rounded-[3rem]" />
                        <div className="relative bg-white rounded-3xl shadow-xl border border-neutral-100 overflow-hidden">
                            <div className="px-6 py-10 sm:p-12">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-primary-600 tracking-wide uppercase">Premium Access</h3>
                                    <div className="mt-4 flex items-justify-center items-baseline justify-center text-neutral-900">
                                        <span className="text-5xl font-extrabold tracking-tight">₹500</span>
                                        <span className="ml-2 text-xl font-medium text-neutral-500">/ year</span>
                                    </div>
                                    <p className="mt-4 text-neutral-500">
                                        Get full access to all templates, AI generation, and unlimited PDF downloads.
                                    </p>
                                </div>
                                <div className="mt-10">
                                    <ul className="space-y-4 text-left max-w-md mx-auto">
                                        {[
                                            'Unlimited Letter Generation',
                                            'Premium Templates Access',
                                            'Priority Email Support',
                                            'Ad-free Experience',
                                            'Save Unlimited Drafts'
                                        ].map((feature) => (
                                            <li key={feature} className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <CheckCircle className="h-6 w-6 text-green-500" />
                                                </div>
                                                <p className="ml-3 text-base text-neutral-600">{feature}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-10">
                                    <Link to="/register" className="btn btn-primary w-full py-4 text-lg rounded-xl shadow-lg shadow-primary-500/20">
                                        Get Started Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default LandingPage;
