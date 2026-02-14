import { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import qrCode from '../assets/qr.jpg';

const Pricing = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="bg-gray-50 py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Pricing</h2>
                    <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Simple, transparent pricing
                    </p>
                    <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                        No hidden fees. One plan, everything included.
                    </p>
                </div>

                <div className="mt-12 max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex">
                    <div className="flex-1 bg-white px-6 py-8 lg:p-12">
                        <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Premium Access</h3>
                        <p className="mt-6 text-base text-gray-500">
                            Get full access to all our AI-powered drafting tools, templates, and export features. Perfect for professionals and businesses.
                        </p>
                        <div className="mt-8">
                            <div className="flex items-center">
                                <h4 className="flex-shrink-0 pr-4 bg-white text-sm tracking-wider font-semibold uppercase text-indigo-600">
                                    What's included
                                </h4>
                                <div className="flex-1 border-t-2 border-gray-200" />
                            </div>
                            <ul className="mt-8 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5">
                                {[
                                    'Unlimited AI Drafts',
                                    'Access to All Templates',
                                    'Export to PDF & Word',
                                    'Priority Support',
                                    'Save & Manage History',
                                    'Mobile Optimized'
                                ].map((feature) => (
                                    <li key={feature} className="flex items-start lg:col-span-1">
                                        <div className="flex-shrink-0">
                                            <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                                        </div>
                                        <p className="ml-3 text-sm text-gray-700">{feature}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="py-8 px-6 text-center bg-gray-50 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
                        <p className="text-lg leading-6 font-medium text-gray-900">Pay once, use all year</p>
                        <div className="mt-4 flex items-center justify-center text-5xl font-extrabold text-gray-900">
                            <span>₹500</span>
                            <span className="ml-3 text-xl font-medium text-gray-500">INR</span>
                        </div>
                        <p className="mt-4 text-sm">
                            <span className="font-light text-gray-500">per year</span>
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={openModal}
                                className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                            >
                                Start Your Journey
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* QR Code Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                            onClick={closeModal}
                        ></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                    onClick={closeModal}
                                >
                                    <span className="sr-only">Close</span>
                                    <X className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Scan to Pay
                                    </h3>
                                    <div className="mt-4">
                                        <img
                                            src={qrCode}
                                            alt="Payment QR Code"
                                            className="mx-auto h-64 w-64 object-contain border border-gray-200 rounded-lg"
                                        />
                                        <p className="mt-2 text-sm text-gray-500">
                                            Scan this QR code with any UPI app to pay ₹500.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:text-sm"
                                    onClick={closeModal}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pricing;
