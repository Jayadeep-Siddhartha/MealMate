// src/components/FoodModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';

interface FoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, imageFile: File | null) => void;
  defaultValues?: {
    foodName: string;
    price: string;
    category: string;
    availability: string;
    foodImage?: string;
  };
  mode: 'add' | 'edit';
}

const FoodModal: React.FC<FoodModalProps> = ({ isOpen, onClose, onSubmit, defaultValues, mode }) => {
  const [form, setForm] = useState({ 
    foodName: '', 
    price: '', 
    category: '', 
    availability: '' 
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (defaultValues) {
      setForm({
        foodName: defaultValues.foodName || '',
        price: defaultValues.price || '',
        category: defaultValues.category || '',
        availability: defaultValues.availability || ''
      });
      if (defaultValues.foodImage) {
        setImagePreview(defaultValues.foodImage);
      }
    } else {
      setForm({ foodName: '', price: '', category: '', availability: '' });
      setImagePreview(null);
    }
  }, [defaultValues, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form, imageFile);
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      as="div" 
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" aria-hidden="true" />
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Panel className="relative bg-white rounded-lg shadow-xl max-w-md w-full border border-amber-200 overflow-hidden">
          <div className="p-6 space-y-4">
            <Dialog.Title className="text-xl font-bold text-amber-800">
              {mode === 'add' ? 'Add New Menu Item' : 'Edit Menu Item'}
            </Dialog.Title>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {imagePreview && (
                <div className="flex justify-center">
                  <img 
                    src={imagePreview} 
                    alt="Food preview" 
                    className="h-40 w-40 object-cover rounded-lg border border-amber-200"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">
                  Food Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="foodName"
                  placeholder="e.g. Cappuccino"
                  value={form.foodName}
                  onChange={handleChange}
                  required
                  className="w-full border border-amber-300 text-gray-800 p-2 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0.00"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full border border-amber-300 text-gray-800 p-2 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  name="category"
                  placeholder="e.g. Coffee, Bakery"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full border border-amber-300 text-gray-800 p-2 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">
                  Available Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  name="availability"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.availability}
                  onChange={handleChange}
                  required
                  className="w-full border border-amber-300 text-gray-800 p-2 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">
                  Food Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-amber-600
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-amber-100 file:text-amber-800
                    hover:file:bg-amber-200"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                >
                  {mode === 'add' ? 'Add Item' : 'Update Item'}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default FoodModal;