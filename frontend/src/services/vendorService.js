const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const vendorService = {
  // Get all vendors
  getAllVendors: async () => {
    const response = await fetch(`${API_URL}/vendors`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  },

  // Get vendor by ID
  getVendorById: async (id) => {
    const response = await fetch(`${API_URL}/vendors/${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  },

  // Create new vendor
  createVendor: async (formData) => {
    const response = await fetch(`${API_URL}/vendors`, {
      method: 'POST',
      body: formData, // Using FormData for file uploads
    });
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create vendor');
      } else {
        // Handle non-JSON error responses
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create vendor');
      }
    }
    return response.json();
  },

  // Update vendor
  updateVendor: async (id, formData) => {
    const response = await fetch(`${API_URL}/vendors/${id}`, {
      method: 'PUT',
      body: formData, // Using FormData for file uploads
    });
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update vendor');
      } else {
        // Handle non-JSON error responses
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update vendor');
      }
    }
    return response.json();
  },

  // Delete vendor
  deleteVendor: async (id) => {
    const response = await fetch(`${API_URL}/vendors/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete vendor');
    }
    return response.json();
  },

  // Get nearby vendors
  getNearbyVendors: async (longitude, latitude, distance = 5000) => {
    const response = await fetch(
      `${API_URL}/vendors/nearby?longitude=${longitude}&latitude=${latitude}&distance=${distance}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  },
};