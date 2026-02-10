import React, { useState, useEffect, useRef } from 'react';
import Editor from '../../components/Editor';
import axios from 'axios';
import { format } from 'date-fns';
import { Save, ArrowLeft, Loader, Bot } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AIAssistantPanel from '../../components/AIAssistantPanel';

interface Business {
    _id: string;
    name: string;
    headerImage?: string;
    footerImage?: string;
    sealUrl?: string;
}

interface Recipient {
    _id: string;
    name: string;
    contactPerson?: string;
}

const DraftEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const quillRef = useRef<any>(null);

    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [recipients, setRecipients] = useState<Recipient[]>([]);

    const [formData, setFormData] = useState({
        businessId: '',
        recipientId: '',
        refNo: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        subject: '',
        content: '',
        status: 'DRAFT',
        includeSeal: false, // Default is false per requirement
        layout: null as any // Store layout configuration
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isAIOpen, setIsAIOpen] = useState(false);

    useEffect(() => {
        fetchResources();
        if (id) {
            fetchDraft(id);
        } else {
            setLoading(false);
        }
    }, [id]);

    // Autosave effect
    useEffect(() => {
        if (!id) return; // Only autosave if we have a draft ID

        const timeoutId = setTimeout(() => {
            handleSave(true);
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [formData]);

    const fetchResources = async () => {
        try {
            const [busRes, recRes] = await Promise.all([
                axios.get('https://kk01km6g-3000.inc1.devtunnels.ms/businesses'),
                axios.get('https://kk01km6g-3000.inc1.devtunnels.ms/recipients')
            ]);
            setBusinesses(busRes.data);
            setRecipients(recRes.data);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    const fetchDraft = async (draftId: string) => {
        try {
            const response = await axios.get(`https://kk01km6g-3000.inc1.devtunnels.ms/drafts/${draftId}`);
            const draft = response.data;
            setFormData({
                businessId: draft.businessId?._id || draft.businessId || '',
                recipientId: draft.recipientId?._id || draft.recipientId || '',
                refNo: draft.refNo || '',
                date: draft.date ? format(new Date(draft.date), 'yyyy-MM-dd') : '',
                subject: draft.subject || '',
                content: draft.content || '',
                status: draft.status || 'DRAFT',
                includeSeal: draft.includeSeal || false,
                layout: draft.layout || null
            });
        } catch (error) {
            console.error('Error fetching draft:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (silent = false) => {
        if (!silent) setSaving(true);

        const payload = { ...formData };
        if (!payload.businessId) delete (payload as any).businessId;
        if (!payload.recipientId) delete (payload as any).recipientId;

        try {
            if (id) {
                await axios.patch(`https://kk01km6g-3000.inc1.devtunnels.ms/drafts/${id}`, payload);
                setLastSaved(new Date());
            } else {
                const response = await axios.post('https://kk01km6g-3000.inc1.devtunnels.ms/drafts', payload);
                navigate(`/drafts/${response.data._id}`, { replace: true });
                setLastSaved(new Date());
            }
        } catch (error: any) {
            console.error('Error saving draft:', error);
            if (!silent) alert(`Failed to save draft: ${error.response?.data?.message || error.message}`);
        } finally {
            if (!silent) setSaving(false);
        }
    };



    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header / Toolbar */}
            <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
                        <div className="flex items-center space-x-4">
                            <Link to="/" className="text-gray-500 hover:text-gray-700">
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-800 truncate max-w-[200px] sm:max-w-xs">
                                    {formData.subject || 'Untitled Draft'}
                                </h1>
                                <span className="text-xs text-gray-400 block">
                                    {lastSaved ? `Saved ${format(lastSaved, 'HH:mm:ss')}` : 'Unsaved'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.includeSeal}
                                onChange={(e) => setFormData(prev => ({ ...prev, includeSeal: e.target.checked }))}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>Include Seal (Optional)</span>
                        </label>
                        <button
                            onClick={() => navigate(`/drafts/${id}/preview`)}
                            disabled={!id || saving || !formData.businessId || !formData.recipientId}
                            title={!formData.businessId || !formData.recipientId ? "Please select Business and Recipient to preview" : "Preview Letter"}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 text-sm font-medium disabled:cursor-not-allowed"
                        >
                            Preview
                        </button>
                        <button
                            onClick={() => handleSave(false)}
                            disabled={saving}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                        >
                            {saving ? <Loader className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
                            Save
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-4 sm:p-8 flex relative">
                <div className="flex-1 max-w-4xl mx-auto bg-white shadow-lg rounded-lg min-h-[800px] flex flex-col">

                    {/* Metadata Section */}
                    <div className="p-8 border-b grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-t-lg">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">From (Business)</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 bg-white"
                                value={formData.businessId}
                                onChange={(e) => setFormData(prev => ({ ...prev, businessId: e.target.value }))}
                            >
                                <option value="">Select Business</option>
                                {businesses.map(b => (
                                    <option key={b._id} value={b._id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">To (Recipient)</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 bg-white"
                                value={formData.recipientId}
                                onChange={(e) => setFormData(prev => ({ ...prev, recipientId: e.target.value }))}
                            >
                                <option value="">Select Recipient</option>
                                {recipients.map(r => (
                                    <option key={r._id} value={r._id}>{r.name} {r.contactPerson ? `(${r.contactPerson})` : ''}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Ref No</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="ex. REF/2024/001"
                                value={formData.refNo}
                                onChange={(e) => setFormData(prev => ({ ...prev, refNo: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date</label>
                            <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                value={formData.date}
                                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Subject Line */}
                    <div className="px-8 py-6 border-b">
                        <input
                            type="text"
                            className="w-full text-xl font-bold border-none focus:ring-0 placeholder-gray-300"
                            placeholder="Subject: Enter letter subject here..."
                            value={formData.subject}
                            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        />
                    </div>

                    {/* Editor */}
                    <div className="flex-1 p-8">
                        <Editor
                            ref={quillRef} // Now using our custom forwarded ref
                            value={formData.content}
                            onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                            className="h-full"
                            placeholder="Start writing your letter..."
                        />
                    </div>
                </div>

                {/* AI Panel Toggle / Component */}
                <AIAssistantPanel
                    isOpen={isAIOpen}
                    onClose={() => setIsAIOpen(false)}
                    onInsert={(text) => {
                        const editor = quillRef.current?.getEditor();
                        const range = editor?.getSelection();
                        if (editor) {
                            const index = range ? range.index : editor.getLength();
                            editor.insertText(index, text);
                            setIsAIOpen(false);
                        }
                    }}
                />

                {!isAIOpen && (
                    <button
                        onClick={() => setIsAIOpen(true)}
                        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:scale-105 transition-transform z-50 flex items-center"
                    >
                        <Bot className="mr-2" />
                        Ask AI
                    </button>
                )}

            </div>
        </div>
    );
};

export default DraftEditor;
