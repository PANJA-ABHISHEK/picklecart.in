"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, FolderTree, MapPin, Check } from "lucide-react";
import {
  getCategories, createCategory, updateCategory, deleteCategory,
  getRegions, createRegion, deleteRegion,
} from "@/app/actions/taxonomy";
import { REGIONS as CONST_REGIONS, CATEGORIES as BUILT_IN_CATEGORIES } from "@/lib/constants";

// Available regions for multi-select checkboxes
const AVAILABLE_REGIONS = CONST_REGIONS.map(r => ({ id: r.id, name: r.name }));

// Built-in category IDs that cannot be deleted
const BUILT_IN_IDS = new Set(BUILT_IN_CATEGORIES.map(c => c.id));

export default function CategoriesRegionsPage() {
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null = new, object = editing
  const [formData, setFormData] = useState({ name: "", description: "", regions: [] });
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [catsRes, regsRes] = await Promise.all([getCategories(), getRegions()]);
    if (catsRes.success) setCategories(catsRes.categories);
    if (regsRes.success) setRegions(regsRes.regions);
    setLoading(false);
  };

  // ── Category Modal ──
  const openNewModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", regions: [] });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || "",
      regions: cat.regions || [],
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const toggleRegion = (regionId) => {
    setFormData(prev => ({
      ...prev,
      regions: prev.regions.includes(regionId)
        ? prev.regions.filter(r => r !== regionId)
        : [...prev.regions, regionId],
    }));
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Category name is required.");
      return;
    }
    if (formData.regions.length === 0) {
      setFormError("Please select at least one region.");
      return;
    }

    setIsSaving(true);
    setFormError("");

    let res;
    if (editingCategory) {
      res = await updateCategory(editingCategory.id, formData);
    } else {
      res = await createCategory(formData);
    }

    if (res.success) {
      setIsModalOpen(false);
      fetchData();
    } else {
      setFormError(res.error || "Something went wrong.");
    }
    setIsSaving(false);
  };

  const handleDeleteCategory = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteCategory(deleteTarget.id);
    setDeleteTarget(null);
    setIsDeleting(false);
    fetchData();
  };

  // ── Region helpers ──
  const getRegionName = (id) => {
    const found = AVAILABLE_REGIONS.find(r => r.id === id);
    return found ? found.name : id;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pickle-red/30 border-t-pickle-red rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-earthy-brown-dark tracking-tight mb-1">Categories</h1>
          <p className="text-earthy-brown-light font-medium text-sm">
            Create and manage product categories across regions
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="bg-earthy-brown text-[#FFFFFF] w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium hover:bg-earthy-brown-dark transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
        >
          <Plus size={18} className="text-[#FFFFFF]" />
          Add Category
        </button>
      </div>

      {/* Category Cards */}
      {(() => {
        // Merge: built-in categories + any extra from Firestore
        const extraCats = categories.filter(c => !BUILT_IN_IDS.has(c.id));
        const allCats = [
          ...BUILT_IN_CATEGORIES.map(c => {
            // If it exists in Firestore, merge the Firestore data (regions, etc)
            const fromDb = categories.find(db => db.id === c.id);
            return fromDb ? { ...c, ...fromDb, builtIn: true } : { ...c, builtIn: true };
          }),
          ...extraCats.map(c => ({ ...c, builtIn: false })),
        ];

        return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allCats.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow group"
            >
              {/* Top */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.builtIn ? 'bg-blue-50' : 'bg-heritage-green/10'}`}>
                    <FolderTree size={18} className={cat.builtIn ? 'text-blue-600' : 'text-heritage-green'} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-charcoal text-sm">{cat.name}</p>
                      {cat.builtIn && (
                        <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase">Built-in</span>
                      )}
                    </div>
                    {cat.description && (
                      <p className="text-xs text-charcoal/50 mt-0.5 line-clamp-1">{cat.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!cat.builtIn && (
                    <>
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Region Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-50">
                {(cat.regions && cat.regions.length > 0) ? (
                  cat.regions.map((rid) => (
                    <span
                      key={rid}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-heritage-green/10 text-heritage-green"
                    >
                      <MapPin size={10} />
                      {getRegionName(rid)}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-charcoal/40">{cat.builtIn ? 'All regions' : 'No regions assigned'}</span>
                )}
              </div>
            </div>
          ))}

          {/* Add card */}
          <button
            onClick={openNewModal}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-charcoal/40 hover:border-charcoal/30 hover:text-charcoal/60 transition-colors min-h-[120px] cursor-pointer"
          >
            <Plus size={24} />
            <span className="text-xs font-medium">Add Category</span>
          </button>
        </div>
        );
      })()}

      {/* ═══ CREATE/EDIT MODAL ═══ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/30 backdrop-blur-sm">
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-display font-bold text-charcoal">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>
                <p className="text-xs text-charcoal/50 mt-0.5">
                  {editingCategory ? "Update the category details below" : "Create a new product category and assign regions"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-charcoal/40 hover:text-charcoal hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveCategory} className="p-6 space-y-5">
              {formError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm font-medium border border-red-100">
                  {formError}
                </div>
              )}

              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Veg Pickles, Snacks, Podi & Powders"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:border-heritage-green focus:ring-1 focus:ring-heritage-green/20 outline-none transition-all text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Description <span className="text-charcoal/40">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description of this category"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:border-heritage-green focus:ring-1 focus:ring-heritage-green/20 outline-none transition-all text-sm"
                />
              </div>

              {/* Region Multi-Select */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Publish to Regions <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-charcoal/50 mb-3">
                  Select which regions this category should appear in
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_REGIONS.map((region) => {
                    const isSelected = formData.regions.includes(region.id);
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

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-5 py-3 rounded-xl font-medium text-charcoal bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-5 py-3 rounded-xl font-bold text-white bg-charcoal hover:bg-charcoal-light transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : editingCategory ? (
                    "Save Changes"
                  ) : (
                    <>
                      <Plus size={16} />
                      Create Category
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ DELETE CONFIRMATION MODAL ═══ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-display font-bold text-charcoal mb-2">Delete Category?</h3>
              <p className="text-charcoal/60 text-sm mb-6">
                Are you sure you want to delete <span className="font-bold text-charcoal">{deleteTarget.name}</span>? Products in this category won't be affected, but they'll need reassignment.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                  className="flex-1 px-5 py-2.5 rounded-xl font-medium text-charcoal bg-gray-100 hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCategory}
                  disabled={isDeleting}
                  className="flex-1 px-5 py-2.5 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 transition-colors text-sm flex items-center justify-center disabled:opacity-50"
                >
                  {isDeleting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
