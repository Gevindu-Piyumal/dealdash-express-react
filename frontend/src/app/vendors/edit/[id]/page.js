'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { vendorService } from '@/services/vendorService';
import VendorForm from '@/components/vendors/VendorForm';

export default function EditVendorPage({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const data = await vendorService.getVendorById(id);
        setVendor(data);
      } catch (err) {
        setError('Failed to load vendor');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);

  const handleSubmit = async (formData) => {
    return await vendorService.updateVendor(id, formData);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!vendor) return <p>Vendor not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Edit Vendor</h1>
      <VendorForm vendor={vendor} onSubmit={handleSubmit} />
    </div>
  );
}