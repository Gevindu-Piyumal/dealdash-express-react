'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import FileInput from '../ui/FileInput';
import Button from '../ui/Button';
import { categoryService } from '@/services/categoryService';
import { vendorService } from '@/services/vendorService';

export default function DealForm({ deal = null, onSubmit }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: deal?.title || '',
    description: deal?.description || '',
    category: deal?.category?._id || '',
    vendor: deal?.vendor?._id || '',
    startDate: deal?.startDate ? new Date(deal.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    expireDate: deal?.expireDate ? new Date(deal.expireDate).toISOString().split('T')[0] : '',
    isActive: deal?.isActive === undefined ? true : deal.isActive,
    isFeatured: deal?.isFeatured || false,
  });
  
  const [banner, setBanner] = useState(null);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load categories and vendors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, vendorsData] = await Promise.all([
          categoryService.getAllCategories(),
          vendorService.getAllVendors()
        ]);
        
        setCategories(categoriesData);
        setVendors(vendorsData);
      } catch (err) {
        console.error('Error loading form data:', err);
        setErrors({ form: 'Failed to load categories and vendors' });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setBanner(e.target.files[0]);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.vendor) newErrors.vendor = 'Vendor is required';
    if (!formData.expireDate) newErrors.expireDate = 'Expiration date is required';
    
    // Validate dates
    if (formData.startDate && formData.expireDate) {
      const startDate = new Date(formData.startDate);
      const expireDate = new Date(formData.expireDate);
      
      if (expireDate <= startDate) {
        newErrors.expireDate = 'Expiration date must be after start date';
      }
    }
    
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
      const submitFormData = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          submitFormData.append(key, value);
        }
      });
      
      // Append banner if provided
      if (banner) {
        submitFormData.append('banner', banner);
      }
      
      await onSubmit(submitFormData);
      router.push('/deals');
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p>Loading form data...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {errors.form && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.form}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Info Section */}
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
        </div>
        
        <div className="md:col-span-2">
          <Input
            id="title"
            name="title"
            label="Deal Title"
            value={formData.title}
            onChange={handleChange}
            required
            error={errors.title}
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>
        
        {/* Relationships */}
        <div className="md:col-span-2 mt-4">
          <h2 className="text-lg font-semibold mb-2">Relationships</h2>
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>
        
        <div>
          <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">
            Vendor <span className="text-red-500">*</span>
          </label>
          <select
            id="vendor"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a vendor</option>
            {vendors.map(vendor => (
              <option key={vendor._id} value={vendor._id}>
                {vendor.name}
              </option>
            ))}
          </select>
          {errors.vendor && <p className="mt-1 text-sm text-red-600">{errors.vendor}</p>}
        </div>
        
        {/* Dates */}
        <div className="md:col-span-2 mt-4">
          <h2 className="text-lg font-semibold mb-2">Deal Timeline</h2>
        </div>
        
        <Input
          id="startDate"
          name="startDate"
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
          error={errors.startDate}
        />
        
        <Input
          id="expireDate"
          name="expireDate"
          label="Expiration Date"
          type="date"
          value={formData.expireDate}
          onChange={handleChange}
          required
          error={errors.expireDate}
        />
        
        {/* Deal Status */}
        <div className="md:col-span-2 mt-4">
          <h2 className="text-lg font-semibold mb-2">Deal Status</h2>
        </div>
        
        <div>
          <div className="flex items-center">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active Deal
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            If unchecked, the deal won't be visible to users
          </p>
        </div>
        
        <div>
          <div className="flex items-center">
            <input
              id="isFeatured"
              name="isFeatured"
              type="checkbox"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
              Featured Deal
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Featured deals appear in highlighted sections
          </p>
        </div>
        
        {/* Banner Image */}
        <div className="md:col-span-2 mt-4">
          <h2 className="text-lg font-semibold mb-2">Banner Image</h2>
          <FileInput
            id="banner"
            label="Deal Banner"
            onChange={handleFileChange}
            accept="image/*"
            error={errors.banner}
          />
        </div>
        
        {/* Display current banner if editing */}
        {deal?.banner && !banner && (
          <div className="md:col-span-2 mb-4">
            <p className="text-sm text-gray-600 mb-2">Current banner:</p>
            <div className="w-full h-48 relative">
              <img 
                src={deal.banner}
                alt={deal.title}
                className="object-cover rounded border border-gray-300"
                style={{ maxHeight: "200px", width: "auto" }}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-8">
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
          {isSubmitting ? 'Saving...' : deal ? 'Update Deal' : 'Create Deal'}
        </Button>
      </div>
    </form>
  );
}