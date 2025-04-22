'use client';

import { useState, useEffect } from 'react';
import { use } from 'react'; // Add this import
import { categoryService } from '@/services/categoryService';
import CategoryForm from '@/components/categories/CategoryForm';

export default function EditCategoryPage({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await categoryService.getCategoryById(id);
        setCategory(data);
      } catch (err) {
        setError('Failed to load category');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (formData) => {
    return await categoryService.updateCategory(id, formData);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!category) return <p>Category not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Edit Category</h1>
      <CategoryForm category={category} onSubmit={handleSubmit} />
    </div>
  );
}