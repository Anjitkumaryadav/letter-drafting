import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save, Building2, User, MapPin, Mail, Phone } from 'lucide-react';

interface RecipientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    recipient?: any;
}

const RecipientFormModal: React.FC<RecipientFormModalProps> = ({ isOpen, onClose, onSuccess, recipient }) => {
    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        address: '',
        email: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (recipient) {
            setFormData({
                name: recipient.name || '',
                contactPerson: recipient.contactPerson || '',
                address: recipient.address || '',
                email: recipient.email || '',
                phone: recipient.phone || '',
            });
        } else {
            setFormData({
                name: '',
                contactPerson: '',
                address: '',
                email: '',
                phone: '',
            });
        }
    }, [recipient, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (recipient) {
                await axios.patch(`http://localhost:3000/recipients/${recipient._id}`, formData);
            } else {
                await axios.post('http://localhost:3000/recipients', formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving recipient:', error);
            alert('Failed to save recipient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden scale-100 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900">
                            {recipient ? 'Edit Recipient' : 'Add New Recipient'}
                        </h2>
                        <p className="text-sm text-neutral-500 mt-0.5">Enter recipient details below</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Organization / Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building2 size={18} className="text-neutral-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium"
                                    placeholder="e.g. Acme Corp"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Contact Person <span className="text-neutral-400 font-normal">(Optional)</span></label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={18} className="text-neutral-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                    placeholder="e.g. John Doe"
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Address</label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                    <MapPin size={18} className="text-neutral-400" />
                                </div>
                                <textarea
                                    required
                                    rows={3}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                                    placeholder="Enter full address..."
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-neutral-400" />
                                    </div>
                                    <input
                                        type="email"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone size={18} className="text-neutral-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                        placeholder="+91 98765..."
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-6 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm transition-all active:scale-95"
                        >
                            <Save size={18} className="mr-2" />
                            {loading ? 'Saving...' : 'Save Recipient'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecipientFormModal;
