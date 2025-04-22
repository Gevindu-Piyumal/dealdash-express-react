'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { categoryService } from '@/services/categoryService';
import CategoryCard from '@/components/categories/CategoryCard';
import Button from '@/components/ui/Button';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await categoryService.deleteCategory(id);
      setCategories(categories.filter(category => category._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href="/categories/create">
          <Button>Add New Category</Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading categories...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <Button onClick={fetchCategories} variant="secondary" className="ml-4">
            Retry
          </Button>
        </div>
      ) : categories.length === 0 ? (
        <p>No categories found. Create your first category!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <CategoryCard 
              key={category._id} 
              category={category}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}