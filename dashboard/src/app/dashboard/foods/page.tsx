// src/app/dashboard/foods/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabaseClient';
import { Pencil, Trash2 } from 'lucide-react';
import FoodModal from '@/components/FoodModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

import { onAuthStateChanged } from 'firebase/auth';
const FoodsPage = () => {
  const [foods, setFoods] = useState<any[]>([]);
  const [cafeteriaId, setCafeteriaId] = useState<string>('');
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editMode, setEditMode] = useState<'add' | 'edit'>('add');
  const [showDeleteModal, setShowDeleteModal] = useState(false);


useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const cafeRes = await fetch(`/api/cafeteria?ownerId=${user.uid}`);
    const cafeData = await cafeRes.json();
    console.log(cafeData);
    if (cafeData.success) {
      setCafeteriaId(cafeData.cafeteria._id);
      const foodRes = await fetch(`/api/foods?cafeteriaId=${cafeData.cafeteria._id}`);
      console.log(foodRes);
      const foodData = await foodRes.json();
      console.log(foodData);
      if (foodData.success) setFoods(foodData.foods);
    }
  });

  return () => unsubscribe(); // cleanup on unmount
}, []);

  const handleUploadImage = async (imageFile: File | null): Promise<string | null> => {
    if (!imageFile) return null;
    const fileName = `foods/${Date.now()}-${imageFile.name}`;
    const { error } = await supabase.storage.from('food-images').upload(fileName, imageFile);
    if (error) {
      console.error('Image upload error:', error.message);
      return null;
    }
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/food-images/${fileName}`;
  };

  const handleAddOrEdit = async (form: any, imageFile: File | null) => {
    const foodImage = await handleUploadImage(imageFile);
    const payload = {
      ...form,
      price: Number(form.price),
      availability: Number(form.availability),
      foodImage,
      cafeteriaId,
    };

    if (editMode === 'add') {
      const res = await fetch('/api/foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) setFoods((prev) => [...prev, data.food]);
    } else if (selectedFood) {
      const res = await fetch(`/api/foods/${selectedFood._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setFoods((prev) => prev.map((f) => (f._id === selectedFood._id ? data.food : f)));
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedFood) return;
    const res = await fetch(`/api/foods/${selectedFood._id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) setFoods((prev) => prev.filter((f) => f._id !== selectedFood._id));
    setShowDeleteModal(false);
  };

  return (
    <div className="space-y-6 p-4 bg-amber-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-amber-800">Menu Management</h2>
        <button
          onClick={() => {
            setEditMode('add');
            setSelectedFood(null);
            setShowAddEditModal(true);
          }}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors shadow-md"
        >
          + Add New Item
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {foods.map((food) => (
          <div key={food._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-100 hover:shadow-lg transition-shadow">
            {food.foodImage ? (
              <img 
                src={food.foodImage} 
                alt={food.foodName} 
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-amber-50 flex items-center justify-center text-amber-400">
                <span>No Image Available</span>
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-amber-900">{food.foodName}</h3>
                  <p className="text-amber-700 font-medium">₹{food.price.toFixed(2)}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                  {food.availability} left
                </span>
              </div>
              <p className="text-sm text-amber-600 mt-1">{food.category}</p>
              
              <div className="flex justify-end space-x-2 mt-3">
                <button 
                  onClick={() => {
                    setSelectedFood(food);
                    setEditMode('edit');
                    setShowAddEditModal(true);
                  }}
                  className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-full transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  onClick={() => {
                    setSelectedFood(food);
                    setShowDeleteModal(true);
                  }}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FoodModal
        isOpen={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        onSubmit={handleAddOrEdit}
        mode={editMode}
        defaultValues={editMode === 'edit' ? selectedFood : undefined}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default FoodsPage;