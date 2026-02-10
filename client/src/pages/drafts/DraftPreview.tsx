import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { ArrowLeft, CheckCircle, Printer } from 'lucide-react';

interface Business {
    _id: string;
    name: string;
    address: string;
    email: string;
    phone: string;
    logo?: string;
    seal?: string;
}

interface Recipient {
    _id: string;
    name: string;
    contactPerson?: string;
    address: string;
}

interface Draft {
    _id: string;
    refNo: string;
    date: string;
    subject: string;
    content: string;
    includeSeal: boolean;
    businessId: Business; // Populated
    recipientId: Recipient; // Populated
    status: string;
}


// @ts-ignore
import html2pdf from 'html2pdf.js';
// @ts-ignore
import { asBlob } from 'html-docx-js-typescript';
import { saveAs } from 'file-saver';
import { FileDown, FileText } from 'lucide-react';

const DraftPreview: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [draft, setDraft] = useState<Draft | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDraft = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/drafts/${id}`);
                setDraft(response.data);
            } catch (error) {
                console.error('Error fetching draft:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDraft();
    }, [id]);

    const handleDownloadPDF = () => {
        const element = document.getElementById('letter-preview');
        const opt = {
            margin: 0, // No margin, we control it via CSS
            filename: `${draft?.subject || 'letter'}.pdf`,
            image: { type: 'jpeg', quality: 1 }, // Max quality
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: true,
                letterRendering: true,
                windowWidth: 794 // A4 width in px at 96 DPI approx (210mm)
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    const handleDownloadDOC = async () => {
        if (!draft) return;

        const element = document.getElementById('letter-preview');
        if (!element) return;

        // Clone to modify for DOCX if needed (e.g. remove specific classes)
        // For now, we take the innerHTML. 
        // Note: html-docx-js needs a full HTML structure for best results.
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${draft.subject}</title>
                <style>
                    body { font-family: 'Times New Roman', serif; font-size: 12pt; }
                    h1 { font-size: 24pt; text-align: center; font-weight: bold; text-transform: uppercase; }
                    p { margin-bottom: 10pt; }
                    .header { text-align: center; margin-bottom: 20pt; border-bottom: 2px solid black; padding-bottom: 10pt; }
                    .footer { text-align: right; margin-top: 40pt; }
                    .seal { width: 100px; height: 100px; }
                </style>
            </head>
            <body>
                ${element.innerHTML}
            </body>
            </html>
        `;

        try {
            const blob = await asBlob(htmlContent);
            saveAs(blob, `${draft.subject || 'letter'}.docx`);
        } catch (error) {
            console.error('DOCX generation failed:', error);
            alert('Failed to generate DOCX');
        }
    };

    const handleFinalize = async () => {
        if (!draft || !window.confirm('Are you sure you want to finalize this letter? This will lock the draft.')) return;

        try {
            await axios.patch(`http://localhost:3000/drafts/${id}`, { status: 'FINAL' });
            alert('Letter finalized successfully!');
            navigate('/');
        } catch (error) {
            console.error('Error finalizing:', error);
            alert('Failed to finalize.');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading Preview...</div>;
    if (!draft) return <div className="flex justify-center items-center h-screen text-red-500">Draft not found</div>;

    const { businessId: business, recipientId: recipient } = draft;

    // Defensive checks
    if (!business) return <div className="flex justify-center items-center h-screen text-orange-500">Draft has no Business selected. Please edit and select a business.</div>;
    // recipient might be optional in some flows, but for now let's warn
    if (!recipient) return <div className="flex justify-center items-center h-screen text-orange-500">Draft has no Recipient selected. Please edit and select a recipient.</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
            {/* Toolbar */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-6 px-4">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900">
                    <ArrowLeft size={20} className="mr-2" /> Back to Edit
                </button>
                <div className="flex space-x-3">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center px-4 py-2 bg-white text-gray-700 border rounded hover:bg-gray-50 shadow-sm"
                    >
                        <Printer size={18} className="mr-2" /> Print
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center px-4 py-2 bg-white text-gray-700 border rounded hover:bg-gray-50 shadow-sm"
                    >
                        <FileDown size={18} className="mr-2" /> PDF
                    </button>
                    <button
                        onClick={handleDownloadDOC}
                        className="flex items-center px-4 py-2 bg-white text-gray-700 border rounded hover:bg-gray-50 shadow-sm"
                    >
                        <FileText size={18} className="mr-2" /> DOC
                    </button>
                    <button
                        onClick={handleFinalize}
                        className="flex items-center px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
                    >
                        <CheckCircle size={18} className="mr-2" /> Finalize Letter
                    </button>
                </div>
            </div>

            {/* A4 Paper Preview */}
            <div id="letter-preview" className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-[20mm] relative mx-auto print:shadow-none print:w-full">

                {/* Header */}
                <header className="flex items-center border-b-2 border-gray-800 pb-6 mb-8">
                    {business.logo && (
                        <img
                            src={`http://localhost:3000${business.logo}`}
                            alt="Logo"
                            crossOrigin="anonymous"
                            className="h-24 w-24 object-contain mr-6"
                        />
                    )}
                    <div className="flex-1 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wider">{business.name}</h1>
                        <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{business.address}</p>
                        <div className="flex justify-center space-x-4 mt-1 text-xs text-gray-500">
                            {business.email && <span>Email: {business.email}</span>}
                            {business.phone && <span>Phone: {business.phone}</span>}
                        </div>
                    </div>
                </header>

                {/* Meta Info */}
                <div className="flex justify-between mb-8 text-sm">
                    <div>
                        <p className="font-semibold">Ref No: {draft.refNo}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Date: {draft.date ? format(new Date(draft.date), 'dd MMMM, yyyy') : ''}</p>
                    </div>
                </div>

                {/* Recipient */}
                <div className="mb-8 ml-4">
                    <p className="font-bold">To,</p>
                    <p className="font-semibold">{recipient.name}</p>
                    {recipient.contactPerson && <p>{recipient.contactPerson}</p>}
                    <p className="whitespace-pre-line text-gray-700">{recipient.address}</p>
                </div>

                {/* Subject */}
                <div className="mb-8 ml-4">
                    <p className="font-bold underline">Subject: {draft.subject}</p>
                </div>

                {/* Content */}
                <div
                    className="prose max-w-none mb-16 text-justify leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: draft.content }}
                />

                {/* Footer / Seal */}
                <div className="flex flex-col items-end mt-12 pr-8">
                    <p className="font-semibold text-gray-800">For {business.name}</p>

                    <div className="h-32 w-48 flex items-center justify-center relative my-4">
                        {draft.includeSeal && business.seal ? (
                            <img
                                src={`http://localhost:3000${business.seal}`}
                                alt="Seal"
                                crossOrigin="anonymous"
                                className="h-28 w-28 object-contain opacity-90 rotate-[-10deg]"
                            />
                        ) : (
                            <div className="h-24 w-full" /> // Spacer for manual signature
                        )}
                    </div>

                    <p className="font-semibold border-t border-gray-400 pt-2 px-4">Authorized Signatory</p>
                </div>

            </div>
        </div>
    );
};

export default DraftPreview;
