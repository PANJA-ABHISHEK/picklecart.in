"use client";

import { useState, useEffect } from "react";
import { getPromoCodes, addPromoCode, updatePromoCode, deletePromoCode } from "@/services/promocodes";
import { Plus, Trash2, Edit2, X, Save, Tag, Percent, CheckCircle, XCircle } from "lucide-react";

export default function AdminPromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    isActive: true
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    setLoading(true);
    const data = await getPromoCodes();
    setPromoCodes(data);
    setLoading(false);
  };

  const openModal = (promo = null) => {
    setErrorMsg("");
    if (promo) {
      setEditingId(promo.id);
      setFormData({
        code: promo.code,
        discountType: promo.discountType || "percentage",
        discountValue: promo.discountValue || 0,
        minOrderValue: promo.minOrderValue || 0,
        maxDiscount: promo.maxDiscount || 0,
        isActive: promo.isActive !== false
      });
    } else {
      setEditingId(null);
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        minOrderValue: 0,
        maxDiscount: 0,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    
    // Convert string inputs to numbers
    const payload = {
      ...formData,
      discountValue: Number(formData.discountValue),
      minOrderValue: Number(formData.minOrderValue) || 0,
      maxDiscount: Number(formData.maxDiscount) || 0,
    };

    let result;
    if (editingId) {
      result = await updatePromoCode(editingId, payload);
    } else {
      result = await addPromoCode(payload);
    }
    
    if (result.success) {
      closeModal();
      fetchPromoCodes();
    } else {
      setErrorMsg(result.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this promo code?")) {
      await deletePromoCode(id);
      fetchPromoCodes();
    }
  };

  const toggleStatus = async (promo) => {
    await updatePromoCode(promo.id, { isActive: !promo.isActive });
    fetchPromoCodes();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-earthy-brown-dark tracking-tight mb-1">Discounts</h1>
          <p className="text-earthy-brown-light font-medium text-sm">
            Manage promo codes and special offers
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-earthy-brown text-[#FFFFFF] px-5 py-2.5 rounded-xl font-medium hover:bg-earthy-brown-dark transition-colors flex items-center justify-center gap-2 text-sm shadow-sm w-full sm:w-auto"
        >
          <Plus size={18} />
          Create Promo Code
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-earthy-brown border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : promoCodes.length === 0 ? (
        <div className="bg-surface rounded-2xl shadow-sm border border-border-light p-12 text-center">
          <Tag size={48} className="mx-auto text-border-light mb-4" />
          <h3 className="text-xl font-bold text-earthy-brown-dark mb-2">No Promo Codes Found</h3>
          <p className="text-charcoal-light">Click 'Create Promo Code' to set up your first offer.</p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl shadow-sm border border-border-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-alt border-b border-border-light text-charcoal">
                  <th className="p-4 font-semibold text-sm">Code</th>
                  <th className="p-4 font-semibold text-sm">Discount</th>
                  <th className="p-4 font-semibold text-sm">Min. Order</th>
                  <th className="p-4 font-semibold text-sm">Times Used</th>
                  <th className="p-4 font-semibold text-sm">Status</th>
                  <th className="p-4 font-semibold text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {promoCodes.map((promo) => (
                  <tr key={promo.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-earthy-brown/10 text-earthy-brown-dark font-mono font-bold text-sm">
                        <Tag size={14} />
                        {promo.code}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-charcoal text-sm">
                      {promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `₹${promo.discountValue} OFF`}
                      {promo.discountType === 'percentage' && promo.maxDiscount > 0 && (
                        <span className="block text-xs text-charcoal-muted mt-0.5">Up to ₹{promo.maxDiscount}</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-charcoal-light">
                      {promo.minOrderValue > 0 ? `₹${promo.minOrderValue}` : 'None'}
                    </td>
                    <td className="p-4 text-sm text-charcoal-light">
                      {promo.timesUsed || 0}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => toggleStatus(promo)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          promo.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {promo.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {promo.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openModal(promo)} className="p-1.5 text-gray-500 hover:text-earthy-brown hover:bg-gray-100 rounded-md transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(promo.id)} className="p-1.5 text-gray-500 hover:text-pickle-red hover:bg-red-50 rounded-md transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-charcoal/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-earthy-brown-dark">
                {editingId ? "Edit Promo Code" : "Create Promo Code"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-charcoal transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1">Promo Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all font-mono uppercase"
                    placeholder="e.g. DIWALI20"
                  />
                  <p className="text-xs text-gray-500 mt-1">Customers will enter this code at checkout.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1">Discount Type</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                      className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1">
                      {formData.discountType === 'percentage' ? 'Percentage Off (%) *' : 'Amount Off (₹) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={formData.discountType === 'percentage' ? "100" : "100000"}
                      value={formData.discountValue}
                      onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                      className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1">Min. Order Value (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})}
                      className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all"
                      placeholder="0 for no minimum"
                    />
                  </div>
                  {formData.discountType === 'percentage' && (
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-1">Max Discount (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all"
                        placeholder="0 for no limit"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-heritage-green"></div>
                    </div>
                    <span className="font-semibold text-charcoal text-sm">Code is Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 bg-gray-100 text-charcoal font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-earthy-brown text-white font-medium rounded-xl hover:bg-earthy-brown-dark transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {editingId ? "Update" : "Save Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
