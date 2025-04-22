'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import FileInput from '../ui/FileInput';
import Button from '../ui/Button';

export default function CategoryForm({ category = null, onSubmit }) {
  const router = useRouter();
  const [name, setName] = useState(category?.name || '');
  const [icon, setIcon] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (icon) formData.append('icon', icon);
      
      await onSubmit(formData);
      router.push('/categories');
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setIcon(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      {errors.form && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.form}
        </div>
      )}
      
      <Input
        id="name"
        label="Category Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        error={errors.name}
      />
      
      <FileInput
        id="icon"
        label="Category Icon"
        onChange={handleFileChange}
        accept="image/*"
        error={errors.icon}
      />
      
      {category?.icon && !icon && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Current icon:</p>
          <div className="w-20 h-20 relative">
            <img 
              src={category.icon}
              alt={category.name}
              className="object-cover rounded border border-gray-300"
              width={80}
              height={80}
            />
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <Button 
          type="button" 
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}