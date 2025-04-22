'use client';

import { useState, useEffect } from 'react';
import { categoryService } from '@/services/categoryService';
import { vendorService } from '@/services/vendorService';
import Button from '../ui/Button';

export default function DealFilters({ onFilter }) {
  const [filters, setFilters] = useState({
    active: true,
    featured: undefined,
    category: '',
    vendor: '',
  });

  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [categoriesData, vendorsData] = await Promise.all([
          categoryService.getAllCategories(),
          vendorService.getAllVendors()
        ]);
        
        setCategories(categoriesData);
        setVendors(vendorsData);
      } catch (err) {
        console.error('Error loading filter data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFilterData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Handle select elements with empty value
    if (type === 'select-one' && value === '') {
      setFilters(prev => ({ ...prev, [name]: '' }));
      return;
    }
    
    // Handle radio buttons
    if (type === 'radio') {
      if (value === 'all') {
        setFilters(prev => ({ ...prev, [name]: undefined }));
      } else {
        setFilters(prev => ({ ...prev, [name]: value === 'true' }));
      }
      return;
    }
    
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const defaultFilters = {
      active: true,
      featured: undefined,
      category: '',
      vendor: '',
    };
    
    setFilters(defaultFilters);
    onFilter(defaultFilters);
  };

  if (loading) {
    return <div>Loading filters...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter Deals</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="active" 
                  value="true" 
                  checked={filters.active === true}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600" 
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
              
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="active" 
                  value="false" 
                  checked={filters.active === false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600" 
                />
                <span className="ml-2 text-sm text-gray-700">Inactive</span>
              </label>
              
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="active" 
                  value="all" 
                  checked={filters.active === undefined}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600" 
                />
                <span className="ml-2 text-sm text-gray-700">All</span>
              </label>
            </div>
          </div>
          
          {/* Featured filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="featured" 
                  value="true" 
                  checked={filters.featured === true}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600" 
                />
                <span className="ml-2 text-sm text-gray-700">Featured</span>
              </label>
              
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="featured" 
                  value="false" 
                  checked={filters.featured === false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600" 
                />
                <span className="ml-2 text-sm text-gray-700">Not Featured</span>
              </label>
              
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="featured" 
                  value="all" 
                  checked={filters.featured === undefined}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600" 
                />
                <span className="ml-2 text-sm text-gray-700">All</span>
              </label>
            </div>
          </div>
          
          {/* Category filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Vendor filter */}
          <div>
            <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">
              Vendor
            </label>
            <select
              id="vendor"
              name="vendor"
              value={filters.vendor}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="">All Vendors</option>
              {vendors.map(vendor => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="secondary"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button type="submit">
            Apply Filters
          </Button>
        </div>
      </form>
    </div>
  );
}