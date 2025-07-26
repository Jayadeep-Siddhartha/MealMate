"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const CafeDetailsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [isSetupMode, setIsSetupMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editImageMode, setEditImageMode] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [cafeteria, setCafeteria] = useState<any>(null);
  const [form, setForm] = useState({
    cafeteriaName: "",
    availableSeats: "",
    latitude: "",
    longitude: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [seatUpdateLoading, setSeatUpdateLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const setup = searchParams.get("setup");
    if (setup === "true") setIsSetupMode(true);

    const fetchCafeteria = async () => {
      if (authLoading) return;
      if (!user) {
        router.push("/auth/login");
        return;
      }

      setError("");
      try {
        const res = await fetch(`/api/cafeteria?ownerId=${user.uid}`);
        const data = await res.json();
        if (data.success && data.cafeteria) {
          setCafeteria(data.cafeteria);
          setForm({
            cafeteriaName: data.cafeteria.cafeteriaName || "",
            availableSeats: data.cafeteria.availableSeats?.toString() || "",
            latitude: data.cafeteria.location?.latitude?.toString() || "",
            longitude: data.cafeteria.location?.longitude?.toString() || "",
          });
        } else if (!data.cafeteria && !setup) {
          router.replace("/dashboard?setup=true");
        }
      } catch (err: any) {
        setError("Failed to fetch cafeteria details: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCafeteria();
  }, [searchParams, router, user, authLoading]);

  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageFile) return null;
    setError("");

    const fileName = `cafes/${Date.now()}-${imageFile.name}`;

    try {
      const { data, error } = await supabase.storage
        .from("food-images")
        .upload(fileName, imageFile);

      if (error) throw error;

      const publicUrl = supabase.storage
        .from("food-images")
        .getPublicUrl(fileName).data.publicUrl;

      return publicUrl;
    } catch (error: any) {
      console.error("Image upload failed:", error.message);
      setError("Image upload failed: " + error.message);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!user) {
      setLoading(false);
      setError("User not authenticated.");
      return;
    }

    let imageUrl = cafeteria?.cafeteriaImage;
    if (imageFile) {
      imageUrl = await handleImageUpload();
      if (!imageUrl) {
        setLoading(false);
        return;
      }
    }

    console.log("Submitting data:", {
      ownerId: user.uid,
      cafeteriaName: form.cafeteriaName,
      location: {
        latitude: parseFloat(form.latitude) || 0,
        longitude: parseFloat(form.longitude) || 0,
      },
      availableSeats: parseInt(form.availableSeats) || 0,
      cafeteriaImage: imageUrl,
    });

    try {
      const res = await fetch("/api/cafeteria", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerId: user.uid,
          cafeteriaName: form.cafeteriaName,
          location: {
            latitude: parseFloat(form.latitude) || 0,
            longitude: parseFloat(form.longitude) || 0,
          },
          availableSeats: parseInt(form.availableSeats) || 0,
          cafeteriaImage: imageUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCafeteria(data.cafeteria);
        setIsSetupMode(false);
        setEditImageMode(false);
        setImageFile(null);
        router.push("/dashboard");
      } else {
        setError(data.message || "Failed to save cafeteria details.");
      }
    } catch (err: any) {
      setError("Failed to save cafeteria details: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatUpdate = async () => {
    setError("");
    setSeatUpdateLoading(true);

    if (!user || !cafeteria) {
      setSeatUpdateLoading(false);
      setError("User not authenticated or cafeteria not loaded.");
      return;
    }

    try {
      const res = await fetch("/api/cafeteria", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerId: user.uid,
          availableSeats: parseInt(form.availableSeats) || 0,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCafeteria(data.cafeteria);
        setIsEditMode(false);
      } else {
        setError(data.message || "Failed to update seats.");
      }
    } catch (err: any) {
      setError("Failed to update seats: " + err.message);
    } finally {
      setSeatUpdateLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-500">
        Loading cafeteria details...
      </div>
    );
  }

  // --- Setup Mode ---
  if (isSetupMode || !cafeteria) {
    return (
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Setup Your Cafeteria</h2>

        {error && <p className="text-red-600">{error}</p>}

        {["cafeteriaName", "availableSeats", "latitude", "longitude"].map(
          (field) => (
            <div key={field}>
              <label className="block mb-1 capitalize">{field}</label>
              <input
                type={field === "availableSeats" ? "number" : "text"}
                value={form[field as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full border px-4 py-2 rounded"
                required
                disabled={loading}
              />
            </div>
          )
        )}

        <div>
          <label className="block mb-1">Cafeteria Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    );
  }

  // --- Final View Mode ---
  return (
    <div className="p-4 max-w-4xl mx-auto bg-white border border-gray-200 space-y-4 text-sm text-gray-800">
      <div className="border-l-4 border-amber-600 pl-4 bg-amber-50">
        <h2 className="text-lg font-semibold text-gray-900 py-2">
          Welcome to Your Cafeteria
        </h2>
      </div>

      {error && (
        <div className="border-l-2 border-red-500 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {cafeteria.cafeteriaImage && !editImageMode && (
        <div className="flex flex-col items-center gap-2 py-2">
          <Image
            src={cafeteria.cafeteriaImage}
            alt="Cafeteria"
            width={400}
            height={250}
            className="border-2 border-amber-200 shadow-sm rounded-sm"
          />
          <button
            onClick={() => setEditImageMode(true)}
            className="text-amber-700 text-xs underline"
          >
            Change Image
          </button>
        </div>
      )}

      {editImageMode && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Upload New Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-600 text-white px-4 py-2 text-sm rounded"
            >
              {loading ? "Uploading..." : "Save Image"}
            </button>
            <button
              type="button"
              onClick={() => setEditImageMode(false)}
              className="text-gray-500 text-sm underline"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-amber-50 border-l-4 border-amber-600 p-3">
          <span className="font-medium text-amber-800 text-sm">
            Cafeteria Name
          </span>
          <p className="text-gray-900 font-medium text-sm mt-1">
            {cafeteria.cafeteriaName}
          </p>
        </div>

        <div
          className={`border-l-4 p-3 ${
            cafeteria.openStatus
              ? "border-green-600 bg-green-50"
              : "border-red-600 bg-red-50"
          }`}
        >
          <span
            className={`font-medium text-sm ${
              cafeteria.openStatus ? "text-green-800" : "text-red-800"
            }`}
          >
            Status
          </span>
          <p
            className={`font-medium text-sm mt-1 ${
              cafeteria.openStatus ? "text-green-700" : "text-red-700"
            }`}
          >
            {cafeteria.openStatus ? "Open" : "Closed"}
          </p>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-600 p-3">
          <span className="font-medium text-amber-800 text-sm">
            Available Seats
          </span>
          {isEditMode ? (
            <div className="mt-2 space-y-2">
              <input
                type="number"
                value={form.availableSeats}
                onChange={(e) =>
                  setForm({ ...form, availableSeats: e.target.value })
                }
                className="w-16 border px-2 py-1 text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSeatUpdate}
                  disabled={seatUpdateLoading}
                  className="bg-amber-600 text-white px-2 py-1 text-xs"
                >
                  {seatUpdateLoading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setIsEditMode(false)}
                  className="text-xs text-gray-600 underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-900 font-medium text-sm">
                {cafeteria.availableSeats}
              </span>
              <button
                onClick={() => setIsEditMode(true)}
                className="text-amber-700 hover:underline text-xs"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <div className="border-l-4 border-gray-400 bg-gray-50 p-3">
          <span className="font-medium text-gray-700 text-sm">Location</span>
          <p className="text-gray-800 font-mono text-xs mt-1">
            {cafeteria.location.latitude}, {cafeteria.location.longitude}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CafeDetailsPage;
