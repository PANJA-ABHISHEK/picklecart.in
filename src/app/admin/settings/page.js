"use client";

import { useState, useEffect } from "react";
import { Megaphone, Save, Truck, Edit2, Lock, Unlock, Check, X, AlertTriangle } from "lucide-react";
import { ANNOUNCEMENT_COLORS, resolveAnnouncementBg } from "@/lib/constants";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    announcement: {
      enabled: false,
      text: "",
      bgColor: "bg-[#B84A32]",
      textColor: "text-white"
    },
    shipping: {
      defaultFee: 99,
      freeThreshold: 1500
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Dedicated protected editing state for Shipping Rates
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [shippingDraft, setShippingDraft] = useState({
    defaultFee: 99,
    freeThreshold: 1500,
  });
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [savingShipping, setSavingShipping] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const json = await res.json();
          const data = json.settings;
          if (isMounted && data) {
            const sh = {
              defaultFee: data?.shipping?.defaultFee ?? 99,
              freeThreshold: data?.shipping?.freeThreshold ?? 1500
            };
            const fetchedAnnouncement = data.announcement || {};
            const normalizedBg = resolveAnnouncementBg(fetchedAnnouncement.bgColor).className || fetchedAnnouncement.bgColor || "bg-[#B84A32]";

            setSettings({
              announcement: {
                enabled: false,
                text: "",
                bgColor: normalizedBg,
                textColor: "text-white",
                ...fetchedAnnouncement,
                bgColor: normalizedBg
              },
              shipping: sh
            });
            setShippingDraft(sh);
          }
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSettings();
    return () => { isMounted = false; };
  }, []);

  const startEditingShipping = () => {
    setShippingDraft({
      defaultFee: settings.shipping?.defaultFee ?? 99,
      freeThreshold: settings.shipping?.freeThreshold ?? 1500,
    });
    setIsEditingShipping(true);
  };

  const cancelEditingShipping = () => {
    setShippingDraft({
      defaultFee: settings.shipping?.defaultFee ?? 99,
      freeThreshold: settings.shipping?.freeThreshold ?? 1500,
    });
    setIsEditingShipping(false);
  };

  const handleConfirmSaveShipping = async () => {
    setSavingShipping(true);
    setMessage(null);
    try {
      const updatedSettings = {
        ...settings,
        shipping: {
          defaultFee: Number(shippingDraft.defaultFee) >= 0 ? Number(shippingDraft.defaultFee) : 99,
          freeThreshold: Number(shippingDraft.freeThreshold) >= 0 ? Number(shippingDraft.freeThreshold) : 1500,
        },
      };

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings),
      });

      const result = await res.json();
      if (result.success) {
        setSettings(updatedSettings);
        setIsEditingShipping(false);
        setShowSaveConfirm(false);
        setMessage({ type: "success", text: "Shipping rates updated and active storewide!" });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update shipping rates." });
      }
    } catch (err) {
      console.error("Failed to save shipping rates:", err);
      setMessage({ type: "error", text: "Network error saving shipping rates." });
    } finally {
      setSavingShipping(false);
    }
  };

  const handleSaveAnnouncement = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const result = await res.json();
      if (result.success) {
        setMessage({ type: "success", text: "Announcement bar settings saved successfully." });
        setTimeout(() => setMessage(null), 3500);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update announcement settings." });
      }
    } catch (err) {
      console.error("Failed to save announcement settings:", err);
      setMessage({ type: "error", text: "Network error updating announcement settings." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-earthy-brown border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-earthy-brown-dark tracking-tight mb-1">Store Settings</h1>
        <p className="text-earthy-brown-light font-medium">Manage global store configurations</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl border font-medium ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        
        {/* Protected Shipping & Delivery Configuration */}
        <div className="bg-surface rounded-2xl shadow-sm border border-border-light p-6 transition-all duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border-light pb-5">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className={`p-3 rounded-2xl shrink-0 transition-colors ${
                isEditingShipping ? 'bg-amber-100 text-amber-800' : 'bg-heritage-green/10 text-heritage-green'
              }`}>
                <Truck size={24} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-earthy-brown-dark tracking-tight">
                    Shipping &amp; Delivery Rates
                  </h2>
                  {!isEditingShipping ? (
                    <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                      <Lock size={12} />
                      <span>Locked &amp; Active</span>
                    </span>
                  ) : (
                    <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs animate-pulse shrink-0">
                      <Unlock size={12} />
                      <span>Editing Mode</span>
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-earthy-brown-light mt-1 font-body">
                  Configure standard shipping charges and the minimum cart threshold for free delivery.
                </p>
              </div>
            </div>

            {/* Action buttons (Edit vs Save / Cancel) */}
            <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
              {!isEditingShipping ? (
                <button
                  type="button"
                  onClick={startEditingShipping}
                  className="whitespace-nowrap h-10 px-4 py-2 bg-heritage-green hover:bg-heritage-green-dark !text-white text-white rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-95"
                  style={{ color: "#FFFFFF" }}
                >
                  <Edit2 size={14} />
                  <span>Edit Rates</span>
                </button>
              ) : (
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={cancelEditingShipping}
                    disabled={savingShipping}
                    className="whitespace-nowrap h-10 px-4 py-2 bg-white hover:bg-cream border border-border text-charcoal rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
                  >
                    <X size={14} />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSaveConfirm(true)}
                    disabled={savingShipping}
                    className="whitespace-nowrap h-10 px-5 py-2 bg-[#8C2D19] hover:bg-[#732414] !text-white text-white rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-60 active:scale-95"
                    style={{ color: "#FFFFFF" }}
                  >
                    <Check size={14} strokeWidth={2.5} />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Edit mode safety alert */}
          {isEditingShipping && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertTriangle size={16} className="text-amber-700 shrink-0" />
              <span>
                <strong>Protected Financial Setting:</strong> Changes will directly impact customer checkout prices. Review carefully before saving.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Standard Shipping Charge (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  disabled={!isEditingShipping}
                  value={isEditingShipping ? (shippingDraft.defaultFee ?? "") : (settings.shipping?.defaultFee ?? 99)}
                  onChange={(e) =>
                    setShippingDraft({
                      ...shippingDraft,
                      defaultFee: Number(e.target.value) >= 0 ? Number(e.target.value) : 0,
                    })
                  }
                  placeholder="99"
                  className={`w-full pl-8 pr-10 py-2.5 rounded-lg border transition-all font-mono ${
                    isEditingShipping 
                      ? "bg-white border-earthy-brown focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 text-charcoal shadow-2xs" 
                      : "bg-[#F5EFE4] border-border-light text-charcoal/80 cursor-not-allowed select-none"
                  }`}
                />
                {!isEditingShipping && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted/60" title="Locked: Click 'Edit Rates' to change">
                    <Lock size={14} />
                  </span>
                )}
              </div>
              <p className="text-xs text-charcoal-muted mt-1.5 leading-relaxed">
                Applied to orders when the cart subtotal is below the free delivery threshold.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Free Delivery Threshold (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  disabled={!isEditingShipping}
                  value={isEditingShipping ? (shippingDraft.freeThreshold ?? "") : (settings.shipping?.freeThreshold ?? 1500)}
                  onChange={(e) =>
                    setShippingDraft({
                      ...shippingDraft,
                      freeThreshold: Number(e.target.value) >= 0 ? Number(e.target.value) : 0,
                    })
                  }
                  placeholder="1500"
                  className={`w-full pl-8 pr-10 py-2.5 rounded-lg border transition-all font-mono ${
                    isEditingShipping 
                      ? "bg-white border-earthy-brown focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 text-charcoal shadow-2xs" 
                      : "bg-[#F5EFE4] border-border-light text-charcoal/80 cursor-not-allowed select-none"
                  }`}
                />
                {!isEditingShipping && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted/60" title="Locked: Click 'Edit Rates' to change">
                    <Lock size={14} />
                  </span>
                )}
              </div>
              <p className="text-xs text-charcoal-muted mt-1.5 leading-relaxed">
                Orders with a cart subtotal of this amount or higher receive 100% free delivery.
              </p>
            </div>
          </div>

          {/* Rate Summary Preview Box */}
          <div className="mt-6 p-4 rounded-xl bg-heritage-green/5 border border-heritage-green/20 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-heritage-green text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Truck size={16} />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-heritage-green-dark">
                {isEditingShipping ? "Proposed Delivery Experience (Preview)" : "Current Active Delivery Experience"}
              </p>
              <p className="text-charcoal-muted text-xs mt-0.5 leading-relaxed">
                Orders under <strong className="text-charcoal">₹{isEditingShipping ? shippingDraft.freeThreshold : (settings.shipping?.freeThreshold ?? 1500)}</strong> will be charged <strong className="text-charcoal">₹{isEditingShipping ? shippingDraft.defaultFee : (settings.shipping?.defaultFee ?? 99)}</strong> shipping. Orders of <strong className="text-heritage-green-dark font-bold">₹{isEditingShipping ? shippingDraft.freeThreshold : (settings.shipping?.freeThreshold ?? 1500)} or more</strong> will unlock <strong className="text-emerald-700">100% FREE Delivery</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Announcement Bar Settings */}
        <div className="bg-surface rounded-2xl shadow-sm border border-border-light p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border-light pb-5">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 bg-earthy-brown/10 text-earthy-brown rounded-2xl shrink-0">
                <Megaphone size={24} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-earthy-brown-dark tracking-tight">
                    Announcement Bar
                  </h2>
                  {settings.announcement.enabled ? (
                    <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      <span>Active &amp; Visible</span>
                    </span>
                  ) : (
                    <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-charcoal-muted border border-gray-200 shrink-0">
                      <span>Disabled</span>
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-earthy-brown-light mt-1 font-body">
                  Display special offers or alerts at the top of your website.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.announcement.enabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    announcement: { ...settings.announcement, enabled: e.target.checked }
                  })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-heritage-green"></div>
              </div>
              <span className="font-semibold text-charcoal">Enable Announcement Bar</span>
            </label>

            {settings.announcement.enabled && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Announcement Message</label>
                  <input
                    type="text"
                    value={settings.announcement.text}
                    onChange={(e) => setSettings({
                      ...settings,
                      announcement: { ...settings.announcement, text: e.target.value }
                    })}
                    placeholder="e.g. Free Delivery on Orders Above ₹1500 | Call: +917842924883"
                    className="w-full px-4 py-2.5 bg-cream border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">Background Color</label>
                    <select
                      value={resolveAnnouncementBg(settings.announcement.bgColor).className || settings.announcement.bgColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        announcement: { ...settings.announcement, bgColor: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-cream border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all font-medium text-sm text-charcoal"
                    >
                      {ANNOUNCEMENT_COLORS.map((c) => (
                        <option key={c.tailwind} value={c.tailwind}>
                          {c.label}
                        </option>
                      ))}
                    </select>

                    {/* Quick Visual Color Swatches */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {ANNOUNCEMENT_COLORS.map((c) => {
                        const isSelected = (resolveAnnouncementBg(settings.announcement.bgColor).className || settings.announcement.bgColor) === c.tailwind;
                        return (
                          <button
                            key={c.tailwind}
                            type="button"
                            onClick={() => setSettings({
                              ...settings,
                              announcement: { ...settings.announcement, bgColor: c.tailwind }
                            })}
                            style={{ backgroundColor: c.hex }}
                            title={c.label}
                            className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center shadow-2xs ${
                              isSelected 
                                ? "border-earthy-brown-dark scale-110 ring-2 ring-earthy-brown/30" 
                                : "border-white/80 hover:scale-105 opacity-90 hover:opacity-100"
                            }`}
                          >
                            {isSelected && (
                              <Check size={14} className={c.id === "cream" ? "text-charcoal" : "text-white"} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">Text Color</label>
                    <select
                      value={settings.announcement.textColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        announcement: { ...settings.announcement, textColor: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-cream border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all font-medium text-sm text-charcoal"
                    >
                      <option value="text-white">White (Recommended for warm colors)</option>
                      <option value="text-cream">Warm Cream</option>
                      <option value="text-earthy-brown-dark">Dark Brown (Recommended for Parchment Cream)</option>
                    </select>
                  </div>
                </div>

                {/* Preview Box */}
                <div className="mt-6">
                  <span className="block text-sm font-semibold text-charcoal mb-2">Live Preview</span>
                  {(() => {
                    const resolvedPreviewBg = resolveAnnouncementBg(settings.announcement.bgColor);
                    return (
                      <div 
                        style={resolvedPreviewBg.hex ? { backgroundColor: resolvedPreviewBg.hex } : {}}
                        className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors duration-300 ${resolvedPreviewBg.className || ''}`}
                      >
                        <Megaphone size={16} className={settings.announcement.textColor} />
                        <p className={`text-sm font-medium text-center ${settings.announcement.textColor}`}>
                          {settings.announcement.text || "Your announcement will appear here..."}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Announcement Card Footer with dedicated Save button */}
            <div className="border-t border-border-light pt-5 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-xs text-charcoal-muted flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-heritage-green shrink-0"></span>
                <span>Updates appear instantly across the website header.</span>
              </div>
              <button
                type="button"
                onClick={handleSaveAnnouncement}
                disabled={saving}
                className="whitespace-nowrap h-10 px-6 py-2 bg-earthy-brown hover:bg-earthy-brown-dark !text-white text-white rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-60 active:scale-95"
                style={{ color: "#FFFFFF" }}
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Announcement...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Announcement</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal before applying rate changes */}
      {showSaveConfirm && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => !savingShipping && setShowSaveConfirm(false)}
        >
          <div 
            className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-7 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FDF2F0] text-[#8C2D19] flex items-center justify-center mb-4 mx-auto border border-[#FADCD7]">
              <AlertTriangle size={24} />
            </div>

            <h3 className="font-display text-xl font-bold text-charcoal text-center">
              Confirm Shipping Rate Changes
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted text-center mt-1.5 mb-5 font-body leading-relaxed">
              Please review these changes carefully. They will affect all customer orders and payments immediately upon saving.
            </p>

            <div className="bg-[#FAF6EE] rounded-2xl border border-[#E8DFC9] p-4 space-y-3 mb-6 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted">Standard Shipping Charge:</span>
                <div className="flex items-center gap-2 font-mono font-bold">
                  <span className="text-charcoal-muted/60 line-through">₹{settings.shipping?.defaultFee ?? 99}</span>
                  <span className="text-charcoal">➔</span>
                  <span className="text-[#8C2D19] bg-white px-2 py-0.5 rounded-md border border-[#E8DFC9]">
                    ₹{shippingDraft.defaultFee}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-[#E8DFC9]/60 pt-2.5">
                <span className="text-charcoal-muted">Free Delivery Threshold:</span>
                <div className="flex items-center gap-2 font-mono font-bold">
                  <span className="text-charcoal-muted/60 line-through">₹{settings.shipping?.freeThreshold ?? 1500}</span>
                  <span className="text-charcoal">➔</span>
                  <span className="text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-[#E8DFC9]">
                    ₹{shippingDraft.freeThreshold}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={savingShipping}
                onClick={() => setShowSaveConfirm(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-[#DFD5C0] bg-[#FAF6EE] hover:bg-[#F2EADB] text-charcoal font-semibold text-sm transition-colors cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                disabled={savingShipping}
                onClick={handleConfirmSaveShipping}
                className="w-full py-2.5 px-4 rounded-xl bg-[#8C2D19] hover:bg-[#732414] !text-white text-white font-semibold text-sm transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                style={{ color: "#FFFFFF" }}
              >
                {savingShipping ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check size={16} />
                    Confirm &amp; Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
