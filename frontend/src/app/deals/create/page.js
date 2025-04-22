'use client';

import { dealService } from '@/services/dealService';
import DealForm from '@/components/deals/DealForm';

export default function CreateDealPage() {
  const handleSubmit = async (formData) => {
    return await dealService.createDeal(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Create New Deal</h1>
      <DealForm onSubmit={handleSubmit} />
    </div>
  );
}