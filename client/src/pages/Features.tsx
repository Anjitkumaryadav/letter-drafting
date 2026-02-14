import { Zap, LayoutTemplate, Smartphone, FileText, Share2, Shield } from 'lucide-react';

const Features = () => {
    const features = [
        {
            name: 'AI-Powered Drafting',
            description: 'Describe what you want to say, and let our AI generate a polished, professional letter for you instantly.',
            icon: Zap,
        },
        {
            name: 'Professional Templates',
            description: 'Choose from a variety of industry-standard templates designed for business, legal, and personal use.',
            icon: LayoutTemplate,
        },
        {
            name: 'Mobile Optimized',
            description: 'Draft, edit, and send letters directly from your smartphone. A fully responsive experience.',
            icon: Smartphone,
        },
        {
            name: 'Smart Editing',
            description: 'Refine your drafts with ease. Our editor helps you polish the tone and style of your letters.',
            icon: FileText,
        },
        {
            name: 'Easy Export',
            description: 'Download your letters as PDF or Word documents, or share them directly via email.',
            icon: Share2,
        },
        {
            name: 'Secure & Private',
            description: 'Your drafts are private and secure. We prioritize your data privacy and security.',
            icon: Shield,
        },
    ];

    return (
        <div className="bg-white py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
                    <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Everything you need to write better
                    </p>
                    <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                        Powerful tools designed to help you communicate more effectively and professionally.
                    </p>
                </div>

                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.name} className="pt-6">
                                <div className="flow-root bg-gray-50 rounded-2xl px-6 pb-8 h-full border border-gray-100 hover:shadow-lg transition-all duration-300">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-xl shadow-lg transform transition-transform hover:scale-110">
                                                <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                            </span>
                                        </div>
                                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;
