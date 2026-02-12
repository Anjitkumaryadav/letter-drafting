import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Copy, Trash2, FileDown, FileText, Search, Plus, CheckCircle2, History } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
// @ts-ignore
import { asBlob } from 'html-docx-js-typescript';
import { saveAs } from 'file-saver';

interface Draft {
    _id: string;
    subject: string;
    recipientId?: { name: string };
    businessId?: { name: string, logo?: string, seal?: string, address?: string, email?: string, phone?: string }; // Expanded for PDF gen
    updatedAt: string;
    status: 'DRAFT' | 'FINAL';
    refNo?: string;
    date?: string;
    content?: string;
    includeSeal?: boolean;
}

const DraftList: React.FC = () => {
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'FINAL'>('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDrafts();
    }, []);

    const fetchDrafts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/drafts');
            setDrafts(response.data);
        } catch (error) {
            console.error('Error fetching drafts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!window.confirm('Are you sure you want to delete this draft?')) return;
        try {
            await axios.delete(`http://localhost:3000/drafts/${id}`);
            setDrafts(drafts.filter(d => d._id !== id));
        } catch (error) {
            console.error('Error deleting draft:', error);
            alert('Failed to delete draft');
        }
    };

    const handleClone = async (draft: Draft, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!window.confirm(`Create a copy of "${draft.subject}"?`)) return;
        try {
            const { _id, updatedAt, ...cloneData } = draft;
            const payload = {
                ...cloneData,
                subject: `${draft.subject} (Copy)`,
                status: 'DRAFT',
                businessId: (draft.businessId as any)?._id || draft.businessId,
                recipientId: (draft.recipientId as any)?._id || draft.recipientId,
            };

            const response = await axios.post('http://localhost:3000/drafts', payload);
            navigate(`/drafts/${response.data._id}`);
        } catch (error) {
            console.error('Error cloning draft:', error);
            alert('Failed to clone draft');
        }
    };

    // Helper to generate hidden HTML for PDF/DOC download from list
    const generateHiddenElement = (draft: Draft) => {
        const div = document.createElement('div');
        div.id = `temp-print-${draft._id}`;
        div.style.width = '210mm';
        div.style.padding = '20mm';
        div.style.background = 'white';
        // Basic styles inline for simplicity in hidden render

        const business = draft.businessId as any || {};
        const recipient = draft.recipientId as any || {};

        div.innerHTML = `
            <div style="font-family: 'Times New Roman', serif; color: black;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; text-align: center;">
                    ${business.logo ? `<img src="http://localhost:3000${business.logo}" style="height: 80px; margin-bottom: 10px;" crossOrigin="anonymous"/>` : ''}
                    <h1 style="font-size: 24px; font-weight: bold; text-transform: uppercase; margin: 0;">${business.name || ''}</h1>
                    <p style="font-size: 12px; margin: 5px 0;">${business.address || ''}</p>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                    <div><strong>Ref No:</strong> ${draft.refNo || ''}</div>
                    <div><strong>Date:</strong> ${draft.date ? format(new Date(draft.date), 'dd MMMM, yyyy') : ''}</div>
                </div>

                <div style="margin-bottom: 30px;">
                    <strong>To,</strong><br/>
                    <strong>${recipient.name || ''}</strong><br/>
                    ${recipient.address || ''}
                </div>

                <div style="margin-bottom: 20px; text-decoration: underline; font-weight: bold;">
                    Subject: ${draft.subject}
                </div>

                <div style="margin-bottom: 40px; text-align: justify; line-height: 1.6;">
                    ${draft.content || ''}
                </div>

                <div style="text-align: right;">
                    <p style="font-weight: bold;">For ${business.name || ''}</p>
                    <div style="height: 100px; display: flex; justify-content: flex-end; align-items: center; margin: 10px 0;">
                         ${draft.includeSeal && business.seal ? `<img src="http://localhost:3000${business.seal}" style="height: 80px; opacity: 0.8; transform: rotate(-10deg);" crossOrigin="anonymous"/>` : '<div style="height: 80px;"></div>'}
                    </div>
                    <p style="border-top: 1px solid #ccc; display: inline-block; padding-top: 5px;">Authorized Signatory</p>
                </div>
            </div>
        `;
        return div;
    };

    const handleDownloadPDF = async (draft: Draft, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const element = generateHiddenElement(draft);
        document.body.appendChild(element);

        try {
            const opt = {
                margin: [10, 10, 10, 10] as [number, number, number, number],
                filename: `${draft.subject || 'letter'}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
            };
            if (!element) return;
            await html2pdf().set(opt).from(element).save();
        } catch (e) {
            console.error(e);
            alert('PDF generation failed');
        } finally {
            document.body.removeChild(element);
        }
    };

    const handleDownloadDOC = async (draft: Draft, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const element = generateHiddenElement(draft);

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"><title>${draft.subject}</title></head>
            <body>${element.innerHTML}</body>
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


    const filteredDrafts = drafts.filter(draft => {
        const matchesSearch = (draft.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            draft.recipientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'ALL' || draft.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Drafts</h1>
                    <p className="text-neutral-500 text-sm mt-1">Manage and create letters</p>
                </div>
                <Link to="/drafts/new" className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-all shadow-sm font-medium">
                    <Plus size={20} />
                    New Letter
                </Link>
            </div>

            {/* Filters & Search - Mobile Responsive */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-neutral-200 flex flex-col sm:flex-row gap-2">
                <div className="flex p-1 gap-1 bg-neutral-100 rounded-lg sm:w-auto w-full">
                    <button
                        onClick={() => setStatusFilter('ALL')}
                        className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${statusFilter === 'ALL' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setStatusFilter('DRAFT')}
                        className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${statusFilter === 'DRAFT' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    >
                        Drafts
                    </button>
                    <button
                        onClick={() => setStatusFilter('FINAL')}
                        className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${statusFilter === 'FINAL' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    >
                        Final
                    </button>
                </div>

                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-neutral-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search drafts..."
                        className="pl-9 pr-4 py-2 w-full border-0 bg-transparent focus:ring-0 text-sm font-medium placeholder-neutral-400"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-neutral-200 rounded-xl" />
                    ))}
                </div>
            ) : filteredDrafts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-neutral-300">
                    <div className="bg-neutral-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText size={32} className="text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900">No drafts found</h3>
                    <p className="text-neutral-500 mt-1 max-w-sm mx-auto">
                        {searchTerm ? "Try adjusting your search terms." : "Start by creating your first letter draft."}
                    </p>
                    {!searchTerm && (
                        <Link to="/drafts/new" className="mt-4 inline-block px-4 py-2 text-sm text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors">
                            Create New Draft
                        </Link>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-card border border-neutral-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-neutral-600 text-xs uppercase tracking-wider w-32">Status</th>
                                    <th className="px-6 py-4 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-4 font-semibold text-neutral-600 text-xs uppercase tracking-wider hidden md:table-cell">Recipient</th>
                                    <th className="px-6 py-4 font-semibold text-neutral-600 text-xs uppercase tracking-wider hidden lg:table-cell">Business</th>
                                    <th className="px-6 py-4 font-semibold text-neutral-600 text-xs uppercase tracking-wider w-40">Last Updated</th>
                                    <th className="px-6 py-4 font-semibold text-neutral-600 text-xs uppercase tracking-wider w-40 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {filteredDrafts.map((draft) => (
                                    <tr
                                        key={draft._id}
                                        className="hover:bg-neutral-50 transition-colors cursor-pointer group"
                                        onClick={() => navigate(draft.status === 'FINAL' ? `/drafts/${draft._id}/preview` : `/drafts/${draft._id}`)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {draft.status === 'FINAL' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                                    <CheckCircle2 size={12} /> Final
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                                                    <History size={12} /> Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-neutral-900 truncate max-w-xs group-hover:text-primary-600 transition-colors">
                                                {draft.subject || <span className="text-neutral-400 italic">Untitled Draft</span>}
                                            </div>
                                            <div className="md:hidden text-xs text-neutral-500 mt-1">
                                                {draft.recipientId?.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-600 hidden md:table-cell">
                                            {draft.recipientId?.name || <span className="text-neutral-300">-</span>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-600 hidden lg:table-cell">
                                            {draft.businessId?.name || <span className="text-neutral-300">-</span>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500">
                                            {format(new Date(draft.updatedAt), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => handleClone(draft, e)}
                                                    className="p-1.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                    title="Clone"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDownloadPDF(draft, e)}
                                                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Download PDF"
                                                >
                                                    <FileDown size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDownloadDOC(draft, e)}
                                                    className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Download Word Doc"
                                                >
                                                    <FileText size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(draft._id, e)}
                                                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DraftList;
