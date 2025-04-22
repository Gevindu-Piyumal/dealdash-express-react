'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { use } from 'react';
import { vendorService } from '@/services/vendorService';
import Button from '@/components/ui/Button';

export default function VendorDetailsPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchVendor = async () => {
      try {
        setLoading(true);
        const data = await vendorService.getVendorById(id);
        setVendor(data);
        setError(null);
      } catch (err) {
        setError('Failed to load vendor');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;
    
    try {
      await vendorService.deleteVendor(id);
      router.push('/vendors');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!vendor) return <p>Vendor not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          {vendor.logo && (
            <div className="w-24 h-24 mr-6 relative">
              <img 
                src={vendor.logo} 
                alt={vendor.name}
                className="object-cover rounded-lg"
                width={96}
                height={96}
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{vendor.name}</h1>
            {vendor.address && <p className="text-gray-600">{vendor.address}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
            <ul className="space-y-2">
              {vendor.contactNumber && (
                <li className="flex">
                  <span className="w-24 font-medium">Phone:</span>
                  <span>{vendor.contactNumber}</span>
                </li>
              )}
              {vendor.email && (
                <li className="flex">
                  <span className="w-24 font-medium">Email:</span>
                  <span>{vendor.email}</span>
                </li>
              )}
              {vendor.website && (
                <li className="flex">
                  <span className="w-24 font-medium">Website:</span>
                  <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {vendor.website}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Business Details</h2>
            <ul className="space-y-2">
              {vendor.openingHours && (
                <li className="flex">
                  <span className="w-24 font-medium">Hours:</span>
                  <span>{vendor.openingHours}</span>
                </li>
              )}
              {vendor.location?.coordinates && vendor.location.coordinates[0] !== 0 && vendor.location.coordinates[1] !== 0 && (
                <li className="flex">
                  <span className="w-24 font-medium">Location:</span>
                  <span>
                    {vendor.location.coordinates[1]}, {vendor.location.coordinates[0]}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Social Media */}
        {(vendor.socialMedia?.facebook || vendor.socialMedia?.instagram || vendor.socialMedia?.whatsapp) && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Social Media</h2>
            <div className="flex space-x-4">
              {vendor.socialMedia.facebook && (
                <a href={vendor.socialMedia.facebook} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">Facebook</a>
              )}
              {vendor.socialMedia.instagram && (
                <a href={vendor.socialMedia.instagram} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">Instagram</a>
              )}
              {vendor.socialMedia.whatsapp && (
                <a href={`https://wa.me/${vendor.socialMedia.whatsapp}`} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">WhatsApp</a>
              )}
            </div>
          </div>
        )}

        {/* Deals section */}
        {vendor.deals && vendor.deals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Deals ({vendor.deals.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendor.deals.map(deal => (
                <div key={deal._id} className="border rounded-lg p-3 hover:bg-gray-50">
                  <h3 className="font-medium">{deal.title}</h3>
                  <p className="text-sm text-gray-600 truncate">{deal.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-4 mt-8">
          <Link href="/vendors">
            <Button variant="secondary">Back to Vendors</Button>
          </Link>
          <Link href={`/vendors/edit/${id}`}>
            <Button>Edit Vendor</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Delete Vendor
          </Button>
        </div>
      </div>
    </div>
  );
}