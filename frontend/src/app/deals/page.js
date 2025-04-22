'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dealService } from '@/services/dealService';
import DealCard from '@/components/deals/DealCard';
import DealFilters from '@/components/deals/DealFilters';
import Button from '@/components/ui/Button';

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    active: true,
    featured: undefined,
    category: '',
    vendor: '',
  });

  useEffect(() => {
    fetchDeals(filters);
  }, []);

  const fetchDeals = async (filterParams) => {
    try {
      setLoading(true);
      const data = await dealService.getAllDeals(filterParams);
      setDeals(data);
      setError(null);
    } catch (err) {
      setError('Failed to load deals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;
    
    try {
      await dealService.deleteDeal(id);
      setDeals(deals.filter(deal => deal._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchDeals(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Deals</h1>
        <Link href="/deals/create">
          <Button>Add New Deal</Button>
        </Link>
      </div>
      
      <DealFilters onFilter={handleFilter} />

      {loading ? (
        <p>Loading deals...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <Button onClick={() => fetchDeals(filters)} variant="secondary" className="ml-4">
            Retry
          </Button>
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg mb-4">No deals found matching your filters.</p>
          <Button onClick={handleFilter} variant="secondary">
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map(deal => (
            <DealCard 
              key={deal._id} 
              deal={deal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}