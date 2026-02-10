import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, Copy, Trash2, FileDown, FileText, Search, Plus } from 'lucide-react';
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
            const response = await axios.get('https://kk01km6g-3000.inc1.devtunnels.ms/drafts');
            setDrafts(response.data);
        } catch (error) {
            console.error('Error fetching drafts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this draft?')) return;
        try {
            await axios.delete(`https://kk01km6g-3000.inc1.devtunnels.ms/drafts/${id}`);
            setDrafts(drafts.filter(d => d._id !== id));
        } catch (error) {
            console.error('Error deleting draft:', error);
            alert('Failed to delete draft');
        }
    };

    const handleClone = async (draft: Draft) => {
        if (!window.confirm(`Create a copy of "${draft.subject}"?`)) return;
        try {
            const { _id, updatedAt, ...cloneData } = draft;
            // Need to extract IDs from populated objects if present, or backend handles it?
            // Usually populated objects need to be flattened to IDs for creation if the CreateDTO expects IDs.
            // Let's assume standard behavior: we need to send IDs.
            const payload = {
                ...cloneData,
                subject: `${draft.subject} (Copy)`,
                status: 'DRAFT',
                // Flatten populated fields if necessary (depends on backend structure, assuming backend returns populated objects)
                businessId: (draft.businessId as any)?._id || draft.businessId,
                recipientId: (draft.recipientId as any)?._id || draft.recipientId,
            };

            const response = await axios.post('https://kk01km6g-3000.inc1.devtunnels.ms/drafts', payload);
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
                    ${business.logo ? `<img src="https://kk01km6g-3000.inc1.devtunnels.ms${business.logo}" style="height: 80px; margin-bottom: 10px;" crossOrigin="anonymous"/>` : ''}
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
                         ${draft.includeSeal && business.seal ? `<img src="https://kk01km6g-3000.inc1.devtunnels.ms${business.seal}" style="height: 80px; opacity: 0.8; transform: rotate(-10deg);" crossOrigin="anonymous"/>` : '<div style="height: 80px;"></div>'}
                    </div>
                    <p style="border-top: 1px solid #ccc; display: inline-block; padding-top: 5px;">Authorized Signatory</p>
                </div>
            </div>
        `;
        return div;
    };

    const handleDownloadPDF = async (draft: Draft) => {
        // We need full details (business/recipient populated) to print.
        // The list might contain populated data. 
        // If not, we might need to fetch single draft. 
        // Assuming list returns populated data for simplicity based on DraftsService.findAll

        const element = generateHiddenElement(draft);
        document.body.appendChild(element); // Append to body to render images? html2pdf needs it in DOM sometimes.

        try {
            const opt = {
                margin: [10, 10, 10, 10],
                filename: `${draft.subject || 'letter'}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            await html2pdf().set(opt).from(element).save();
        } catch (e) {
            console.error(e);
            alert('PDF generation failed');
        } finally {
            document.body.removeChild(element);
        }
    };

    const handleDownloadDOC = async (draft: Draft) => {
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
            saveAs(blob, `${draft.subject || 'letter'}.docx`);
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

    if (loading) return <div className="p-8 text-center">Loading inbox...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Letter Inbox</h1>
                    <p className="text-gray-500 text-sm">Manage your correspondence</p>
                </div>
                <Link to="/drafts/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center shadow-sm">
                    <Plus size={18} className="mr-2" /> New Letter
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by subject or recipient..."
                        className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex space-x-2 w-full md:w-auto">
                    <button
                        onClick={() => setStatusFilter('ALL')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'ALL' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setStatusFilter('DRAFT')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'DRAFT' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 border' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Drafts
                    </button>
                    <button
                        onClick={() => setStatusFilter('FINAL')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'FINAL' ? 'bg-green-100 text-green-800 border-green-200 border' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Final
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow overflow-hidden border">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider w-24">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Recipient</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider hidden md:table-cell">Business</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider w-32">Date</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider w-48 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredDrafts.length > 0 ? filteredDrafts.map((draft) => (
                            <tr key={draft._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${draft.status === 'FINAL' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {draft.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <Link to={draft.status === 'FINAL' ? `/drafts/${draft._id}/preview` : `/drafts/${draft._id}`} className="hover:text-blue-600 hover:underline block truncate max-w-xs">
                                        {draft.subject || '(No Subject)'}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{draft.recipientId?.name || '-'}</td>
                                <td className="px-6 py-4 text-gray-600 hidden md:table-cell">{draft.businessId?.name || '-'}</td>
                                <td className="px-6 py-4 text-gray-500 text-sm">{format(new Date(draft.updatedAt), 'MMM dd, yyyy')}</td>
                                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                    <button
                                        onClick={() => handleClone(draft)}
                                        title="Clone as Template"
                                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                    >
                                        <Copy size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDownloadPDF(draft)}
                                        title="Download PDF"
                                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                    >
                                        <FileDown size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDownloadDOC(draft)}
                                        title="Download Word Doc"
                                        className="text-gray-400 hover:text-blue-800 transition-colors p-1"
                                    >
                                        <FileText size={16} />
                                    </button>
                                    <button
                                        onClick={() => navigate(draft.status === 'FINAL' ? `/drafts/${draft._id}/preview` : `/drafts/${draft._id}`)}
                                        title="Edit/View"
                                        className="text-gray-400 hover:text-green-600 transition-colors p-1"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(draft._id)}
                                        title="Delete"
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No letters found. <Link to="/drafts/new" className="text-blue-600 hover:underline">Draft a new one!</Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DraftList;
