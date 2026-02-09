import React from 'react';

interface LetterheadPreviewProps {
    name: string;
    address: string;
    phone?: string;
    email?: string;
    website?: string;
    logoUrl?: string;
    sealUrl?: string;
}

const LetterheadPreview: React.FC<LetterheadPreviewProps> = ({
    name,
    address,
    phone,
    email,
    website,
    logoUrl,
    sealUrl,
}) => {
    return (
        <div className="w-full bg-white border border-gray-200 shadow-sm aspect-[210/297] relative p-12 text-gray-800 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between pb-6 mb-8 border-b-2 border-gray-800">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">{name || 'Business Name'}</h1>
                    <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">{address || '123 Business St, City, State'}</p>
                </div>
                {logoUrl && (
                    <img src={logoUrl} alt="Logo" className="w-24 h-24 object-contain" />
                )}
            </div>

            {/* Body Placeholder */}
            <div className="flex-grow">
                <p className="text-gray-400 italic text-center mt-20">[ Letter Content Will Go Here ]</p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-300 flex justify-between items-end relative">
                <div className="text-sm text-gray-500">
                    {phone && <p>Phone: {phone}</p>}
                    {email && <p>Email: {email}</p>}
                    {website && <p>Web: {website}</p>}
                </div>

                {sealUrl && (
                    <div className="absolute right-0 bottom-0 opacity-80">
                        <img src={sealUrl} alt="Seal" className="w-24 h-24 object-contain" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LetterheadPreview;
