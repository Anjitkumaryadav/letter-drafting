import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save } from 'lucide-react';

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
                await axios.patch(`https://kk01km6g-3000.inc1.devtunnels.ms/recipients/${recipient._id}`, formData);
            } else {
                await axios.post('https://kk01km6g-3000.inc1.devtunnels.ms/recipients', formData);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {recipient ? 'Edit Recipient' : 'Add Recipient'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Organization / Name</label>
                        <input
                            type="text"
                            required
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Person (Optional)</label>
                        <input
                            type="text"
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                            value={formData.contactPerson}
                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea
                            required
                            rows={3}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="text"
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Save size={16} className="mr-2" />
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecipientFormModal;
