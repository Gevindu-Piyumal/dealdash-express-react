'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { use } from 'react'; // Import use from React
import { categoryService } from '@/services/categoryService';
import Button from '@/components/ui/Button';

export default function CategoryDetailsPage({ params }) {
  const router = useRouter();
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getCategoryById(id);
        setCategory(data);
        setError(null);
      } catch (err) {
        setError('Failed to load category');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await categoryService.deleteCategory(id);
      router.push('/categories');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!category) return <p>Category not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">{category.name}</h1>
        </div>

        {category.icon && (
          <div className="mb-6">
            <div className="w-24 h-24 relative">
              <img 
                src={category.icon} 
                alt={category.name}
                className="object-cover rounded"
                width={96} 
                height={96}
              />
            </div>
          </div>
        )}

        <div className="flex space-x-4 mt-8">
          <Link href="/categories">
            <Button variant="secondary">Back to Categories</Button>
          </Link>
          <Link href={`/categories/edit/${id}`}>
            <Button>Edit Category</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Delete Category
          </Button>
        </div>
      </div>
    </div>
  );
}