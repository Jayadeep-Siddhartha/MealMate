'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    };

    fetchReviews();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4">
      <div className="border border-gray-200 bg-white px-5 py-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cafeteria Reviews</h2>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r, idx) => (
              <div
                key={idx}
                className="border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-700 font-medium">{r.userId?.email || 'Unknown User'}</span>
                  <span className="text-amber-700 font-semibold">⭐ {r.rating}</span>
                </div>
                {r.foodId && (
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-800">Food:</span> {r.foodId.foodName}
                  </p>
                )}
                <p className="text-gray-600 mt-1">
                  <span className="font-medium text-gray-800">Comment:</span>{' '}
                  {r.comment || <span className="italic text-gray-400">No comment</span>}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
