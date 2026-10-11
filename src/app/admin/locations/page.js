"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MapPin, Map, Star } from "lucide-react";
import Button from "@/components/ui/Button";

import { fetchLocations, saveLocation, removeLocation } from "@/app/actions/locations";

export default function AdminLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
    hours: "",
    mapUrl: "",
    isPrimary: false
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchLocations();
    setLocations(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (location = null) => {
    if (location) {
      setEditingId(location.id);
      setFormData({
        name: location.name || "",
        address: location.address || "",
        phone: location.phone || "",
        whatsapp: location.whatsapp || "",
        email: location.email || "",
        hours: location.hours || "",
        mapUrl: location.mapUrl || "",
        isPrimary: location.isPrimary || false
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        address: "",
        phone: "",
        whatsapp: "",
        email: "",
        hours: "",
        mapUrl: "",
        isPrimary: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const result = await saveLocation(editingId, formData);
    if (result.success) {
      handleCloseModal();
      await loadData();
    } else {
      alert("Failed to save location.");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;
    const result = await removeLocation(id);
    if (result.success) {
      await loadData();
    } else {
      alert("Failed to delete.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-charcoal-muted">Loading locations...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-charcoal mb-2">Store Locations</h1>
        <p className="text-charcoal-muted">Manage physical stores and contact information.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border-light overflow-hidden">
        <div className="p-4 md:p-6 flex justify-between items-center border-b border-border-light bg-[#FAF9F6]">
          <h2 className="text-lg font-bold text-charcoal">All Stores</h2>
          <Button onClick={() => handleOpenModal()} className="!py-2">
            <Plus size={16} className="mr-2" />
            Add Store
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-alt text-charcoal-muted text-sm font-semibold border-b border-border-light">
                <th className="p-4">Store Name & Address</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.id} className="border-b border-border-light hover:bg-[#FAF9F6] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-heritage-green/10 text-heritage-green p-2 rounded-lg shrink-0 mt-1">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-charcoal flex items-center gap-2">
                          {loc.name}
                          {loc.isPrimary && (
                            <span className="bg-turmeric-gold/20 text-turmeric-gold-dark text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold flex items-center gap-1">
                              <Star size={10} /> Primary
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-charcoal-muted mt-1 max-w-xs">{loc.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-charcoal space-y-1">
                      {loc.phone && <div>📞 {loc.phone}</div>}
                      {loc.email && <div>✉️ {loc.email}</div>}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {loc.mapUrl ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-heritage-green bg-heritage-green/10 px-2 py-1 rounded-full">
                        <Map size={12} /> Map Added
                      </span>
                    ) : (
                      <span className="text-xs text-charcoal-muted">No Map</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenModal(loc)}
                        className="p-2 text-charcoal-muted hover:text-heritage-green bg-white shadow-sm border border-border-light rounded-md"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(loc.id)}
                        className="p-2 text-charcoal-muted hover:text-pickle-red bg-white shadow-sm border border-border-light rounded-md"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {locations.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-charcoal-muted">
                    No store locations added yet. Click "Add Store" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-charcoal/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border-light flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold font-display text-charcoal">
                {editingId ? "Edit Store" : "Add New Store"}
              </h2>
              <button onClick={handleCloseModal} className="text-charcoal-muted hover:text-charcoal p-2">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-charcoal mb-2">Store Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 bg-surface-alt border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-green/30"
                    placeholder="e.g. Hyderabad Main Branch"
                  />
                </div>
                <div className="col-span-2 md:col-span-1 flex items-end pb-3">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.isPrimary}
                      onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                      className="w-5 h-5 rounded border-border text-heritage-green focus:ring-heritage-green"
                    />
                    <span className="text-sm font-semibold text-charcoal group-hover:text-heritage-green transition-colors">
                      Set as Primary Store (Shown by default)
                    </span>
                  </label>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-charcoal mb-2">Full Address</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-3 bg-surface-alt border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-green/30 min-h-[80px]"
                    placeholder="123 Pickle Street, City, State, PIN"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 bg-surface-alt border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-green/30"
                    placeholder="+91 81238 08404"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full p-3 bg-surface-alt border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-green/30"
                    placeholder="+91 81238 08404"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 bg-surface-alt border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-green/30"
                    placeholder="branch@picklecart.in"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Business Hours</label>
                  <input
                    type="text"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    className="w-full p-3 bg-surface-alt border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-green/30"
                    placeholder="Mon - Sat: 9:00 AM - 7:00 PM"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-charcoal mb-2">Google Maps Embed URL</label>
                  <p className="text-xs text-charcoal-muted mb-2">
                    Go to Google Maps {'>'} Share {'>'} Embed a map {'>'} Copy the `src` URL inside the iframe.
                  </p>
                  <textarea
                    value={formData.mapUrl}
                    onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                    className="w-full p-3 bg-surface-alt border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-green/30 font-mono text-xs h-24"
                    placeholder='https://www.google.com/maps/embed?pb=...'
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-border-light mt-6">
                <Button type="button" variant="ghost" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Store"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
