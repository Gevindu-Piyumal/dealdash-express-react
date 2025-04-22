'use client';

import { categoryService } from '@/services/categoryService';
import CategoryForm from '@/components/categories/CategoryForm';

export default function CreateCategoryPage() {
  const handleSubmit = async (formData) => {
    return await categoryService.createCategory(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Create New Category</h1>
      <CategoryForm onSubmit={handleSubmit} />
    </div>
  );
}