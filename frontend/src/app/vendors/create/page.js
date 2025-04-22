'use client';

import { vendorService } from '@/services/vendorService';
import VendorForm from '@/components/vendors/VendorForm';

export default function CreateVendorPage() {
  const handleSubmit = async (formData) => {
    return await vendorService.createVendor(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Create New Vendor</h1>
      <VendorForm onSubmit={handleSubmit} />
    </div>
  );
}