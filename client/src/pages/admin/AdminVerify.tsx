import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Phone, Mail, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

interface PendingUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
}

const AdminVerify: React.FC = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const response = await axios.get('https://letter-drafting.onrender.com/users/pending');
            setUsers(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (!window.confirm('Are you sure you want to approve this user?')) return;
        setActionLoading(id);
        try {
            await axios.patch(`https://letter-drafting.onrender.com/users/${id}/approve`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to approve user');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: string) => {
        if (!window.confirm('Are you sure you want to reject (delete) this user?')) return;
        setActionLoading(id);
        try {
            await axios.delete(`https://letter-drafting.onrender.com/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to reject user');
        } finally {
            setActionLoading(null);
        }
    };

    if (!user?.admin) {
        return <div className="p-8 text-center text-red-600">Access Denied</div>;
    }

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="mr-2" /> Verify Accounts
            </h1>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {users.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                    No pending accounts to verify.
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <ul className="divide-y divide-gray-200">
                        {users.map((pendingUser) => (
                            <li key={pendingUser._id} className="p-4 sm:p-6 hover:bg-gray-50 transition">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-medium text-gray-900 truncate">{pendingUser.name}</h3>
                                        <div className="mt-1 flex flex-col sm:flex-row sm:space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center mt-1 sm:mt-0">
                                                <Mail size={16} className="mr-1.5 flex-shrink-0 text-gray-400" />
                                                <span className="truncate">{pendingUser.email}</span>
                                            </div>
                                            <div className="flex items-center mt-1 sm:mt-0">
                                                <Phone size={16} className="mr-1.5 flex-shrink-0 text-gray-400" />
                                                <a href={`tel:${pendingUser.phone}`} className="hover:text-blue-600">{pendingUser.phone}</a>
                                            </div>
                                            <div className="flex items-center mt-1 sm:mt-0">
                                                <Calendar size={16} className="mr-1.5 flex-shrink-0 text-gray-400" />
                                                <span>{format(new Date(pendingUser.createdAt), 'PPP p')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
                                        <button
                                            onClick={() => handleApprove(pendingUser._id)}
                                            disabled={actionLoading === pendingUser._id}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                        >
                                            {actionLoading === pendingUser._id ? '...' : <><Check size={16} className="mr-1" /> Approve</>}
                                        </button>
                                        <button
                                            onClick={() => handleReject(pendingUser._id)}
                                            disabled={actionLoading === pendingUser._id}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                        >
                                            {actionLoading === pendingUser._id ? '...' : <><X size={16} className="mr-1" /> Reject</>}
                                        </button>
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
