'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const cafeRes = await fetch(`/api/cafeteria?ownerId=${user.uid}`);
      const cafeData = await cafeRes.json();
      if (!cafeData.success) return;

      const res = await fetch(`/api/reviews?cafeteriaId=${cafeData.cafeteria._id}`);
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    };

    fetchReviews();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-white p-4 rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Cafeteria Reviews</h2>
      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map((r, idx) => (
        <div key={idx} className="border p-3 rounded bg-gray-50">
          <p><strong>User:</strong> {r.userId?.email}</p>
          <p><strong>Rating:</strong> ⭐ {r.rating}</p>
          <p><strong>Comment:</strong> {r.comment || 'No comment'}</p>
          {r.foodId && <p><strong>Food:</strong> {r.foodId.foodName}</p>}
        </div>
      ))}
    </div>
  );
};

export default ReviewsPage;
