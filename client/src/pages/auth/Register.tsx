import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User } from 'lucide-react';
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
        const response = await axios.post('https://letter-drafting.onrender.com/upload', formData, {
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
            await axios.post('https://letter-drafting.onrender.com/auth/register', {
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
        <div className="min-h-screen flex bg-neutral-50 text-neutral-900 font-sans">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-primary-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-900 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center mix-blend-overlay" />
                <div className="relative z-10 w-full flex flex-col justify-center px-12 text-white">
                    <h1 className="text-5xl font-bold mb-6 font-display">Draft Letters like a Pro.</h1>
                    <p className="text-xl text-primary-100 max-w-lg leading-relaxed">
                        Join thousands of businesses using AI to streamline their correspondence. Professional, fast, and secure.
                    </p>
                    <div className="mt-12 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Premium Accounts</h3>
                                <p className="text-primary-200 text-sm">Access to exclusive templates and features.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-neutral-900 font-display">Create your account</h2>
                        <p className="mt-2 text-neutral-500">
                            Start your journey with Quick Letters today.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm flex items-center gap-2 animate-fade-in">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm flex items-center gap-2 animate-fade-in">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Phone Number</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                className="input-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@company.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Password (of your choice) </label>
                            <input
                                type="password"
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Payment Card */}
                        <div className="mt-8 p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="flex-shrink-0 bg-white p-2 rounded-xl border border-neutral-100 shadow-sm">
                                    <img
                                        src={qrCode}
                                        alt="Payment QR Code"
                                        className="h-32 w-32 object-contain"
                                    />
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="font-bold text-neutral-900">One-time Payment: ₹500</h3>
                                    <p className="text-sm text-neutral-500 mt-1 mb-3">Scan via any UPI app to activate your premium account.</p>

                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            id="payment-upload"
                                            className="hidden"
                                            required
                                        />
                                        <label
                                            htmlFor="payment-upload"
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-dashed transition-colors cursor-pointer w-full justify-center sm:justify-start
                                                ${paymentScreenshot
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50'
                                                }`}
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            {paymentScreenshot ? paymentScreenshot.name : "Upload Payment Screenshot"}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full py-3 text-base shadow-lg shadow-primary-500/25 mt-6"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center space-y-4">
                        <p className="text-neutral-600">
                            Already have an account? <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">Log in</Link>
                        </p>
                        <p className="text-sm">
                            <Link to="/" className="text-neutral-500 hover:text-neutral-800 transition-colors">Back to Home</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
