"use client";

import { useState, useRef } from "react";
import { getCloudinarySignature } from "@/app/actions/cloudinary";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function ImageUploader({ onImageUpload, defaultImage = null }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(defaultImage);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      // 1. Get secure signature from our server action
      const { timestamp, signature } = await getCloudinarySignature();

      // 2. Prepare formData for Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "437694558264695");
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", "picklecart_products");

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "epv5nqqv";
      
      // 3. Upload directly from browser to Cloudinary
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        setPreview(data.secure_url);
        onImageUpload(data.secure_url);
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageUpload(null);
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square max-w-xs mx-auto md:mx-0 group">
          <Image 
            src={preview} 
            alt="Product Preview" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={clearImage}
              className="bg-white text-red-600 p-2 rounded-full hover:scale-110 transition-transform shadow-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-pickle-red/50 transition-colors aspect-square max-w-xs mx-auto md:mx-0 flex flex-col items-center justify-center cursor-pointer p-6 text-center"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-pickle-red animate-spin mb-3" />
              <p className="text-sm font-medium text-charcoal">Uploading to Cloudinary...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-charcoal/40">
                <UploadCloud size={24} />
              </div>
              <p className="text-sm font-medium text-charcoal mb-1">Click to upload image</p>
              <p className="text-xs text-charcoal/50">PNG, JPG, WebP up to 5MB</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-2 font-medium flex items-center gap-1">
          <X size={16} /> {error}
        </p>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />
    </div>
  );
}
