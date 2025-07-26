"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { supabase } from "@/lib/supabaseClient";
import { Pencil, Trash2 } from "lucide-react";
import FoodModal from "@/components/FoodModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import toast from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

const FoodsPage = () => {
  const [foods, setFoods] = useState<any[]>([]);
  const [cafeteriaId, setCafeteriaId] = useState<string>("");
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editMode, setEditMode] = useState<"add" | "edit">("add");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ new
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const cafeRes = await fetch(`/api/cafeteria?ownerId=${user.uid}`);
        const cafeData = await cafeRes.json();
        if (cafeData.success) {
          setCafeteriaId(cafeData.cafeteria._id);
          const foodRes = await fetch(
            `/api/foods?cafeteriaId=${cafeData.cafeteria._id}`
          );
          const foodData = await foodRes.json();
          if (foodData.success) {
            setFoods(foodData.foods);
          }
        }
      } catch (err) {
        toast.error("Error fetching foods.");
      } finally {
        setLoading(false); // ✅ stop loading
      }
    });

    return () => unsubscribe();
  }, []);

  // Image upload & handlers remain unchanged...
  const handleUploadImage = async (
    imageFile: File | null
  ): Promise<string | null> => {
    if (!imageFile) return null;
    const fileName = `foods/${Date.now()}-${imageFile.name}`;
    const { error } = await supabase.storage
      .from("food-images")
      .upload(fileName, imageFile);
    if (error) {
      console.error("Image upload error:", error.message);
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

    if (editMode === "add") {
      const res = await fetch("/api/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Food item added successfully!");
        setShowAddEditModal(false); // ✅ close modal
        router.refresh(); // ✅ refresh page
      } else {
        toast.error("Failed to add food item.");
      }
    } else if (selectedFood) {
      const res = await fetch(`/api/foods/${selectedFood._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Food item updated successfully!");
        setShowAddEditModal(false); // ✅ close modal
        router.refresh(); // ✅ refresh page
      } else {
        toast.error("Failed to update food item.");
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedFood) return;
    const res = await fetch(`/api/foods/${selectedFood._id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      setFoods((prev) => prev.filter((f) => f._id !== selectedFood._id));
      toast.success("Food item deleted successfully!");
    } else {
      toast.error("Failed to delete food item: " + data.message);
    }
    setShowDeleteModal(false);
  };

  return (
    <div className="px-6 py-6 bg-white min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Menu Management</h2>
        <button
          onClick={() => {
            setEditMode("add");
            setSelectedFood(null);
            setShowAddEditModal(true);
          }}
          className="bg-amber-600 text-white px-4 py-1.5 text-sm hover:bg-amber-700 transition"
        >
          + Add New Item
        </button>
      </div>

      {/* ✅ Loading State */}
      {loading ? (
        <div className="text-sm text-gray-500">Fetching food items...</div>
      ) : foods.length === 0 ? (
        <p className="text-sm text-gray-500">No food items found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {foods.map((food) => (
            <div
              key={food._id}
              className="border border-gray-200 shadow-sm hover:shadow-md transition bg-white"
            >
              <div className="w-full h-40 bg-gray-50 overflow-hidden">
                {food.foodImage ? (
                  <img
                    src={food.foodImage}
                    alt={food.foodName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-3 text-sm space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-900 font-medium">
                      {food.foodName}
                    </h3>
                    <p className="text-gray-700">₹{food.price.toFixed(2)}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800">
                    {food.availability} left
                  </span>
                </div>
                <p className="text-xs text-gray-500">{food.category}</p>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedFood(food);
                      setEditMode("edit");
                      setShowAddEditModal(true);
                    }}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFood(food);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <FoodModal
        isOpen={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        onSubmit={handleAddOrEdit}
        mode={editMode}
        defaultValues={editMode === "edit" ? selectedFood : undefined}
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
