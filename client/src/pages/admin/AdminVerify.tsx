import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Phone, Mail, Calendar, User, UserX, PauseCircle, PlayCircle, RefreshCw, Trash2 } from 'lucide-react';
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

type TabType = 'active' | 'pending' | 'deleted';

const AdminVerify: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('active');
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const endpoint = activeTab === 'pending' ? 'pending' : activeTab === 'deleted' ? 'deleted' : 'active';
            const response = await axios.get(`https://letter-drafting.onrender.com/users/${endpoint}`);
            setUsers(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch users');
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
        return <div className="p-8 text-center text-red-600">Access Denied</div>;
    }

    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: 'active', label: 'Active Users', icon: User },
        { id: 'pending', label: 'Pending Approval', icon: UserX },
        { id: 'deleted', label: 'Deleted Users', icon: Trash2 },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="mr-2" /> User Management
            </h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                                    ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                `}
                            >
                                <Icon size={16} className="mr-2" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="p-8 text-center">Loading...</div>
            ) : users.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                    No users found in this section.
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <ul className="divide-y divide-gray-200">
                        {users.map((userData) => (
                            <li key={userData._id} className="p-4 sm:p-6 hover:bg-gray-50 transition">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center">
                                            <h3 className="text-lg font-medium text-gray-900 truncate">{userData.name}</h3>
                                            {userData.isHeld && <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">On Hold</span>}
                                        </div>
                                        <div className="mt-1 flex flex-col sm:flex-row sm:space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center mt-1 sm:mt-0">
                                                <Mail size={16} className="mr-1.5 flex-shrink-0 text-gray-400" />
                                                <span className="truncate">{userData.email}</span>
                                            </div>
                                            <div className="flex items-center mt-1 sm:mt-0">
                                                <Phone size={16} className="mr-1.5 flex-shrink-0 text-gray-400" />
                                                <a href={`tel:${userData.phone}`} className="hover:text-blue-600">{userData.phone}</a>
                                            </div>
                                            <div className="flex items-center mt-1 sm:mt-0">
                                                <Calendar size={16} className="mr-1.5 flex-shrink-0 text-gray-400" />
                                                <span>{format(new Date(userData.createdAt), 'PPP p')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
                                        {activeTab === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(userData._id, 'approve')}
                                                    disabled={actionLoading === userData._id}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                                >
                                                    <Check size={16} className="mr-1" /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(userData._id, 'reject')}
                                                    disabled={actionLoading === userData._id}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                >
                                                    <X size={16} className="mr-1" /> Reject
                                                </button>
                                            </>
                                        )}

                                        {activeTab === 'active' && (
                                            <>
                                                {userData.isHeld ? (
                                                    <button
                                                        onClick={() => handleAction(userData._id, 'unhold')}
                                                        disabled={actionLoading === userData._id}
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                                    >
                                                        <PlayCircle size={16} className="mr-1" /> Activate
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAction(userData._id, 'hold')}
                                                        disabled={actionLoading === userData._id}
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                                                    >
                                                        <PauseCircle size={16} className="mr-1" /> Hold
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleAction(userData._id, 'softDelete')}
                                                    disabled={actionLoading === userData._id}
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                                >
                                                    <Trash2 size={16} className="mr-1" /> Delete
                                                </button>
                                            </>
                                        )}

                                        {activeTab === 'deleted' && (
                                            <button
                                                onClick={() => handleAction(userData._id, 'restore')}
                                                disabled={actionLoading === userData._id}
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                            >
                                                <RefreshCw size={16} className="mr-1" /> Restore
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AdminVerify;
