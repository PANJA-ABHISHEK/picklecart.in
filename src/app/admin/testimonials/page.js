"use client";

import { useState, useEffect } from "react";
import { getTestimonials, addTestimonial, deleteTestimonial, updateTestimonial } from "@/services/testimonials";
import { Star, Plus, Trash2, Edit2, X, Save } from "lucide-react";
import Image from "next/image";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    customerName: "",
    location: "",
    rating: 5,
    comment: ""
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    const data = await getTestimonials();
    setTestimonials(data);
    setLoading(false);
  };

  const openModal = (testimonial = null) => {
    if (testimonial) {
      setEditingId(testimonial.id);
      setFormData({
        customerName: testimonial.customerName || "",
        location: testimonial.location || "",
        rating: testimonial.rating || 5,
        comment: testimonial.comment || ""
      });
    } else {
      setEditingId(null);
      setFormData({
        customerName: "",
        location: "",
        rating: 5,
        comment: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateTestimonial(editingId, formData);
    } else {
      await addTestimonial(formData);
    }
    closeModal();
    fetchTestimonials();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      await deleteTestimonial(id);
      fetchTestimonials();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-earthy-brown-dark tracking-tight mb-1">Testimonials</h1>
          <p className="text-earthy-brown-light font-medium text-sm">
            Manage customer reviews shown on the homepage
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-earthy-brown text-[#FFFFFF] px-5 py-2.5 rounded-xl font-medium hover:bg-earthy-brown-dark transition-colors flex items-center justify-center gap-2 text-sm shadow-sm w-full sm:w-auto"
        >
          <Plus size={18} />
          Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-earthy-brown border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-surface rounded-2xl shadow-sm border border-border-light p-12 text-center">
          <Star size={48} className="mx-auto text-border-light mb-4" />
          <h3 className="text-xl font-bold text-earthy-brown-dark mb-2">No Testimonials Found</h3>
          <p className="text-charcoal-light">Click 'Add Testimonial' to create your first review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-surface rounded-2xl p-6 border border-border-light shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < t.rating ? "fill-turmeric-gold text-turmeric-gold" : "text-gray-300"}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(t)} className="p-1.5 text-gray-500 hover:text-earthy-brown hover:bg-gray-100 rounded-md transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 text-gray-500 hover:text-pickle-red hover:bg-red-50 rounded-md transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-charcoal-light italic mb-4 flex-1">"{t.comment}"</p>
              
              <div className="border-t border-gray-100 pt-4 mt-auto">
                <p className="font-semibold text-charcoal text-sm">{t.customerName}</p>
                <p className="text-xs text-gray-500">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-charcoal/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-earthy-brown-dark">
                {editingId ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-charcoal transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all"
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all"
                    placeholder="e.g. Hyderabad, TS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all"
                  >
                    <option value={5}>5 Stars (Recommended)</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1">Review Comment *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all resize-none"
                    placeholder="Write the customer's review here..."
                  />
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
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
