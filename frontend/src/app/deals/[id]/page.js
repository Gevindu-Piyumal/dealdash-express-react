'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { use } from 'react';
import { dealService } from '@/services/dealService';
import Button from '@/components/ui/Button';

export default function DealDetailsPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchDeal = async () => {
      try {
        setLoading(true);
        const data = await dealService.getDealById(id);
        setDeal(data);
        setError(null);
      } catch (err) {
        setError('Failed to load deal');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this deal?')) return;
    
    try {
      await dealService.deleteDeal(id);
      router.push('/deals');
    } catch (err) {
      alert(err.message);
    }
  };

  // Format dates in a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Determine if the deal is expired
  const isExpired = deal && new Date(deal.expireDate) < new Date();

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!deal) return <p>Deal not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
        {/* Banner image */}
        {deal.banner && (
          <div className="h-64 w-full relative">
            <Image
              src={deal.banner}
              alt={deal.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          {/* Title and status */}
          <div className="flex flex-wrap justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{deal.title}</h1>
            <div className="flex space-x-2 mt-1 md:mt-0">
              {deal.isActive ? (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {isExpired ? 'Expired' : 'Active'}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Inactive
                </span>
              )}
              
              {deal.isFeatured && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  Featured
                </span>
              )}
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{deal.description}</p>
          </div>
          
          {/* Dates */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Start Date:</span> {formatDate(deal.startDate)}
              </div>
              <div>
                <span className="font-medium">Expiration Date:</span> {formatDate(deal.expireDate)}
              </div>
            </div>
          </div>
          
          {/* Vendor Info */}
          {deal.vendor && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Vendor</h2>
              <div className="flex items-center">
                {deal.vendor.logo && (
                  <div className="w-12 h-12 mr-4 relative">
                    <img
                      src={deal.vendor.logo}
                      alt={deal.vendor.name}
                      className="object-cover rounded-full"
                      width={48}
                      height={48}
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{deal.vendor.name}</h3>
                  {deal.vendor.address && (
                    <p className="text-sm text-gray-600">{deal.vendor.address}</p>
                  )}
                </div>
              </div>
              
              {/* Vendor contact info */}
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {deal.vendor.contactNumber && (
                  <div>
                    <span className="font-medium">Phone:</span> {deal.vendor.contactNumber}
                  </div>
                )}
                {deal.vendor.email && (
                  <div>
                    <span className="font-medium">Email:</span> {deal.vendor.email}
                  </div>
                )}
                {deal.vendor.website && (
                  <div className="col-span-1 md:col-span-2">
                    <span className="font-medium">Website:</span>{' '}
                    <a href={deal.vendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {deal.vendor.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Category */}
          {deal.category && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Category</h2>
              <div className="flex items-center">
                {deal.category.icon && (
                  <div className="w-8 h-8 mr-2 relative">
                    <img
                      src={deal.category.icon}
                      alt={deal.category.name}
                      className="object-cover rounded"
                      width={32}
                      height={32}
                    />
                  </div>
                )}
                <span>{deal.category.name}</span>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex space-x-4 mt-8">
            <Link href="/deals">
              <Button variant="secondary">Back to Deals</Button>
            </Link>
            <Link href={`/deals/edit/${id}`}>
              <Button>Edit Deal</Button>
            </Link>
            <Button variant="danger" onClick={handleDelete}>
              Delete Deal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}