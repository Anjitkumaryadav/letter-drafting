import { Link } from 'react-router-dom';
import { CheckCircle, Zap, LayoutTemplate, Smartphone } from 'lucide-react';

const LandingPage = () => {
    return (
        <main className="flex-grow">
            {/* Hero Section */}
            <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 animate-fade-in">
                            Draft Professional Letters <br className="hidden sm:block" />
                            <span className="text-indigo-600">in Seconds with AI</span>
                        </h1>
                        <p className="mt-4 text-xl text-gray-600 mb-8 animate-fade-in delay-100">
                            Streamline your business correspondence. Create, edit, and manage professional letters effortless using our AI-powered platform.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in delay-200">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-8 py-3.5 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                            >
                                Get Started for Free
                            </Link>
                            <Link
                                to="/login"
                                className="w-full sm:w-auto px-8 py-3.5 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 md:text-lg transition-colors"
                            >
                                Login to Account
                            </Link>
                        </div>
                        <p className="mt-6 text-sm text-gray-500 animate-fade-in delay-300">
                            <span className="inline-flex items-center">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                Simple pricing: <span className="font-semibold text-gray-700 ml-1">₹500 per year</span>
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-16 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Everything you need to write better
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                            Powerful tools designed to help you communicate more effectively and professionally.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                <Zap className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Drafting</h3>
                            <p className="text-gray-600">
                                Describe what you want to say, and let our AI generate a polished, professional letter for you instantly.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                <LayoutTemplate className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Templates</h3>
                            <p className="text-gray-600">
                                Choose from a variety of industry-standard templates designed for business, legal, and personal use.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                <Smartphone className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile Optimized</h3>
                            <p className="text-gray-600">
                                Draft, edit, and send letters directly from your smartphone. A fully responsive experience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="px-6 py-8 sm:p-10 sm:pb-6">
                            <div className="flex justify-center">
                                <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600">
                                    Premium Access
                                </span>
                            </div>
                            <div className="mt-4 flex justify-center text-6xl font-extrabold text-gray-900">
                                <span className="text-3xl font-medium text-gray-500 mt-2 mr-1">₹</span>
                                500
                                <span className="ml-1 text-2xl font-medium text-gray-500 self-end mb-2">/year</span>
                            </div>
                            <p className="mt-4 text-center text-lg text-gray-600">
                                Get unlimited access to all features with one simple annual plan.
                            </p>
                        </div>
                        <div className="px-6 pt-6 pb-8 bg-gray-50 sm:p-10 sm:pt-6">
                            <ul className="space-y-4">
                                {[
                                    'Unlimited AI Drafts',
                                    'Access to All Templates',
                                    'Export to PDF & Word',
                                    'Priority Support',
                                    'Save & Manage History'
                                ].map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <CheckCircle className="h-6 w-6 text-green-500" />
                                        </div>
                                        <p className="ml-3 text-base text-gray-700">{feature}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8">
                                <Link
                                    to="/register"
                                    className="block w-full text-center px-6 py-4 border border-transparent rounded-xl shadow-md text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                                >
                                    Start Your Journey
                                </Link>
                                {/* <p className="mt-4 text-center text-sm text-gray-500">
                                        No credit card required for sign up.
                                    </p> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-indigo-700 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
                        Ready to transform your writing?
                    </h2>
                    <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of professionals who save time and write better with LetterAI.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/register"
                            className="px-8 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg shadow-sm transition-colors"
                        >
                            Get Started Now
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-3 border border-indigo-500 text-base font-medium rounded-lg text-white hover:bg-indigo-600 md:py-4 md:text-lg transition-colors"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </section>
        </main >
    );
};

export default LandingPage;
