import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Building } from 'lucide-react';

interface Business {
    _id: string;
    name: string;
    address: string;
    logoUrl?: string;
    sealUrl?: string;
}

const BusinessList: React.FC = () => {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        try {
            const response = await axios.get('https://kk01km6g-3000.inc1.devtunnels.ms/businesses');
            setBusinesses(response.data);
        } catch (error) {
            console.error('Error fetching businesses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this business?')) return;
        try {
            await axios.delete(`https://kk01km6g-3000.inc1.devtunnels.ms/businesses/${id}`);
            setBusinesses(businesses.filter((b) => b._id !== id));
        } catch (error) {
            console.error('Error deleting business:', error);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            {/* <div className="bg-white shadow mb-8">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-xl font-bold text-blue-600">Bharat Business</Link>
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/" className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Businesses</Link>
                                <Link to="/recipients" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Recipients</Link>
                                <Link to="/drafts/new" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">+ New Draft</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="px-4 pb-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Businesses</h1>
                    <Link
                        to="/businesses/new"
                        className="flex items-center px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
                    >
                        <Plus size={20} className="mr-2" />
                        Add Business
                    </Link>
                </div>

                {businesses.length === 0 ? (
                    <div className="py-12 text-center bg-white rounded-lg shadow">
                        <Building size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-lg text-gray-500">No businesses found. Create one to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {businesses.map((business) => (
                            <div key={business._id} className="overflow-hidden transition bg-white rounded-lg shadow hover:shadow-md">
                                <div className="h-32 bg-gray-100 flex items-center justify-center">
                                    {business.logoUrl ? (
                                        <img src={business.logoUrl} alt={business.name} className="object-contain w-full h-full p-4" />
                                    ) : (
                                        <Building size={48} className="text-gray-300" />
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="mb-2 text-xl font-bold text-gray-900">{business.name}</h3>
                                    <p className="mb-4 text-sm text-gray-600 line-clamp-2">{business.address}</p>
                                    <div className="flex justify-end space-x-2">
                                        <Link
                                            to={`/businesses/edit/${business._id}`}
                                            className="p-2 text-gray-600 transition hover:text-blue-600 hover:bg-blue-50 rounded-full"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(business._id)}
                                            className="p-2 text-gray-600 transition hover:text-red-600 hover:bg-red-50 rounded-full"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessList;
