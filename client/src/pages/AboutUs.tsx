const AboutUs = () => {
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">About Us</h2>
                    <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Empowering Communication.
                    </p>
                    <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                        At Quick Letters, we believe that professional communication should be accessible, efficient, and effortless.
                    </p>
                </div>

                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                            <p className="text-lg text-gray-500">
                                To provide individuals and businesses with AI-driven tools that simplify the creation of professional documents, saving time and ensuring quality.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                            <p className="text-lg text-gray-500">
                                A world where language barriers and formatting complexities no longer hinder professional growth and business success.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-gray-900">Our Values</h3>
                            <p className="text-lg text-gray-500">
                                Innovation, Simplicity, and User-Centricity are at the core of everything we build.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
