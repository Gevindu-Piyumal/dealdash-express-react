const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await fetch(`${API_URL}/categories/${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  },

  // Create new category
  createCategory: async (formData) => {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      body: formData, // Using FormData for file uploads
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create category');
    }
    return response.json();
  },

  // Update category
  updateCategory: async (id, formData) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      body: formData, // Using FormData for file uploads
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update category');
    }
    return response.json();
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete category');
    }
    return response.json();
  },

  // Get categories with deal counts
  getCategoriesWithDealCounts: async () => {
    const response = await fetch(`${API_URL}/categories/with-deal-counts`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  },
};