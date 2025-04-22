const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const dealService = {
  // Get all deals with optional filters
  getAllDeals: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters if provided
    if (filters.active !== undefined) queryParams.append('active', filters.active);
    if (filters.featured !== undefined) queryParams.append('featured', filters.featured);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.vendor) queryParams.append('vendor', filters.vendor);
    
    const queryString = queryParams.toString();
    const url = `${API_URL}/deals${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  },

  // Get deal by ID
  getDealById: async (id) => {
    const response = await fetch(`${API_URL}/deals/${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  },

  // Create new deal
  createDeal: async (formData) => {
    const response = await fetch(`${API_URL}/deals`, {
      method: 'POST',
      body: formData, // Using FormData for file uploads
    });
    
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create deal');
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create deal');
      }
    }
    return response.json();
  },

  // Update deal
  updateDeal: async (id, formData) => {
    const response = await fetch(`${API_URL}/deals/${id}`, {
      method: 'PUT',
      body: formData, // Using FormData for file uploads
    });
    
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update deal');
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update deal');
      }
    }
    return response.json();
  },

  // Delete deal
  deleteDeal: async (id) => {
    const response = await fetch(`${API_URL}/deals/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete deal');
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete deal');
      }
    }
    return response.json();
  },

  // Get featured deals
  getFeaturedDeals: async () => {
    const response = await fetch(`${API_URL}/deals/featured`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  },

  // Get deals by category
  getDealsByCategory: async (categoryId) => {
    const response = await fetch(`${API_URL}/deals/category/${categoryId}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  },
};