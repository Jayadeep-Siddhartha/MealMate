'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabaseClient';

const CafeDetailsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [cafeteria, setCafeteria] = useState<any>(null);
  const [form, setForm] = useState({
    cafeteriaName: '',
    availableSeats: '',
    latitude: '',
    longitude: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const setup = searchParams.get('setup');
    if (setup === 'true') setIsSetupMode(true);

    const fetchCafeteria = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const res = await fetch(`/api/cafeteria?ownerId=${user.uid}`);
      const data = await res.json();
      if (data.success) {
        setCafeteria(data.cafeteria);
        setForm({
          cafeteriaName: data.cafeteria.cafeteriaName || '',
          availableSeats: data.cafeteria.availableSeats.toString(),
          latitude: data.cafeteria.location.latitude?.toString() || '',
          longitude: data.cafeteria.location.longitude?.toString() || '',
        });
      }
    };

    fetchCafeteria();
  }, [searchParams]);

  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageFile) return null;
    const fileName = `cafes/${Date.now()}-${imageFile.name}`;
    const { error } = await supabase.storage.from('food-images').upload(fileName, imageFile);
    if (error) {
      console.error('Image upload failed:', error.message);
      return null;
    }
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/food-images/${fileName}`;
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const imageUrl = await handleImageUpload();

    const res = await fetch('/api/cafeteria', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ownerId: user.uid,
        cafeteriaName: form.cafeteriaName,
        location: {
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
        },
        availableSeats: parseInt(form.availableSeats),
        cafeImage: imageUrl,
      }),
    });

    const data = await res.json();
    if (data.success) {
      router.push('/dashboard/foods');
    }
  };

  const handleSeatUpdate = async () => {
    const user = auth.currentUser;
    if (!user || !cafeteria) return;

    const res = await fetch('/api/cafeteria', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ownerId: user.uid,
        availableSeats: parseInt(form.availableSeats),
      }),
    });

    const data = await res.json();
    if (data.success) {
      setCafeteria(data.cafeteria);
      setIsEditMode(false);
    }
  };

  if (isSetupMode || !cafeteria) {
    return (
      <div className="max-w-xl mx-auto mt-6 bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-lg font-bold">Setup Your Cafeteria</h2>
        <input
          type="text"
          placeholder="Cafeteria Name"
          value={form.cafeteriaName}
          onChange={(e) => setForm({ ...form, cafeteriaName: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Available Seats"
          value={form.availableSeats}
          onChange={(e) => setForm({ ...form, availableSeats: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Latitude"
          value={form.latitude}
          onChange={(e) => setForm({ ...form, latitude: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Longitude"
          value={form.longitude}
          onChange={(e) => setForm({ ...form, longitude: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save & Continue
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto mt-4 space-y-4">
      <h2 className="text-xl font-bold">Cafeteria Details</h2>
      <p><strong>Name:</strong> {cafeteria.cafeteriaName}</p>
      <p><strong>Status:</strong> {cafeteria.openStatus ? 'Open' : 'Closed'}</p>
      <p><strong>Location:</strong> ({cafeteria.location.latitude}, {cafeteria.location.longitude})</p>
      {cafeteria.cafeImage && (
        <img src={cafeteria.cafeImage} alt="Cafe" className="w-full max-w-md h-auto rounded shadow" />
      )}

      <div className="flex items-center gap-2">
        <strong>Seats:</strong>
        {isEditMode ? (
          <>
            <input
              type="number"
              value={form.availableSeats}
              onChange={(e) => setForm({ ...form, availableSeats: e.target.value })}
              className="border px-2 py-1 rounded w-20"
            />
            <button
              onClick={handleSeatUpdate}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <span>{cafeteria.availableSeats}</span>
            <button
              onClick={() => setIsEditMode(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CafeDetailsPage;
