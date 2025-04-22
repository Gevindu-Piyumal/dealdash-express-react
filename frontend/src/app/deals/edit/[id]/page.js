'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { dealService } from '@/services/dealService';
import DealForm from '@/components/deals/DealForm';

export default function EditDealPage({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const data = await dealService.getDealById(id);
        setDeal(data);
      } catch (err) {
        setError('Failed to load deal');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

  const handleSubmit = async (formData) => {
    return await dealService.updateDeal(id, formData);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!deal) return <p>Deal not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Edit Deal</h1>
      <DealForm deal={deal} onSubmit={handleSubmit} />
    </div>
  );
}