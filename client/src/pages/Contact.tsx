import { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        if (!formData.phone) {
            setStatus('error');
            setErrorMessage('Phone number is required.');
            return;
        }

        try {
            await axios.post('https://letter-drafting.onrender.com/contacts', {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                phone: formData.phone,
                message: formData.message
            });
            setStatus('success');
            setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
        } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Failed to send message. Please try again.');
        }
    };

    const isFormValid = formData.phone.trim() !== '';

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
                <div className="relative bg-white shadow-xl">
                    <h2 className="sr-only">Contact us</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3">
                        {/* Contact Information */}
                        <div className="relative overflow-hidden py-10 px-6 bg-indigo-700 sm:px-10 xl:p-12">
                            {/* ... (Keep existing SVG background and info) ... */}
                            <div className="absolute inset-0 pointer-events-none sm:hidden" aria-hidden="true">
                                <svg
                                    className="absolute inset-0 w-full h-full"
                                    width={343}
                                    height={388}
                                    viewBox="0 0 343 388"
                                    fill="none"
                                    preserveAspectRatio="xMidYMid slice"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M-99 461.107L608.107-246l707.103 707.107-707.103 707.103L-99 461.107z"
                                        fill="url(#linear1)"
                                        fillOpacity=".1"
                                    />
                                    <defs>
                                        <linearGradient
                                            id="linear1"
                                            x1="254.553"
                                            y1="107.554"
                                            x2="961.66"
                                            y2="814.66"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop stopColor="#fff" />
                                            <stop offset={1} stopColor="#fff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div
                                className="hidden absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none sm:block lg:hidden"
                                aria-hidden="true"
                            >
                                <svg
                                    className="absolute inset-0 w-full h-full"
                                    width={359}
                                    height={339}
                                    viewBox="0 0 359 339"
                                    fill="none"
                                    preserveAspectRatio="xMidYMid slice"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M-161 382.107L546.107-325l707.103 707.107-707.103 707.103L-161 382.107z"
                                        fill="url(#linear2)"
                                        fillOpacity=".1"
                                    />
                                    <defs>
                                        <linearGradient
                                            id="linear2"
                                            x1="192.553"
                                            y1="28.553"
                                            x2="899.66"
                                            y2="735.66"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop stopColor="#fff" />
                                            <stop offset={1} stopColor="#fff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div
                                className="hidden absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none lg:block"
                                aria-hidden="true"
                            >
                                <svg
                                    className="absolute inset-0 w-full h-full"
                                    width={160}
                                    height={678}
                                    viewBox="0 0 160 678"
                                    fill="none"
                                    preserveAspectRatio="xMidYMid slice"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M-161 679.107L546.107-28l707.103 707.107-707.103 707.103L-161 679.107z"
                                        fill="url(#linear3)"
                                        fillOpacity=".1"
                                    />
                                    <defs>
                                        <linearGradient
                                            id="linear3"
                                            x1="192.553"
                                            y1="325.553"
                                            x2="899.66"
                                            y2="1032.66"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop stopColor="#fff" />
                                            <stop offset={1} stopColor="#fff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-white">Contact Information</h3>
                            <p className="mt-6 text-base text-indigo-50 max-w-3xl">
                                Have questions or need support? Reach out to us directly or fill out the form.
                            </p>
                            <dl className="mt-8 space-y-6">
                                <dt>
                                    <span className="sr-only">Phone number</span>
                                </dt>
                                <dd className="flex text-base text-indigo-50">
                                    <Phone className="flex-shrink-0 w-6 h-6 text-indigo-200" aria-hidden="true" />
                                    <span className="ml-3">+91 75666 19578</span>
                                </dd>
                                <dt>
                                    <span className="sr-only">Email</span>
                                </dt>
                                <dd className="flex text-base text-indigo-50">
                                    <Mail className="flex-shrink-0 w-6 h-6 text-indigo-200" aria-hidden="true" />
                                    <span className="ml-3">support@bharatbusinessdeals.com</span>
                                </dd>
                                <dt>
                                    <span className="sr-only">Address</span>
                                </dt>
                                <dd className="flex text-base text-indigo-50">
                                    <MapPin className="flex-shrink-0 w-6 h-6 text-indigo-200" aria-hidden="true" />
                                    <span className="ml-3">
                                        India
                                    </span>
                                </dd>
                            </dl>
                        </div>

                        {/* Contact Form */}
                        <div className="py-10 px-6 sm:px-10 lg:col-span-2 xl:p-12">
                            <h3 className="text-lg font-medium text-gray-900">Send us a message</h3>
                            {status === 'success' ? (
                                <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <Send className="h-5 w-5 text-green-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-green-800">Message sent successfully</h3>
                                            <div className="mt-2 text-sm text-green-700">
                                                <p>Thank you for contacting us. We will get back to you shortly.</p>
                                            </div>
                                            <div className="mt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setStatus('idle')}
                                                    className="bg-green-100 px-3 py-2 rounded-md text-sm font-medium text-green-800 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                >
                                                    Send another message
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                                    {status === 'error' && (
                                        <div className="sm:col-span-2 bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-600">
                                            {errorMessage}
                                        </div>
                                    )}
                                    <div>
                                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-900">
                                            First name
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="firstName"
                                                id="first-name"
                                                autoComplete="given-name"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-900">
                                            Last name
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="lastName"
                                                id="last-name"
                                                autoComplete="family-name"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                            Email
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                autoComplete="tel"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-900">
                                            Message
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={4}
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <button
                                            type="submit"
                                            disabled={!isFormValid || status === 'loading'}
                                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <Send className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </button>
                                        {!isFormValid && (
                                            <p className="mt-2 text-sm text-red-500 text-center">
                                                Please fill in the required phone number field to send.
                                            </p>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
