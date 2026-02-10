import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
// import LetterheadPreview from '../../components/LetterheadPreview';
import { Upload } from 'lucide-react';

const BusinessForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        headerImage: '', // Renamed from logoUrl
        footerImage: '', // New
        sealUrl: '',
    });
    const [loading, setLoading] = useState(false);
    const [uploadingHeader, setUploadingHeader] = useState(false);
    const [uploadingFooter, setUploadingFooter] = useState(false);
    const [uploadingSeal, setUploadingSeal] = useState(false);

    useEffect(() => {
        if (isEditing) {
            fetchBusiness();
        }
    }, [id]);

    const fetchBusiness = async () => {
        try {
            const response = await axios.get(`https://kk01km6g-3000.inc1.devtunnels.ms/businesses/${id}`);
            // Map old logoUrl to headerImage if headerImage is missing (migration support)
            const data = response.data;
            if (data.logoUrl && !data.headerImage) {
                data.headerImage = data.logoUrl;
            }
            setFormData(data);
        } catch (error) {
            console.error('Error fetching business:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'headerImage' | 'footerImage' | 'sealUrl') => {
        const file = e.target.files?.[0];
        if (!file) return;

        let setUploading;
        if (field === 'headerImage') setUploading = setUploadingHeader;
        else if (field === 'footerImage') setUploading = setUploadingFooter;
        else setUploading = setUploadingSeal;

        setUploading(true);

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const response = await axios.post('https://kk01km6g-3000.inc1.devtunnels.ms/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setFormData((prev) => ({ ...prev, [field]: response.data.url }));
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('File upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                await axios.patch(`https://kk01km6g-3000.inc1.devtunnels.ms/businesses/${id}`, formData);
            } else {
                await axios.post('https://kk01km6g-3000.inc1.devtunnels.ms/businesses', formData);
            }
            navigate('/');
        } catch (error) {
            console.error('Error saving business:', error);
            alert('Failed to save business');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Form Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditing ? 'Edit Business' : 'Create Business'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full border rounded-md shadow-sm p-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea name="address" value={formData.address} onChange={handleInputChange} required rows={3} className="mt-1 block w-full border rounded-md shadow-sm p-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full border rounded-md shadow-sm p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border rounded-md shadow-sm p-2" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Website</label>
                            <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="mt-1 block w-full border rounded-md shadow-sm p-2" />
                        </div>

                        {/* File Uploads */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Header Image */}
                            <div className="border border-dashed border-gray-300 p-4 rounded-lg text-center bg-gray-50">
                                <p className="text-sm font-medium text-gray-700 mb-2">Letter Header (Top Banner)</p>
                                <p className="text-xs text-gray-500 mb-3">Rectangular full-width image</p>
                                {formData.headerImage && (
                                    <img src={formData.headerImage.startsWith('http') ? formData.headerImage : `https://kk01km6g-3000.inc1.devtunnels.ms${formData.headerImage}`} alt="Header Preview" className="h-16 w-full object-contain mb-3 bg-white border" />
                                )}
                                <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                                    <Upload size={16} className="mr-2" />
                                    {uploadingHeader ? 'Uploading...' : 'Upload Header'}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'headerImage')} />
                                </label>
                            </div>

                            {/* Footer Image */}
                            <div className="border border-dashed border-gray-300 p-4 rounded-lg text-center bg-gray-50">
                                <p className="text-sm font-medium text-gray-700 mb-2">Letter Footer (Bottom Banner)</p>
                                <p className="text-xs text-gray-500 mb-3">Rectangular full-width image</p>
                                {formData.footerImage && (
                                    <img src={formData.footerImage.startsWith('http') ? formData.footerImage : `https://kk01km6g-3000.inc1.devtunnels.ms${formData.footerImage}`} alt="Footer Preview" className="h-16 w-full object-contain mb-3 bg-white border" />
                                )}
                                <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                                    <Upload size={16} className="mr-2" />
                                    {uploadingFooter ? 'Uploading...' : 'Upload Footer'}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'footerImage')} />
                                </label>
                            </div>

                            {/* Seal */}
                            <div className="border border-dashed border-gray-300 p-4 rounded-lg text-center bg-gray-50">
                                <p className="text-sm font-medium text-gray-700 mb-2">Company Seal (Optional)</p>
                                <p className="text-xs text-gray-500 mb-3">Round stamp/seal image</p>
                                {formData.sealUrl && (
                                    <img src={formData.sealUrl.startsWith('http') ? formData.sealUrl : `https://kk01km6g-3000.inc1.devtunnels.ms${formData.sealUrl}`} alt="Seal Preview" className="h-24 w-24 object-contain mx-auto mb-3 bg-white border rounded-full" />
                                )}
                                <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                                    <Upload size={16} className="mr-2" />
                                    {uploadingSeal ? 'Uploading...' : 'Upload Seal'}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'sealUrl')} />
                                </label>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Business'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Live Preview Section */}
                <div className="bg-gray-100 p-6 rounded-lg sticky top-8 h-fit">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Preview</h3>
                    <div className="bg-white shadow-lg p-8 min-h-[400px] flex flex-col justify-between relative">
                        {/* Header Preview */}
                        <div className="w-full h-24 bg-gray-50 border-b-2 border-gray-100 flex items-center justify-center overflow-hidden">
                            {formData.headerImage ? (
                                <img src={formData.headerImage.startsWith('http') ? formData.headerImage : `https://kk01km6g-3000.inc1.devtunnels.ms${formData.headerImage}`} alt="Header" className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-gray-400 text-sm">Header Image</span>
                            )}
                        </div>

                        {/* Content Placeholder */}
                        <div className="flex-1 py-8 space-y-4">
                            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-100 rounded w-full"></div>
                            <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                        </div>

                        {/* Seal Preview (Absolute) */}
                        {formData.sealUrl && (
                            <div className="absolute bottom-32 right-10 h-24 w-24 flex items-center justify-center pointer-events-none opacity-80 rotate-[-10deg]">
                                <img src={formData.sealUrl.startsWith('http') ? formData.sealUrl : `https://kk01km6g-3000.inc1.devtunnels.ms${formData.sealUrl}`} alt="Seal" className="h-full w-full object-contain" />
                            </div>
                        )}

                        {/* Footer Preview */}
                        <div className="w-full h-16 bg-gray-50 border-t-2 border-gray-100 flex items-center justify-center overflow-hidden mt-4">
                            {formData.footerImage ? (
                                <img src={formData.footerImage.startsWith('http') ? formData.footerImage : `https://kk01km6g-3000.inc1.devtunnels.ms${formData.footerImage}`} alt="Footer" className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-gray-400 text-sm">Footer Image</span>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BusinessForm;
