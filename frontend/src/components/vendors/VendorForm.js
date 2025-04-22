'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import FileInput from '../ui/FileInput';
import Button from '../ui/Button';

export default function VendorForm({ vendor = null, onSubmit }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: vendor?.name || '',
    address: vendor?.address || '',
    openingHours: vendor?.openingHours || '',
    contactNumber: vendor?.contactNumber || '',
    email: vendor?.email || '',
    website: vendor?.website || '',
    facebook: vendor?.socialMedia?.facebook || '',
    instagram: vendor?.socialMedia?.instagram || '',
    whatsapp: vendor?.socialMedia?.whatsapp || '',
    longitude: vendor?.location?.coordinates?.[0] || '',
    latitude: vendor?.location?.coordinates?.[1] || '',
  });
  
  const [logo, setLogo] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    // Validate coordinates if either is provided
    if (formData.longitude && !formData.latitude) {
      newErrors.latitude = 'Latitude is required when longitude is provided';
    }
    if (formData.latitude && !formData.longitude) {
      newErrors.longitude = 'Longitude is required when latitude is provided';
    }
    
    // Validate longitude and latitude formats if provided
    if (formData.longitude && isNaN(parseFloat(formData.longitude))) {
      newErrors.longitude = 'Longitude must be a valid number';
    }
    if (formData.latitude && isNaN(parseFloat(formData.latitude))) {
      newErrors.latitude = 'Latitude must be a valid number';
    }
    
    // Validate email format if provided
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    return newErrors;
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
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
        if (value) submitFormData.append(key, value);
      });
      
      // Append logo if provided
      if (logo) submitFormData.append('logo', logo);
      
      await onSubmit(submitFormData);
      router.push('/vendors');
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            id="name"
            name="name"
            label="Vendor Name"
            value={formData.name}
            onChange={handleChange}
            required
            error={errors.name}
          />
        </div>
        
        <div className="md:col-span-2">
          <Input
            id="address"
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
          />
        </div>
        
        <Input
          id="contactNumber"
          name="contactNumber"
          label="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
          error={errors.contactNumber}
        />
        
        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        
        <div className="md:col-span-2">
          <Input
            id="website"
            name="website"
            label="Website"
            value={formData.website}
            onChange={handleChange}
            error={errors.website}
          />
        </div>
        
        <div className="md:col-span-2">
          <Input
            id="openingHours"
            name="openingHours"
            label="Opening Hours"
            value={formData.openingHours}
            onChange={handleChange}
            error={errors.openingHours}
            placeholder="e.g., Mon-Fri: 9am-5pm"
          />
        </div>
        
        {/* Location Section */}
        <div className="md:col-span-2 mt-4">
          <h2 className="text-lg font-semibold mb-2">Location</h2>
        </div>
        
        <Input
          id="longitude"
          name="longitude"
          label="Longitude"
          value={formData.longitude}
          onChange={handleChange}
          error={errors.longitude}
        />
        
        <Input
          id="latitude"
          name="latitude"
          label="Latitude"
          value={formData.latitude}
          onChange={handleChange}
          error={errors.latitude}
        />
        
        {/* Social Media Section */}
        <div className="md:col-span-2 mt-4">
          <h2 className="text-lg font-semibold mb-2">Social Media</h2>
        </div>
        
        <Input
          id="facebook"
          name="facebook"
          label="Facebook"
          value={formData.facebook}
          onChange={handleChange}
          error={errors.facebook}
        />
        
        <Input
          id="instagram"
          name="instagram"
          label="Instagram"
          value={formData.instagram}
          onChange={handleChange}
          error={errors.instagram}
        />
        
        <Input
          id="whatsapp"
          name="whatsapp"
          label="WhatsApp"
          value={formData.whatsapp}
          onChange={handleChange}
          error={errors.whatsapp}
        />
        
        {/* Logo Section */}
        <div className="md:col-span-2 mt-4">
          <h2 className="text-lg font-semibold mb-2">Logo</h2>
          <FileInput
            id="logo"
            label="Vendor Logo"
            onChange={handleFileChange}
            accept="image/*"
            error={errors.logo}
          />
        </div>
        
        {/* Display current logo if editing */}
        {vendor?.logo && !logo && (
          <div className="md:col-span-2 mb-4">
            <p className="text-sm text-gray-600 mb-2">Current logo:</p>
            <div className="w-32 h-32 relative">
              <img 
                src={vendor.logo}
                alt={vendor.name}
                className="object-cover rounded border border-gray-300"
                width={128}
                height={128}
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
          {isSubmitting ? 'Saving...' : vendor ? 'Update Vendor' : 'Create Vendor'}
        </Button>
      </div>
    </form>
  );
}