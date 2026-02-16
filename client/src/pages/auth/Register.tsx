import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, User, X } from 'lucide-react';
import qrCode from '../../assets/qr.jpg';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPaymentScreenshot(e.target.files[0]);
        }
    };

    const uploadScreenshot = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post('http://localhost:3000/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.url;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        if (!paymentScreenshot) {
            setError('Please upload a payment screenshot.');
            setLoading(false);
            return;
        }

        try {
            // 1. Upload Screenshot
            const screenshotUrl = await uploadScreenshot(paymentScreenshot);

            // 2. Register User
            await axios.post('http://localhost:3000/auth/register', {
                name,
                phone,
                email,
                password,
                paymentScreenshot: screenshotUrl,
            });

            setSuccessMessage('Registration successful! Please wait for admin approval.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Register</h2>

                {error && <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded border border-red-200">{error}</div>}
                {successMessage && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded border border-green-200">{successMessage}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <User size={18} />
                            </span>
                            <input
                                type="text"
                                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <User size={18} />
                            </span>
                            <input
                                type="tel"
                                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                placeholder="+91 98765 43210"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <Mail size={18} />
                            </span>
                            <input
                                type="email"
                                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <Lock size={18} />
                            </span>
                            <input
                                type="password"
                                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Details</h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 flex flex-col items-center">
                            <p className="text-sm text-gray-600 mb-2">Scan to pay <span className="font-bold text-gray-900">₹500</span></p>
                            <img
                                src={qrCode}
                                alt="Payment QR Code"
                                className="h-40 w-40 object-contain border border-white bg-white shadow-sm p-1 rounded-md"
                            />
                            <p className="mt-2 text-xs text-center text-gray-500">
                                UPI ID: letterdrafting@upi <br />
                                <span className="text-[10px]">(Scan with GPay, PhonePe, Paytm)</span>
                            </p>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Upload Payment Screenshot <span className="text-red-500">*</span></label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-indigo-50 file:text-indigo-700
                                    hover:file:bg-indigo-100
                                "
                            />
                            <p className="mt-1 text-xs text-gray-500">Please upload the screenshot of your successful payment.</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Register'}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    <p className="text-sm text-gray-600">
                        Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login</Link>
                    </p>
                    <p className="text-sm text-gray-600">
                        <Link to="/" className="font-medium text-gray-500 hover:text-gray-900">Back to Home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
