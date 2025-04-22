'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">DealDash Admin Panel</h1>
        <p className="text-xl mb-8">Manage your categories, vendors, and deals</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={() => router.push('/categories')} className="text-lg px-6 py-3">
            Manage Categories
          </Button>
          <Button onClick={() => router.push('/vendors')} className="text-lg px-6 py-3">
            Manage Vendors
          </Button>
          <Button onClick={() => router.push('/deals')} className="text-lg px-6 py-3">
            Manage Deals
          </Button>
        </div>
      </div>
    </div>
  );
}