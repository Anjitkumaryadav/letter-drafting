import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { ArrowLeft, CheckCircle, Printer, Move, Save, RotateCcw, PenLine, Crop as CropIcon, X, Image as ImageIcon, Type } from 'lucide-react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';



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

interface TouchState {
    startX: number;
    startY: number;
    initialItemX: number;
    initialItemY: number;
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

interface EditableContent {
    subject: string;
    content: string;
}


interface LayoutItem {
    x: number;
    y: number;
    w?: number; // width in mm (optional)
    hidden?: boolean;
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
    seal: { x: 150, y: 220, hidden: false },
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
    const [scale, setScale] = useState(1);
    const [editableData, setEditableData] = useState<EditableContent>({ subject: '', content: '' });

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Crop State
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [cropTarget, setCropTarget] = useState<'header' | 'footer' | 'seal' | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [isTextEditing, setIsTextEditing] = useState(false);

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined); // Makes crop preview update between images.
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(e.target.files[0]);
            setCropModalOpen(true);
        }
    };

    const handleImageClick = (type: 'header' | 'footer' | 'seal', url?: string) => {
        if (!isCustomizing && !isTextEditing) return; // Only allow crop in edit/customize modes
        if (!url) return;

        // Proxy check or direct use
        const fullUrl = url.startsWith('http') ? url : `https://letter-drafting.onrender.com${url}`;
        setImgSrc(fullUrl); // Note: Cross-origin might be an issue for canvas if not configured on server
        setCropTarget(type);
        setCropModalOpen(true);
    };

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const crop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                width / height, // Aspect ratio (optional, remove if free crop)
                width,
                height,
            ),
            width,
            height,
        )
        setCrop(crop)
    }


    const getCroppedImg = async () => {
        if (!imgRef.current || !completedCrop || !draft || !cropTarget) return;

        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const pixelRatio = window.devicePixelRatio;

        canvas.width = completedCrop.width * scaleX * pixelRatio;
        canvas.height = completedCrop.height * scaleY * pixelRatio;

        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = 'high';

        const cropX = completedCrop.x * scaleX;
        const cropY = completedCrop.y * scaleY;
        const centerX = image.naturalWidth / 2;
        const centerY = image.naturalHeight / 2;

        ctx.save();
        ctx.translate(-cropX, -cropY);
        ctx.translate(centerX, centerY);
        ctx.translate(-centerX, -centerY);
        ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight);
        ctx.restore();

        // Actually simpler draw:
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear
        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY
        );


        // As Base64 string
        const base64Image = canvas.toDataURL('image/jpeg');

        // Update local draft
        const newData = { ...draft };
        const newBusiness = { ...draft.businessId };

        if (cropTarget === 'header') newBusiness.headerImage = base64Image;
        if (cropTarget === 'footer') newBusiness.footerImage = base64Image;
        if (cropTarget === 'seal') newBusiness.sealUrl = base64Image; // Note: This affects view only unless we update business or store override in draft. 
        // Ideally we should store this "cropped version" in the draft or update the business. 
        // For safety, let's assume we are updating the *active view* only, or we need a way to persist "draft specific overrides".
        // Given the schema, we might have to update the business or add fields to draft. 
        // For this task, I'll update the *business* object locally and in draft state. Persisting to backend 'business' might affect other letters, but user asked to crop *here*.
        // Correct approach: Update Business if user confirms? Or maybe prompt? 
        // I will assume visual update for this session/PDF generation first.

        setDraft({ ...newData, businessId: newBusiness });
        setCropModalOpen(false);
        // Note: We are NOT persisting this to DB 'Business' collection to avoid breaking other letters. 
        // If user wants to save, we'd need a backend change to store "draftSpecificImages".
        // For now, this allows printing/PDF with cropped version.
    };



    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            const containerPadding = 32;
            const availableWidth = screenWidth - containerPadding;
            const refWidth = 794; // approx 210mm in px

            if (availableWidth < refWidth) {
                setScale(availableWidth / refWidth);
            } else {
                setScale(1);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchDraft = async () => {
            try {
                const response = await axios.get(`https://letter-drafting.onrender.com/drafts/${id}`);
                setDraft(response.data);
                setEditableData({
                    subject: response.data.subject,
                    content: response.data.content
                });
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

        const deltaX = (deltaXPixels / scale) * mmPerPx;
        const deltaY = (deltaYPixels / scale) * mmPerPx;

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

    const handleTouchStart = (e: React.TouchEvent, item: keyof LayoutConfig) => {
        if (!isCustomizing) return;
        // e.preventDefault(); // removed to allow scrolling if needed, but for drag we might want it. 
        // Actually, for dragging we usually want to prevent scroll.

        const touch = e.touches[0];
        const startX = touch.clientX;
        const startY = touch.clientY;

        setDraggingItem(item);
        setDragOffset({ x: startX, y: startY });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!draggingItem || !previewRef.current) return;
        // e.preventDefault(); // Prevent scrolling while dragging

        const touch = e.touches[0];
        const deltaXPixels = touch.clientX - dragOffset.x;
        const deltaYPixels = touch.clientY - dragOffset.y;

        const containerWidthPx = previewRef.current.offsetWidth;
        const mmPerPx = 210 / containerWidthPx;

        const deltaX = (deltaXPixels / scale) * mmPerPx;
        const deltaY = (deltaYPixels / scale) * mmPerPx;

        setLayout(prev => ({
            ...prev,
            [draggingItem]: {
                ...prev[draggingItem],
                x: prev[draggingItem].x + deltaX,
                y: prev[draggingItem].y + deltaY
            }
        }));

        setDragOffset({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = () => {
        setDraggingItem(null);
    };

    const handleMouseUp = () => {
        setDraggingItem(null);
    };

    const handleHideItem = (e: React.MouseEvent, item: keyof LayoutConfig) => {
        e.stopPropagation();
        if (window.confirm(`Remove ${item} from layout?`)) {
            setLayout(prev => ({
                ...prev,
                [item]: { ...prev[item], hidden: true }
            }));
        }
    };

    const handleSaveLayout = async () => {
        if (!draft) return;
        try {
            // Save both layout and content if changed
            const payload: any = { layout };
            if (hasUnsavedChanges) {
                payload.subject = editableData.subject;
                payload.content = editableData.content;
            }

            await axios.patch(`https://letter-drafting.onrender.com/drafts/${id}`, payload);
            setIsCustomizing(false);
            setHasUnsavedChanges(false);

            // Update local draft state
            setDraft({
                ...draft,
                layout,
                subject: hasUnsavedChanges ? editableData.subject : draft.subject,
                content: hasUnsavedChanges ? editableData.content : draft.content
            });

            alert('Changes saved!');
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save changes');
        }
    };

    const handleSaveContentOnly = async () => {
        if (!draft || !hasUnsavedChanges) return;
        try {
            await axios.patch(`https://letter-drafting.onrender.com/drafts/${id}`, {
                subject: editableData.subject,
                content: editableData.content
            });
            setDraft({
                ...draft,
                subject: editableData.subject,
                content: editableData.content
            });
            setHasUnsavedChanges(false);
            alert('Content saved!');
        } catch (error) {
            console.error('Error saving content:', error);
            alert('Failed to save content');
        }
    };


    const handleResetLayout = () => {
        if (window.confirm('Reset to default layout?')) {
            setLayout(DEFAULT_LAYOUT);
        }
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('letter-preview-content');
        if (!element) return;

        // Clone the element to manipulate for PDF generation (remove interactions, etc.)
        const clone = element.cloneNode(true) as HTMLElement;

        // Hide elements that shouldn't be in PDF if they are hidden in layout
        // (Visual hiding in preview handles this via 'hidden' class or null render, 
        // but if we cloned, they might be there if we used CSS visibility? 
        // Our renderItem returns null, so they aren't in DOM)

        // 1. Generate PDF content without Footer (we'll add it manually)
        const opt = {
            margin: 0, // No margins, we handle layout
            filename: `${draft?.subject || 'letter'}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false, letterRendering: true, windowWidth: 794 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
        };

        // We need to temporarily remove the footer from the clone if it exists there
        // Actually, our renderItem puts footer in normal flow absolute pos. 
        // If we want it on every page, we should remove it from DOM and add via jsPDF
        const footerImg = business?.footerImage
            ? (business.footerImage.startsWith('http') ? business.footerImage : `https://letter-drafting.onrender.com${business.footerImage}`)
            : null;

        // Hide footer in the clone so it doesn't appear only on last page
        const footerEl = clone.querySelector('[data-type="footer"]');
        if (footerEl) (footerEl as HTMLElement).style.display = 'none';

        // Same for header - user wants it ONLY on first page. 
        // Since our HTML structure has it at top, it naturally appears on Page 1. 
        // If content spills, it won't repeat. This is correct per requirements.

        html2pdf().set(opt).from(clone).toPdf().get('pdf').then((pdf: any) => {
            const totalPages = pdf.internal.getNumberOfPages();

            // Add Footer to all pages
            if (footerImg) {
                let footerHeight = 25; // Default fallback in mm
                const originalFooter = element.querySelector('div[data-type="footer"] img') as HTMLImageElement;
                const pageWidth = pdf.internal.pageSize.getWidth();

                if (originalFooter && originalFooter.naturalWidth > 0) {
                    const ratio = originalFooter.naturalHeight / originalFooter.naturalWidth;
                    footerHeight = pageWidth * ratio;
                }

                const pageHeight = pdf.internal.pageSize.getHeight();

                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i);
                    try {
                        // addImage(imageData, format, x, y, w, h)
                        pdf.addImage(footerImg, 'PNG', 0, pageHeight - footerHeight, pageWidth, footerHeight);
                    } catch (e) {
                        console.error("Error adding footer to PDF page " + i, e);
                    }
                }
            }

            pdf.save(`${draft?.subject || 'letter'}.pdf`);
        });
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
            await axios.patch(`https://letter-drafting.onrender.com/drafts/${id}`, { status: 'FINAL' });
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

        if (pos.hidden && !isCustomizing) return null;

        return (
            <div
                style={style}
                className={`${className} ${pos.hidden ? 'opacity-50 border-red-300 border-2' : ''} touch-none`} // touch-none prevents browser scrolling
                onMouseDown={(e) => handleMouseDown(e, key)}
                onTouchStart={(e) => handleTouchStart(e, key)}
            >
                {/* Visual guide for drag handle if needed, or just drag whole element */}
                {(isCustomizing || isTextEditing) && (
                    <>
                        {/* Only show move handle in Customizing mode */}
                        {isCustomizing && (
                            <div className="absolute -top-6 -right-6 sm:-top-3 sm:-right-3 bg-blue-500 rounded-full p-2 sm:p-1 opacity-80 hover:opacity-100 cursor-move z-20 shadow-lg">
                                <Move size={16} color="white" className="sm:w-3 sm:h-3" />
                            </div>
                        )}

                        {/* Show Crop hint if image and in Edit/Customize mode */}
                        {(key === 'header' || key === 'footer' || key === 'seal') && (isCustomizing || isTextEditing) && !pos.hidden && (
                            <div className="absolute top-2 right-2 bg-neutral-900/70 text-white text-[10px] px-2 py-1 rounded-full pointer-events-none z-20 flex items-center gap-1">
                                <CropIcon size={10} /> Click to Crop
                            </div>
                        )}

                        {isCustomizing && !pos.hidden && (
                            <div
                                className="absolute -top-3 -left-3 bg-red-500 rounded-full p-1 opacity-50 hover:opacity-100 cursor-pointer z-20"
                                onClick={(e) => handleHideItem(e, key)}
                                title="Hide item"
                            >
                                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </div>
                        )}
                        {isCustomizing && pos.hidden && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200/50 text-xs font-bold text-red-500 pointer-events-none">
                                HIDDEN
                            </div>
                        )}
                    </>
                )}
                {content}
            </div>
        );
    };

    return (
        <div
            className="min-h-screen bg-neutral-100 flex flex-col items-center py-4 sm:py-8 overflow-x-hidden touch-manipulation"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Toolbar */}
            <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center mb-6 px-4 gap-4">
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
                        <>

                            {hasUnsavedChanges && (
                                <button onClick={handleSaveContentOnly} className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow-sm animate-pulse">
                                    <Save size={18} className="mr-2" /> Save Content
                                </button>
                            )}

                            <button
                                onClick={() => { setIsTextEditing(!isTextEditing); setIsCustomizing(false); }}
                                className={`flex items-center px-4 py-2 border rounded shadow-sm transition-all ${isTextEditing ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
                            >
                                <Type size={18} className="mr-2" /> {isTextEditing ? 'Done Editing' : 'Edit Text'}
                            </button>

                            <button onClick={() => { setIsCustomizing(true); setIsTextEditing(false); }} className="flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded hover:bg-blue-50 shadow-sm">
                                <Settings size={18} className="mr-2" /> Layout
                            </button>
                        </>
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
                className="relative origin-top transition-transform duration-200"
                style={{ transform: `scale(${scale})`, width: '210mm' }}
            >
                <div
                    ref={previewRef}
                    className="bg-gray-200 p-4 rounded shadow-inner inline-block"
                >
                    <div
                        id="letter-preview-content"
                        className="bg-white shadow-2xl w-[210mm] relative mx-auto print:shadow-none print:w-full overflow-hidden pb-20"
                        style={{
                            minHeight: '297mm',
                            backgroundImage: 'linear-gradient(to bottom, transparent calc(297mm - 1px), #e5e7eb calc(297mm - 1px), #e5e7eb 297mm)',
                            backgroundSize: '100% 297mm'
                        }}
                    >
                        {/* Header Image */}

                        {/* Header Image */}
                        {renderItem('header', business.headerImage ? (
                            <img
                                src={business.headerImage.startsWith('http') ? business.headerImage : `https://letter-drafting.onrender.com${business.headerImage}`}
                                alt="Header"
                                className={`w-[210mm] object-contain ${(isCustomizing || isTextEditing) ? 'cursor-pointer hover:opacity-90 ring-2 ring-transparent hover:ring-blue-400' : ''}`}
                                onClick={() => handleImageClick('header', business.headerImage)}
                            />
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
                        {renderItem('subject', (
                            <div
                                contentEditable={isTextEditing}
                                suppressContentEditableWarning
                                className={`font-bold underline text-sm w-[170mm] outline-none 
                                    ${isTextEditing ? 'bg-indigo-50/50 ring-2 ring-indigo-200 rounded p-2 -ml-2 cursor-text' : ''}
                                    ${!isCustomizing && !isTextEditing ? 'hover:bg-gray-50 transition-colors rounded p-1 -ml-1' : ''}`}
                                onBlur={(e) => {
                                    setEditableData(prev => ({ ...prev, subject: e.currentTarget.innerText }));
                                    setHasUnsavedChanges(true);
                                }}
                            >
                                {isCustomizing ? draft.subject : undefined}
                                {((!isCustomizing) && editableData.subject === '') ? 'Subject' : editableData.subject}
                            </div>
                        ))}

                        {/* Content */}
                        {renderItem('content', (
                            <div
                                contentEditable={isTextEditing}
                                suppressContentEditableWarning
                                className={`prose max-w-none text-justify leading-relaxed text-sm w-[170mm] outline-none 
                                    ${isTextEditing ? 'bg-indigo-50/50 ring-2 ring-indigo-200 rounded p-4 -ml-4 cursor-text' : ''}
                                    ${!isCustomizing && !isTextEditing ? 'hover:bg-gray-50 transition-colors rounded p-1 -ml-1' : ''}`}
                                dangerouslySetInnerHTML={{ __html: editableData.content }}
                                onBlur={(e) => {
                                    setEditableData(prev => ({ ...prev, content: e.currentTarget.innerHTML }));
                                    setHasUnsavedChanges(true);
                                }}
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
                                src={business.sealUrl?.startsWith('http') ? business.sealUrl : `https://letter-drafting.onrender.com${business.sealUrl}`}
                                alt="Seal"
                                className={`h-24 w-24 object-contain opacity-90 rotate-[-10deg] cursor-pointer ${(isCustomizing || isTextEditing) ? 'cursor-pointer hover:opacity-100 ring-2 ring-transparent hover:ring-blue-400' : ''}`}
                                onClick={() => handleImageClick('seal', business.sealUrl)}
                            />
                        ))}

                        {/* Footer Image - Rendered for screen/single page preview, but excluded/handled manually in PDF export */}
                        {renderItem('footer', business.footerImage ? (
                            <div data-type="footer">
                                <img
                                    src={business.footerImage.startsWith('http') ? business.footerImage : `https://letter-drafting.onrender.com${business.footerImage}`}
                                    alt="Footer"
                                    className={`w-[210mm] object-contain cursor-pointer ${(isCustomizing || isTextEditing) ? 'cursor-pointer hover:opacity-90 ring-2 ring-transparent hover:ring-blue-400' : ''}`}
                                    onClick={() => handleImageClick('footer', business.footerImage)}
                                />
                            </div>
                        ) : null)}


                    </div>
                </div>
            </div>
            {isCustomizing && <div className="mt-4 text-gray-500 text-sm">Drag elements to rearrange. Click "Save Layout" when done.</div>}

            {/* Crop Modal */}
            {cropModalOpen && (
                <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center bg-neutral-50">
                            <h3 className="font-bold text-lg text-neutral-800 flex items-center gap-2">
                                <CropIcon size={20} /> Crop {cropTarget}
                            </h3>
                            <button onClick={() => setCropModalOpen(false)} className="p-2 hover:bg-neutral-200 rounded-full">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 bg-neutral-900 flex justify-center items-center">
                            {!!imgSrc && (
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={undefined} // Free crop
                                >
                                    <img
                                        ref={imgRef}
                                        alt="Crop me"
                                        src={imgSrc}
                                        onLoad={onImageLoad}
                                        style={{ maxWidth: '100%', maxHeight: '70vh' }}
                                        crossOrigin="anonymous" // Attempt to handle CORS if server allows
                                    />
                                </ReactCrop>
                            )}
                        </div>
                        <div className="p-4 border-t bg-neutral-50 flex justify-end gap-3">
                            <button
                                onClick={() => setCropModalOpen(false)}
                                className="px-4 py-2 text-neutral-600 font-medium hover:bg-neutral-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={getCroppedImg}
                                className="px-6 py-2 bg-primary-600 text-white font-bold rounded-lg shadow-sm hover:bg-primary-700 transition-colors flex items-center gap-2"
                            >
                                <CheckCircle size={18} /> Apply Crop
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default DraftPreview;
