import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { ArrowLeft, CheckCircle, Printer, Move, Save, RotateCcw } from 'lucide-react';

interface Business {
    _id: string;
    name: string;
    address: string;
    email: string;
    phone: string;
    headerImage?: string;
    footerImage?: string;
    sealUrl?: string;
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
    layout?: LayoutConfig;
}

interface LayoutItem {
    x: number;
    y: number;
    w?: number; // width in mm (optional)
}

interface LayoutConfig {
    header: LayoutItem;
    date: LayoutItem;
    ref: LayoutItem;
    recipient: LayoutItem;
    subject: LayoutItem;
    content: LayoutItem;
    footer: LayoutItem;
    seal: LayoutItem;
    signatory: LayoutItem;
}

// Default layout positions in MM (approximate standard letter)
const DEFAULT_LAYOUT: LayoutConfig = {
    header: { x: 0, y: 0 },
    ref: { x: 20, y: 50 },
    date: { x: 140, y: 50 },
    recipient: { x: 20, y: 70 },
    subject: { x: 20, y: 110 },
    content: { x: 20, y: 130 },
    seal: { x: 150, y: 220 },
    signatory: { x: 150, y: 250 },
    footer: { x: 0, y: 280 }
};

// @ts-ignore
import html2pdf from 'html2pdf.js';
// @ts-ignore
import { asBlob } from 'html-docx-js-typescript';
import { saveAs } from 'file-saver';
import { FileDown, FileText, Settings } from 'lucide-react';

const DraftPreview: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [draft, setDraft] = useState<Draft | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [layout, setLayout] = useState<LayoutConfig>(DEFAULT_LAYOUT);
    const [draggingItem, setDraggingItem] = useState<keyof LayoutConfig | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchDraft = async () => {
            try {
                const response = await axios.get(`https://kk01km6g-3000.inc1.devtunnels.ms/drafts/${id}`);
                setDraft(response.data);
                if (response.data.layout) {
                    setLayout(response.data.layout);
                }
            } catch (error) {
                console.error('Error fetching draft:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDraft();
    }, [id]);

    const handleMouseDown = (e: React.MouseEvent, item: keyof LayoutConfig) => {
        if (!isCustomizing) return;
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;

        // Calculate offset (mouse position relative to item position)
        // We need to convert screen pixels to mm relative to the container
        // But for simplicity in dragging, we just track delta
        setDraggingItem(item);
        setDragOffset({ x: startX, y: startY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggingItem || !previewRef.current) return;

        const deltaXPixels = e.clientX - dragOffset.x;
        const deltaYPixels = e.clientY - dragOffset.y;

        // Convert pixels to MM. 
        // A4 is 210mm wide. Container is 210mm.
        // Get scale factor: mm / px
        const containerWidthPx = previewRef.current.offsetWidth;
        const mmPerPx = 210 / containerWidthPx;

        const deltaX = deltaXPixels * mmPerPx;
        const deltaY = deltaYPixels * mmPerPx;

        setLayout(prev => ({
            ...prev,
            [draggingItem]: {
                ...prev[draggingItem],
                x: prev[draggingItem].x + deltaX,
                y: prev[draggingItem].y + deltaY
            }
        }));

        setDragOffset({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setDraggingItem(null);
    };

    const handleSaveLayout = async () => {
        if (!draft) return;
        try {
            await axios.patch(`https://kk01km6g-3000.inc1.devtunnels.ms/drafts/${id}`, { layout });
            setIsCustomizing(false);
            alert('Layout saved!');
            setDraft({ ...draft, layout });
        } catch (error) {
            console.error('Error saving layout:', error);
            alert('Failed to save layout');
        }
    };

    const handleResetLayout = () => {
        if (window.confirm('Reset to default layout?')) {
            setLayout(DEFAULT_LAYOUT);
        }
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('letter-preview-content');
        const opt = {
            margin: 0,
            filename: `${draft?.subject || 'letter'}.pdf`,
            image: { type: 'jpeg' as const, quality: 1 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: true,
                letterRendering: true,
                windowWidth: 794
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
        };

        if (element) {
            html2pdf().set(opt).from(element).save();
        }
    };

    const handleDownloadDOC = async () => {
        // DOC generation logic (omitted for brevity, can be refined to use layout if possible or fallback)
        // For now using same logic as before but warning user layout might not match exactly
        alert("DOCX export might not perfectly match custom layouts. PDF is recommended.");
        // ... existing DOC logic ...
        if (!draft) return;

        const element = document.getElementById('letter-preview-content');
        if (!element) return;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${draft.subject}</title>
                 <style>
                    body { font-family: 'Times New Roman', serif; font-size: 12pt; }
                </style>
            </head>
            <body>
                ${element.innerHTML}
            </body>
            </html>
        `;

        try {
            const blob = await asBlob(htmlContent);
            saveAs(blob as Blob, `${draft.subject || 'letter'}.docx`);
        } catch (error) {
            console.error('DOCX generation failed:', error);
            alert('Failed to generate DOCX');
        }
    };

    const handleFinalize = async () => {
        if (!draft || !window.confirm('Are you sure you want to finalize this letter? This will lock the draft.')) return;

        try {
            await axios.patch(`https://kk01km6g-3000.inc1.devtunnels.ms/drafts/${id}`, { status: 'FINAL' });
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

    if (!business) return <div className="flex justify-center items-center h-screen text-orange-500">Draft has no Business selected.</div>;
    // if (!recipient) ...

    // Helper to render draggable item
    const renderItem = (key: keyof LayoutConfig, content: React.ReactNode, className = "") => {
        const pos = layout[key];
        const style: React.CSSProperties = {
            position: 'absolute',
            left: `${pos.x}mm`,
            top: `${pos.y}mm`,
            cursor: isCustomizing ? 'move' : 'default',
            width: pos.w ? `${pos.w}mm` : 'auto',
            border: isCustomizing ? '1px dashed #ccc' : 'none',
            zIndex: draggingItem === key ? 10 : 1
        };

        return (
            <div
                style={style}
                className={className}
                onMouseDown={(e) => handleMouseDown(e, key)}
            >
                {/* Visual guide for drag handle if needed, or just drag whole element */}
                {isCustomizing && <div className="absolute -top-3 -right-3 bg-blue-500 rounded-full p-1 opacity-50 hover:opacity-100"><Move size={8} color="white" /></div>}
                {content}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            {/* Toolbar */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-6 px-4">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900">
                    <ArrowLeft size={20} className="mr-2" /> Back to Edit
                </button>
                <div className="flex space-x-3 items-center">

                    {isCustomizing ? (
                        <>
                            <span className="text-sm font-bold text-blue-600 animate-pulse mr-2">Customizing Layout...</span>
                            <button onClick={handleResetLayout} className="p-2 text-gray-600 hover:text-red-600" title="Reset Layout"><RotateCcw size={18} /></button>
                            <button onClick={handleSaveLayout} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm">
                                <Save size={18} className="mr-2" /> Save Layout
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsCustomizing(true)} className="flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded hover:bg-blue-50 shadow-sm">
                            <Settings size={18} className="mr-2" /> Customize Layout
                        </button>
                    )}

                    {!isCustomizing && (
                        <>
                            <button onClick={() => window.print()} className="flex items-center px-3 py-2 bg-white text-gray-700 border rounded hover:bg-gray-50 shadow-sm">
                                <Printer size={18} />
                            </button>
                            <button onClick={handleDownloadPDF} className="flex items-center px-3 py-2 bg-white text-gray-700 border rounded hover:bg-gray-50 shadow-sm">
                                <FileDown size={18} className="mr-2" /> PDF
                            </button>
                            <button onClick={handleDownloadDOC} className="flex items-center px-3 py-2 bg-white text-gray-700 border rounded hover:bg-gray-50 shadow-sm">
                                <FileText size={18} className="mr-2" /> DOC
                            </button>
                            <button onClick={handleFinalize} className="flex items-center px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700">
                                <CheckCircle size={18} className="mr-2" /> Finalize
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* A4 Paper Preview Container */}
            <div
                ref={previewRef}
                className="bg-gray-200 p-4 rounded shadow-inner"
            >
                <div
                    id="letter-preview-content"
                    className="bg-white shadow-2xl w-[210mm] h-[297mm] relative mx-auto print:shadow-none print:w-full overflow-hidden"
                >
                    {/* Header Image */}
                    {renderItem('header', business.headerImage ? (
                        <img src={business.headerImage.startsWith('http') ? business.headerImage : `https://kk01km6g-3000.inc1.devtunnels.ms${business.headerImage}`} alt="Header" className="w-[210mm] object-contain" />
                    ) : <div className="p-4 border font-bold text-center w-[210mm]">NO HEADER IMAGE</div>)}

                    {/* Reference */}
                    {renderItem('ref', <p className="font-semibold text-sm">Ref: {draft.refNo}</p>)}

                    {/* Date */}
                    {renderItem('date', <p className="font-semibold text-sm">Date: {draft.date ? format(new Date(draft.date), 'dd MMMM, yyyy') : ''}</p>)}

                    {/* Recipient */}
                    {renderItem('recipient', (
                        <div className="text-sm">
                            <p className="font-bold">To,</p>
                            <p className="font-semibold">{recipient?.name}</p>
                            {recipient?.contactPerson && <p>{recipient.contactPerson}</p>}
                            <p className="whitespace-pre-line text-gray-700 w-[80mm]">{recipient?.address}</p>
                        </div>
                    ))}

                    {/* Subject */}
                    {renderItem('subject', <p className="font-bold underline text-sm w-[170mm]">Subject: {draft.subject}</p>)}

                    {/* Content */}
                    {renderItem('content', (
                        <div
                            className="prose max-w-none text-justify leading-relaxed text-sm w-[170mm]"
                            dangerouslySetInnerHTML={{ __html: draft.content }}
                        />
                    ))}

                    {/* Signatory Area */}
                    {renderItem('signatory', (
                        <div className="text-right">
                            <p className="font-semibold text-gray-800 text-sm">For {business.name}</p>
                            <div className="h-20"></div> {/* Space for seal/sign */}
                            <p className="font-semibold border-t border-gray-400 pt-2 px-4 inline-block text-sm">Authorized Signatory</p>
                        </div>
                    ))}

                    {/* Seal */}
                    {draft.includeSeal && business.sealUrl && renderItem('seal', (
                        <img
                            src={business.sealUrl?.startsWith('http') ? business.sealUrl : `https://kk01km6g-3000.inc1.devtunnels.ms${business.sealUrl}`}
                            alt="Seal"
                            className="h-24 w-24 object-contain opacity-90 rotate-[-10deg]"
                        />
                    ))}

                    {/* Footer Image */}
                    {renderItem('footer', business.footerImage ? (
                        <img src={business.footerImage.startsWith('http') ? business.footerImage : `https://kk01km6g-3000.inc1.devtunnels.ms${business.footerImage}`} alt="Footer" className="w-[210mm] object-contain" />
                    ) : null)}

                </div>
            </div>
            {isCustomizing && <div className="mt-4 text-gray-500 text-sm">Drag elements to rearrange. Click "Save Layout" when done.</div>}
        </div>
    );
};

export default DraftPreview;
