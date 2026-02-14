import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Phone, Mail, User, UserX, PauseCircle, PlayCircle, RefreshCw, Trash2, ShieldCheck, AlertCircle, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface UserData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
    isHeld: boolean;
    isDeleted: boolean;
}

interface ContactData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt: string;
}

type TabType = 'active' | 'pending' | 'deleted' | 'queries';

const AdminVerify: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('active');
    const [users, setUsers] = useState<UserData[]>([]);
    const [contacts, setContacts] = useState<ContactData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            if (activeTab === 'queries') {
                const response = await axios.get('https://letter-drafting.onrender.com/contacts', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Ensure auth header if needed, though axios interceptor might handle it. Adding explicitly to be safe as controller is guarded.
                });
                setContacts(response.data);
            } else {
                const endpoint = activeTab === 'pending' ? 'pending' : activeTab === 'deleted' ? 'deleted' : 'active';
                const response = await axios.get(`https://letter-drafting.onrender.com/users/${endpoint}`);
                setUsers(response.data);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'reject' | 'hold' | 'unhold' | 'softDelete' | 'restore') => {
        const confirmMsg = {
            approve: 'Approve this user?',
            reject: 'Permanently delete this user?',
            hold: 'Put this user on hold?',
            unhold: 'Activate this user?',
            softDelete: 'Move this user to trash?',
            restore: 'Restore this user?'
        }[action];

        if (!window.confirm(confirmMsg)) return;

        setActionLoading(id);
        try {
            let url = `https://letter-drafting.onrender.com/users/${id}`;
            let method: 'patch' | 'delete' = 'patch';

            switch (action) {
                case 'approve': url += '/approve'; break;
                case 'reject': method = 'delete'; break; // Hard delete
                case 'hold': url += '/hold'; break;
                case 'unhold': url += '/unhold'; break;
                case 'softDelete': url += '/soft'; method = 'delete'; break;
                case 'restore': url += '/restore'; break;
            }

            await axios[method](url);
            setUsers(users.filter(u => u._id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || `Failed to ${action} user`);
        } finally {
            setActionLoading(null);
        }
    };

    if (!user?.admin) {
        return <div className="p-8 text-center text-red-600 font-medium bg-red-50 rounded-lg max-w-lg mx-auto mt-20">Access Denied: Admins only.</div>;
    }

    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: 'active', label: 'Active Users', icon: User },
        { id: 'pending', label: 'Pending Approval', icon: UserX },
        { id: 'deleted', label: 'Deleted Users', icon: Trash2 },
        { id: 'queries', label: 'Queries', icon: MessageSquare },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                    <ShieldCheck className="text-primary-600" />
                    Admin Dashboard
                </h1>
                <p className="text-neutral-500 text-sm">Manage users and view contact queries.</p>
            </div>

            {/* Tabs */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-neutral-200 flex flex-wrap gap-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                                ${isActive
                                    ? 'bg-neutral-900 text-white shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}
                            `}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 text-red-700">
                    <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-neutral-200 rounded-xl" />
                    ))}
                </div>
            ) : (activeTab === 'queries' ? contacts.length === 0 : users.length === 0) ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-neutral-300">
                    <div className="bg-neutral-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User size={32} className="text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900">No data found</h3>
                    <p className="text-neutral-500 mt-1">
                        There are no records to display.
                    </p>
                </div>
            ) : (
                <div className="bg-white shadow-card rounded-xl border border-neutral-200 overflow-hidden">
                    <ul className="divide-y divide-neutral-100">
                        {activeTab === 'queries' ? (
                            contacts.map((contact) => (
                                <li key={contact._id} className="p-5 hover:bg-neutral-50 transition-colors">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                    {contact.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-neutral-900">{contact.name}</span>
                                            </div>
                                            <span className="text-xs text-neutral-400">
                                                {format(new Date(contact.createdAt), 'MMM d, yyyy h:mm a')}
                                            </span>
                                        </div>
                                        <div className="ml-10 space-y-1">
                                            <div className="text-sm text-neutral-600 flex items-center gap-2">
                                                <Mail size={14} className="text-neutral-400" /> {contact.email}
                                            </div>
                                            <div className="text-sm text-neutral-600 flex items-center gap-2">
                                                <Phone size={14} className="text-neutral-400" /> {contact.phone}
                                            </div>
                                            <div className="mt-2 p-3 bg-neutral-50 rounded-lg text-sm text-neutral-700 border border-neutral-100">
                                                {contact.message}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            users.map((userData) => (
                                <li key={userData._id} className="p-5 hover:bg-neutral-50 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-bold text-sm">
                                                    {userData.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-sm font-semibold text-neutral-900 truncate">{userData.name}</h3>
                                                        {userData.isHeld && (
                                                            <span className="px-2 py-0.5 inline-flex text-[10px] font-bold uppercase tracking-wider rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                                On Hold
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-neutral-500 mt-0.5">
                                                        Joined {format(new Date(userData.createdAt), 'MMM d, yyyy')}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className="text-neutral-400" />
                                                    <span className="truncate">{userData.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className="text-neutral-400" />
                                                    <a href={`tel:${userData.phone}`} className="hover:text-primary-600 hover:underline transition-colors">{userData.phone}</a>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto self-start sm:self-center">
                                            {activeTab === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(userData._id, 'approve')}
                                                        disabled={actionLoading === userData._id}
                                                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
                                                    >
                                                        <Check size={14} className="mr-1.5" /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(userData._id, 'reject')}
                                                        disabled={actionLoading === userData._id}
                                                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 border border-neutral-200 text-xs font-medium rounded-lg text-red-600 bg-white hover:bg-red-50 disabled:opacity-50 transition-colors"
                                                    >
                                                        <X size={14} className="mr-1.5" /> Reject
                                                    </button>
                                                </>
                                            )}

                                            {activeTab === 'active' && (
                                                <>
                                                    {userData.isHeld ? (
                                                        <button
                                                            onClick={() => handleAction(userData._id, 'unhold')}
                                                            disabled={actionLoading === userData._id}
                                                            className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 border border-primary-200 text-xs font-medium rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 disabled:opacity-50 transition-colors"
                                                        >
                                                            <PlayCircle size={14} className="mr-1.5" /> Activate
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleAction(userData._id, 'hold')}
                                                            disabled={actionLoading === userData._id}
                                                            className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 border border-neutral-200 text-xs font-medium rounded-lg text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50 transition-colors"
                                                        >
                                                            <PauseCircle size={14} className="mr-1.5" /> Hold
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleAction(userData._id, 'softDelete')}
                                                        disabled={actionLoading === userData._id}
                                                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 border border-neutral-200 text-xs font-medium rounded-lg text-red-600 bg-white hover:bg-red-50 disabled:opacity-50 transition-colors"
                                                    >
                                                        <Trash2 size={14} className="mr-1.5" /> Delete
                                                    </button>
                                                </>
                                            )}

                                            {activeTab === 'deleted' && (
                                                <button
                                                    onClick={() => handleAction(userData._id, 'restore')}
                                                    disabled={actionLoading === userData._id}
                                                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
                                                >
                                                    <RefreshCw size={14} className="mr-1.5" /> Restore
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AdminVerify;
