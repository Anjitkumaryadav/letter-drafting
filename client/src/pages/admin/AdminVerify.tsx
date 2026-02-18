import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
    Check, X, Trash2, Mail, Phone, Search,
    RefreshCw, AlertTriangle, RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';

interface UserData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    isVerified: boolean;
    isAdmin: boolean;
    isHeld: boolean;
    createdAt: string;
    paymentScreenshot?: string;
}

interface ContactData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt: string;
}

interface ContactData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt: string;
}

const AdminVerify: React.FC = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [contacts, setContacts] = useState<ContactData[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'deleted' | 'queries'>('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const { token } = useAuth();

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');

            if (activeTab === 'queries') {
                const response = await axios.get('https://letter-drafting.onrender.com/contacts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setContacts(response.data);
            } else {
                const endpoint = activeTab; // 'pending', 'active', 'deleted'
                const response = await axios.get(`https://letter-drafting.onrender.com/users/${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            }
        } catch (err: any) {
            console.error(err);
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, activeTab]);

    const handleAction = async (userId: string, action: 'approve' | 'reject' | 'delete' | 'hold' | 'unhold' | 'restore') => {
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

        setActionLoading(userId);
        try {
            let endpoint = '';
            let method = 'patch';

            switch (action) {
                case 'approve':
                    endpoint = `/users/${userId}/approve`;
                    break;
                case 'reject':
                    endpoint = `/users/${userId}`;
                    method = 'delete'; // Hard delete for rejected pending users
                    break;
                case 'delete':
                    endpoint = `/users/${userId}/soft`;
                    method = 'delete'; // Soft delete for active users
                    break;
                case 'hold':
                    endpoint = `/users/${userId}/hold`;
                    break;
                case 'unhold':
                    endpoint = `/users/${userId}/unhold`;
                    break;
                case 'restore':
                    endpoint = `/users/${userId}/restore`;
                    break;
            }

            if (method === 'delete') {
                await axios.delete(`https://letter-drafting.onrender.com${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.patch(`https://letter-drafting.onrender.com${endpoint}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            // Refresh list
            fetchData();
        } catch (err) {
            alert(`Failed to ${action} user`);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
    );

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900">
                        {activeTab === 'queries' ? 'Contact Queries' : 'User Management'}
                    </h1>
                    <p className="mt-1 text-neutral-500">
                        {activeTab === 'queries' ? 'View and manage support messages' : 'Manage user access and verify registrations'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchData}
                        className="btn bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50 shadow-sm"
                        disabled={loading}
                    >
                        <RefreshCw size={18} className={`${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={activeTab === 'queries' ? "Search queries..." : "Search users..."}
                            className="input-field pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-neutral-200 mb-6">
                <div className="flex space-x-8 overflow-x-auto">
                    {[
                        { id: 'pending', label: 'Pending Approval', count: activeTab === 'pending' ? users.length : undefined },
                        { id: 'active', label: 'Active Users', count: activeTab === 'active' ? users.length : undefined },
                        { id: 'deleted', label: 'Deleted Users', count: activeTab === 'deleted' ? users.length : undefined },
                        { id: 'queries', label: 'Queries', count: activeTab === 'queries' ? contacts.length : undefined }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`
                                py-4 px-1 border-b-2 text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2
                                ${activeTab === tab.id
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}
                            `}
                        >
                            {tab.label}
                            {tab.count !== undefined && !loading && (
                                <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${activeTab === tab.id ? 'bg-primary-50 text-primary-600' : 'bg-neutral-100 text-neutral-600'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {activeTab === 'queries' ? (
                        filteredContacts.length === 0 ? (
                            <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-neutral-200 border-dashed">
                                <div className="mx-auto h-12 w-12 text-neutral-400">
                                    <Search size={48} strokeWidth={1} />
                                </div>
                                <h3 className="mt-2 text-sm font-medium text-neutral-900">No queries found</h3>
                                <p className="mt-1 text-sm text-neutral-500">
                                    {searchTerm ? 'Try adjusting your search terms.' : 'No support queries yet.'}
                                </p>
                            </div>
                        ) : (
                            filteredContacts.map((contact) => (
                                <div key={contact._id} className="card p-6 animate-fade-in hover:border-primary-200 transition-colors">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                                    {contact.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-neutral-900">{contact.name}</h3>
                                                    <span className="text-xs text-neutral-400">{format(new Date(contact.createdAt), 'MMM d, yyyy h:mm a')}</span>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className="text-neutral-400" />
                                                    <span className="truncate">{contact.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className="text-neutral-400" />
                                                    <span>{contact.phone}</span>
                                                </div>
                                            </div>

                                            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 text-neutral-700 text-sm leading-relaxed">
                                                {contact.message}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    ) : (
                        filteredUsers.length === 0 ? (
                            <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-neutral-200 border-dashed">
                                <div className="mx-auto h-12 w-12 text-neutral-400">
                                    <Search size={48} strokeWidth={1} />
                                </div>
                                <h3 className="mt-2 text-sm font-medium text-neutral-900">No users found</h3>
                                <p className="mt-1 text-sm text-neutral-500">
                                    {searchTerm ? 'Try adjusting your search terms.' : 'No users in this category.'}
                                </p>
                            </div>
                        ) : (
                            filteredUsers.map((userData) => (
                                <div key={userData._id} className="card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in group hover:border-primary-200 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-bold text-lg ring-2 ring-white shadow-sm">
                                                {userData.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-bold text-neutral-900 truncate group-hover:text-primary-600 transition-colors">{userData.name}</h3>
                                                    {/* Status Badges */}
                                                    {userData.isVerified ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                            Verified
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
                                                            Pending
                                                        </span>
                                                    )}
                                                    {userData.isHeld && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                                            On Hold
                                                        </span>
                                                    )}
                                                    {userData.isAdmin && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                                            Admin
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600 pl-13 sm:pl-0">
                                            <div className="flex items-center gap-2 min-w-[200px]">
                                                <Mail size={14} className="text-neutral-400" />
                                                <span className="truncate">{userData.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-neutral-400" />
                                                <a href={`tel:${userData.phone}`} className="hover:text-primary-600 hover:underline transition-colors">{userData.phone}</a>
                                            </div>
                                            <div className="flex items-center gap-2 text-neutral-400 text-xs">
                                                <span>Joined {format(new Date(userData.createdAt), 'MMM d, yyyy')}</span>
                                            </div>

                                            {/* Payment Screenshot */}
                                            {userData.paymentScreenshot && (
                                                <div className="w-full mt-3 pt-3 border-t border-neutral-100">
                                                    <p className="text-xs font-semibold text-neutral-500 mb-2 uppercase tracking-wider">Payment Verification</p>
                                                    <a href={userData.paymentScreenshot} target="_blank" rel="noopener noreferrer" className="inline-block relative group/img">
                                                        <div className="w-32 h-20 rounded-lg overflow-hidden border border-neutral-200 shadow-sm group-hover/img:shadow-md transition-all">
                                                            <img
                                                                src={userData.paymentScreenshot}
                                                                alt="Payment Screenshot"
                                                                className="w-full h-full object-cover transform group-hover/img:scale-105 transition-transform duration-300"
                                                            />
                                                        </div>
                                                        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/5 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                                                            <Search className="text-white drop-shadow-md" size={20} />
                                                        </div>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-t-0 border-neutral-100 pt-4 sm:pt-0">
                                        {activeTab === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(userData._id, 'approve')}
                                                    className="flex-1 sm:flex-none btn bg-green-600 text-white hover:bg-green-700 shadow-sm py-2 px-3 text-sm h-10"
                                                    disabled={actionLoading === userData._id}
                                                >
                                                    <Check size={16} className="mr-1.5" /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(userData._id, 'reject')}
                                                    className="flex-1 sm:flex-none btn bg-white text-red-600 border border-neutral-200 hover:bg-red-50 hover:border-red-100 shadow-sm py-2 px-3 text-sm h-10"
                                                    disabled={actionLoading === userData._id}
                                                >
                                                    <X size={16} className="mr-1.5" /> Reject
                                                </button>
                                            </>
                                        )}
                                        {activeTab === 'active' && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(userData._id, userData.isHeld ? 'unhold' : 'hold')}
                                                    className={`flex-1 sm:flex-none btn border shadow-sm py-2 px-3 text-sm h-10 ${userData.isHeld ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'}`}
                                                    disabled={actionLoading === userData._id}
                                                >
                                                    <AlertTriangle size={16} className="mr-1.5" />
                                                    {userData.isHeld ? 'Unhold' : 'Hold'}
                                                </button>
                                                <button
                                                    onClick={() => handleAction(userData._id, 'delete')}
                                                    className="flex-1 sm:flex-none btn bg-white text-red-600 border border-neutral-200 hover:bg-red-50 hover:border-red-100 shadow-sm py-2 px-3 text-sm h-10"
                                                    disabled={actionLoading === userData._id}
                                                >
                                                    <Trash2 size={16} className="mr-1.5" /> Delete
                                                </button>
                                            </>
                                        )}
                                        {activeTab === 'deleted' && (
                                            <button
                                                onClick={() => handleAction(userData._id, 'restore')}
                                                className="flex-1 sm:flex-none btn bg-white text-primary-600 border border-neutral-200 hover:bg-primary-50 hover:border-primary-100 shadow-sm py-2 px-3 text-sm h-10"
                                                disabled={actionLoading === userData._id}
                                            >
                                                <RotateCcw size={16} className="mr-1.5" /> Restore
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminVerify;
