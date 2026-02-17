import React, { useState, useEffect, useRef } from 'react';
import Editor from '../../components/Editor';
import axios from 'axios';
import { format } from 'date-fns';
import { Save, ArrowLeft, Loader2, Bot, Eye, Calendar, User, Building2, FileText, Check } from 'lucide-react';
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
                axios.get('https://letter-drafting.onrender.com/businesses'),
                axios.get('https://letter-drafting.onrender.com/recipients')
            ]);
            setBusinesses(busRes.data);
            setRecipients(recRes.data);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    const fetchDraft = async (draftId: string) => {
        try {
            const response = await axios.get(`https://letter-drafting.onrender.com/drafts/${draftId}`);
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
                await axios.patch(`https://letter-drafting.onrender.com/drafts/${id}`, payload);
                setLastSaved(new Date());
            } else {
                const response = await axios.post('https://letter-drafting.onrender.com/drafts', payload);
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



    if (loading) return <div className="flex justify-center items-center h-screen bg-neutral-50"><Loader2 className="animate-spin text-primary-600" size={32} /></div>;

    return (
        <div className="min-h-screen bg-neutral-100 flex flex-col items-center">
            {/* Header / Toolbar */}
            <div className="bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-40 w-full shadow-sm">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Link to="/" className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-base font-semibold text-neutral-900 truncate">
                                {formData.subject || 'Untitled Draft'}
                            </h1>
                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                                {lastSaved ? (
                                    <span className="flex items-center gap-1 text-green-600">
                                        <Check size={12} /> Saved {format(lastSaved, 'HH:mm')}
                                    </span>
                                ) : 'Unsaved changes'}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <label className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-700 cursor-pointer hover:bg-neutral-100 transition-colors select-none">
                            <input
                                type="checkbox"
                                checked={formData.includeSeal}
                                onChange={(e) => setFormData(prev => ({ ...prev, includeSeal: e.target.checked }))}
                                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span>Include Seal</span>
                        </label>

                        <button
                            onClick={() => navigate(`/drafts/${id}/preview`)}
                            disabled={!id || saving || !formData.businessId || !formData.recipientId}
                            title={!formData.businessId || !formData.recipientId ? "Select Business and Recipient to preview" : "Preview Letter"}
                            className="flex items-center gap-2 px-4 py-2 text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all shadow-sm"
                        >
                            <Eye size={18} />
                            <span className="hidden sm:inline">Preview</span>
                        </button>

                        <button
                            onClick={() => handleSave(false)}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 disabled:opacity-70 text-sm font-medium transition-all shadow-sm"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            <span>Save</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full max-w-5xl p-4 sm:p-8 flex flex-col gap-6 animate-fade-in relative">

                {/* Metadata Card */}
                <div className="bg-white rounded-xl shadow-card border border-neutral-200 overflow-hidden">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                                    <Building2 size={14} /> From (Business)
                                </label>
                                <select
                                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm font-medium text-neutral-900 transition-all"
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
                                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                                    <FileText size={14} /> Ref No
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
                                    placeholder="ex. REF/2024/001"
                                    value={formData.refNo}
                                    onChange={(e) => setFormData(prev => ({ ...prev, refNo: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                                    <User size={14} /> To (Recipient)
                                </label>
                                <select
                                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm font-medium text-neutral-900 transition-all"
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
                                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                                    <Calendar size={14} /> Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
                                    value={formData.date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editor Section */}
                <div className="bg-white shadow-card rounded-xl border border-neutral-200 min-h-[600px] flex flex-col relative">
                    <div className="px-8 py-6 border-b border-neutral-100">
                        <input
                            type="text"
                            className="w-full text-2xl font-bold border-none focus:ring-0 placeholder-neutral-300 text-neutral-900 p-0"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        />
                    </div>

                    <div className="flex-1 p-8">
                        <Editor
                            ref={quillRef}
                            value={formData.content}
                            onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                            className="h-full prose max-w-none"
                            placeholder="Start writing your letter..."
                        />
                    </div>
                </div>

                {/* AI Panel Toggle */}
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
                        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-50 flex items-center gap-2 group"
                    >
                        <Bot className="group-hover:rotate-12 transition-transform" />
                        <span className="font-medium pr-1">Ask AI</span>
                    </button>
                )}
            </div>

            {/* Mobile Seal Checkbox (bottom bar) */}
            <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-neutral-200 p-4 z-30">
                <label className="flex items-center gap-2 text-sm text-neutral-900">
                    <input
                        type="checkbox"
                        checked={formData.includeSeal}
                        onChange={(e) => setFormData(prev => ({ ...prev, includeSeal: e.target.checked }))}
                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Include Seal in Digital Copy</span>
                </label>
            </div>
        </div>
    );
};

export default DraftEditor;
