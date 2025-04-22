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
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dashboard cards */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">Categories</h2>
          <p className="text-gray-600 mb-4">Organize deals by categories</p>
          <Button onClick={() => router.push('/categories')} variant="secondary" className="w-full">
            View Categories
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">Vendors</h2>
          <p className="text-gray-600 mb-4">Manage vendors offering deals</p>
          <Button onClick={() => router.push('/vendors')} variant="secondary" className="w-full">
            View Vendors
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">Deals</h2>
          <p className="text-gray-600 mb-4">Create and manage promotional deals</p>
          <Button onClick={() => router.push('/deals')} variant="secondary" className="w-full">
            View Deals
          </Button>
        </div>
      </div>
    </div>
  );
}