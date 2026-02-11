import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, Users } from 'lucide-react';
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
        <div className="min-h-screen bg-gray-50">
            {/* Navbar Placeholder - reusing Home structure indirectly or just simple header */}
            {/* <div className="bg-white shadow">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-xl font-bold text-blue-600">Bharat Business</Link>
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Businesses</Link>
                                <Link to="/recipients" className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Recipients</Link>
                                <Link to="/drafts/new" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">+ New Draft</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Recipients</h1>

                    <div className="flex space-x-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search recipients..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleCreate}
                            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                        >
                            <Plus size={20} className="mr-2" />
                            Add Recipient
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : filteredRecipients.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <Users size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500">No recipients found.</p>
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {filteredRecipients.map((recipient) => (
                                <li key={recipient._id}>
                                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-lg font-medium text-blue-600 truncate">{recipient.name}</p>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    {recipient.contactPerson && (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            {recipient.contactPerson}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-500">
                                                <p>{recipient.address}</p>
                                                <div className="mt-1 flex space-x-4">
                                                    {recipient.email && <span>📧 {recipient.email}</span>}
                                                    {recipient.phone && <span>📞 {recipient.phone}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-shrink-0 flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(recipient)}
                                                className="p-2 text-gray-400 hover:text-blue-600 transition"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(recipient._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

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
