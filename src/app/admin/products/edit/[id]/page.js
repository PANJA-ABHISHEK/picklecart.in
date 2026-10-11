"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, Check } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";
import { updateProduct } from "@/app/actions/products";
import { getProductBySlug } from "@/services/products";
import { getCategories } from "@/app/actions/taxonomy";
import { REGIONS, CATEGORIES } from "@/lib/constants";

export default function EditProductPage({ params }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [dbCategories, setDbCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "veg-pickles",
    regions: ["andhra-delights"],
    image: null,
    featured: false,
    bestSeller: false,
    ingredients: "",
    pricing: [{ weight: "250g", price: "", originalPrice: "", inStock: true }]
  });

  useEffect(() => {
    async function loadProduct() {
      try {
        const product = await getProductBySlug(unwrappedParams.id);
        if (product) {
          setFormData({
            name: product.name || "",
            description: product.description || "",
            categoryId: product.categoryId || "veg-pickles",
            regions: product.regions || (product.regionId ? [product.regionId] : ["andhra-delights"]),
            image: product.image || null,
            featured: product.featured || false,
            bestSeller: product.bestSeller || false,
            ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(", ") : (product.ingredients || ""),
            pricing: product.pricing?.length > 0 ? product.pricing : [{ weight: "250g", price: "", originalPrice: "", inStock: true }]
          });
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        setError("Failed to load product details.");
      }
      setIsLoading(false);
    }
    loadProduct();
    getCategories().then(res => {
      if (res.success) setDbCategories(res.categories);
    });
  }, [unwrappedParams.id]);

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      pricing: [...formData.pricing, { weight: "", price: "", originalPrice: "", inStock: true }]
    });
  };

  const handleRemoveVariant = (index) => {
    if (formData.pricing.length === 1) return;
    const newPricing = [...formData.pricing];
    newPricing.splice(index, 1);
    setFormData({ ...formData, pricing: newPricing });
  };

  const toggleRegion = (regionId) => {
    setFormData(prev => ({
      ...prev,
      regions: prev.regions.includes(regionId)
        ? prev.regions.filter(r => r !== regionId)
        : [...prev.regions, regionId],
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const newPricing = [...formData.pricing];
    newPricing[index][field] = value;
    setFormData({ ...formData, pricing: newPricing });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      setError("Please upload a product image.");
      return;
    }
    
    // Validate pricing
    const hasEmptyPricing = formData.pricing.some(p => !p.weight || !p.price);
    if (hasEmptyPricing) {
      setError("Please fill out all weight and price fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Clean data types
    const cleanedData = {
      ...formData,
      ingredients: formData.ingredients.split(",").map(i => i.trim()).filter(Boolean),
      pricing: formData.pricing.map(p => ({
        ...p,
        price: Number(p.price),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      }))
    };

    const result = await updateProduct(unwrappedParams.id, cleanedData);

    if (result.success) {
      router.push("/admin/products");
    } else {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-pickle-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-surface rounded-full border border-border hover:bg-surface-alt transition-colors">
            <ArrowLeft size={20} className="text-earthy-brown" />
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-earthy-brown-dark tracking-tight mb-1">Edit Product</h1>
            <p className="text-earthy-brown-light text-sm font-medium">Update details for {formData.name}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Basic Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-charcoal mb-4">Basic Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Gongura Pickle"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-pickle-red focus:ring-2 focus:ring-pickle-red/20 outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Category *</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-pickle-red focus:ring-2 focus:ring-pickle-red/20 outline-none bg-white"
                    >
                      {(() => {
                        const existingIds = new Set(CATEGORIES.map(c => c.id));
                        const extraCats = dbCategories.filter(c => !existingIds.has(c.id));
                        const allCats = [...CATEGORIES, ...extraCats];
                        return allCats.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ));
                      })()}
                    </select>
                  </div>
                  <div className="col-span-1 sm:col-span-2 mt-2">
                    <label className="block text-sm font-medium text-charcoal mb-2">Publish to Regions *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {REGIONS.map((region) => {
                        const isSelected = formData.regions?.includes(region.id);
                        return (
                          <button
                            key={region.id}
                            type="button"
                            onClick={() => toggleRegion(region.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all ${
                              isSelected
                                ? "border-heritage-green bg-heritage-green/5 text-heritage-green"
                                : "border-gray-200 bg-white text-charcoal/70 hover:border-gray-300"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                isSelected
                                  ? "border-heritage-green bg-heritage-green"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && <Check size={12} className="text-white" />}
                            </div>
                            {region.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter product description..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-pickle-red focus:ring-2 focus:ring-pickle-red/20 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Ingredients (comma separated)</label>
                  <input
                    type="text"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                    placeholder="e.g. Gongura leaves, Garlic, Red chilli, Oil"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-pickle-red focus:ring-2 focus:ring-pickle-red/20 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Pricing / Variants */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-charcoal">Pricing & Weights</h2>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="text-sm flex items-center gap-1 text-pickle-red font-medium hover:bg-pickle-red/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus size={16} /> Add Variant
                </button>
              </div>

              <div className="space-y-4">
                {formData.pricing.map((variant, index) => (
                  <div key={index} className="flex items-end gap-4 p-4 border border-gray-100 bg-gray-50 rounded-xl relative group">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-charcoal mb-1">Weight / Volume (e.g. 250g, 1L)</label>
                      <input
                        type="text"
                        required
                        value={variant.weight}
                        onChange={(e) => handleVariantChange(index, "weight", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-charcoal mb-1">Sale Price (₹)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-charcoal mb-1">MRP (Optional)</label>
                      <input
                        type="number"
                        min="0"
                        value={variant.originalPrice || ""}
                        onChange={(e) => handleVariantChange(index, "originalPrice", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none text-sm"
                      />
                    </div>
                    
                    {formData.pricing.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Image & Status */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-charcoal mb-4">Product Image *</h2>
              <ImageUploader 
                defaultImage={formData.image}
                onImageUpload={(url) => setFormData({...formData, image: url})} 
              />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-charcoal mb-4">Product Status</h2>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-300 text-pickle-red focus:ring-pickle-red"
                  />
                  <span className="text-charcoal font-medium">Featured Product</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bestSeller}
                    onChange={(e) => setFormData({...formData, bestSeller: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-300 text-pickle-red focus:ring-pickle-red"
                  />
                  <span className="text-charcoal font-medium">Best Seller Tag</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-earthy-brown text-[#FFFFFF] py-4 rounded-xl font-bold hover:bg-earthy-brown-dark transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-earthy-brown/20"
            >
              {isSubmitting ? (
               <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={20} />
                  Update Product
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
