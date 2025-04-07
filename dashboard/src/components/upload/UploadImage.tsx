// src/components/upload/UploadImage.tsx
"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function UploadImage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("No file selected");

    setLoading(true);
    const { data, error } = await supabase.storage
      .from("cafes") // your bucket name
      .upload(`images/${file.name}`, file, {
        cacheControl: "3600",
        upsert: true,
      });

    setLoading(false);

    if (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } else {
      alert("Uploaded successfully!");
      console.log("Uploaded file:", data);
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <Button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}
