import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, Users, Phone, Mail, MapPin } from 'lucide-react';
import RecipientFormModal from '../../components/RecipientFormModal';


interface Recipient {
    _id: string;
    name: string;
    contactPerson?: string;
    address: string;
    email?: string;
    phone?: string;
}

const RecipientList: React.FC = () => {
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecipient, setEditingRecipient] = useState<Recipient | undefined>(undefined);

    useEffect(() => {
        fetchRecipients();
    }, []);

    const fetchRecipients = async () => {
        try {
            const response = await axios.get('https://letter-drafting.onrender.com/recipients');
            setRecipients(response.data);
        } catch (error) {
            console.error('Error fetching recipients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this recipient?')) return;
        try {
            await axios.delete(`https://letter-drafting.onrender.com/recipients/${id}`);
            setRecipients(recipients.filter((r) => r._id !== id));
        } catch (error) {
            console.error('Error deleting recipient:', error);
        }
    };

    const handleEdit = (recipient: Recipient) => {
        setEditingRecipient(recipient);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingRecipient(undefined);
        setIsModalOpen(true);
    };

    const filteredRecipients = recipients.filter((r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Recipients</h1>
                    <p className="text-neutral-500 text-sm mt-1">Manage your letter recipients</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-all shadow-sm font-medium"
                >
                    <Plus size={20} />
                    Add Recipient
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-neutral-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by name, email, or contact person..."
                    className="pl-10 pr-4 py-2.5 w-full border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white shadow-sm transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-neutral-200 rounded-xl" />
                    ))}
                </div>
            ) : filteredRecipients.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-neutral-300">
                    <div className="bg-neutral-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users size={32} className="text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900">No recipients found</h3>
                    <p className="text-neutral-500 mt-1 max-w-sm mx-auto">
                        {searchTerm ? "Try adjusting your search terms." : "Get started by adding your first recipient."}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={handleCreate}
                            className="mt-4 px-4 py-2 text-sm text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors"
                        >
                            Add New Recipient
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipients.map((recipient) => (
                        <div
                            key={recipient._id}
                            className="group bg-white rounded-xl border border-neutral-200 p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-neutral-900 text-lg leading-tight mb-1 group-hover:text-primary-600 transition-colors">
                                        {recipient.name}
                                    </h3>
                                    {recipient.contactPerson && (
                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-100 text-xs font-medium text-neutral-600">
                                            <Users size={12} />
                                            {recipient.contactPerson}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(recipient)}
                                        className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                        title="Edit"
                                        aria-label="Edit recipient"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(recipient._id)}
                                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                        aria-label="Delete recipient"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-neutral-600 flex-1">
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="mt-0.5 text-neutral-400 shrink-0" />
                                    <span className="line-clamp-2">{recipient.address}</span>
                                </div>
                                {(recipient.email || recipient.phone) && (
                                    <div className="pt-3 border-t border-neutral-100 space-y-2">
                                        {recipient.email && (
                                            <div className="flex items-center gap-3">
                                                <Mail size={16} className="text-neutral-400 shrink-0" />
                                                <span className="truncate">{recipient.email}</span>
                                            </div>
                                        )}
                                        {recipient.phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone size={16} className="text-neutral-400 shrink-0" />
                                                <span>{recipient.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <RecipientFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchRecipients}
                recipient={editingRecipient}
            />
        </div>
    );
};

export default RecipientList;
