'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { vendorService } from '@/services/vendorService';
import VendorCard from '@/components/vendors/VendorCard';
import Button from '@/components/ui/Button';

export default function VendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const data = await vendorService.getAllVendors();
      setVendors(data);
      setError(null);
    } catch (err) {
      setError('Failed to load vendors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;
    
    try {
      await vendorService.deleteVendor(id);
      setVendors(vendors.filter(vendor => vendor._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Vendors</h1>
        <Link href="/vendors/create">
          <Button>Add New Vendor</Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading vendors...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <Button onClick={fetchVendors} variant="secondary" className="ml-4">
            Retry
          </Button>
        </div>
      ) : vendors.length === 0 ? (
        <p>No vendors found. Create your first vendor!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map(vendor => (
            <VendorCard 
              key={vendor._id} 
              vendor={vendor}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}