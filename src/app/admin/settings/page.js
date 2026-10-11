"use client";

import { useState, useEffect } from "react";
import { getStoreSettings, updateStoreSettings } from "@/services/settings";
import { Megaphone, Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    announcement: {
      enabled: false,
      text: "",
      bgColor: "bg-earthy-brown",
      textColor: "text-white"
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getStoreSettings();
      if (data) {
        setSettings(data);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await updateStoreSettings(settings);
    if (result.success) {
      setMessage({ type: "success", text: "Settings updated successfully." });
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update settings." });
    }
    
    setSaving(false);
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

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Announcement Bar Settings */}
        <div className="bg-surface rounded-2xl shadow-sm border border-border-light p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-border-light pb-4">
            <div className="p-2 bg-earthy-brown/10 rounded-lg">
              <Megaphone className="text-earthy-brown" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-earthy-brown-dark">Announcement Bar</h2>
              <p className="text-sm text-earthy-brown-light mt-1">Display special offers or alerts at the top of your website.</p>
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
                      value={settings.announcement.bgColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        announcement: { ...settings.announcement, bgColor: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-cream border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all"
                    >
                      <option value="bg-earthy-brown">Earthy Brown (Brand Default)</option>
                      <option value="bg-heritage-green">Heritage Green</option>
                      <option value="bg-pickle-red">Pickle Red</option>
                      <option value="bg-turmeric-gold">Turmeric Gold</option>
                      <option value="bg-charcoal">Charcoal</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">Text Color</label>
                    <select
                      value={settings.announcement.textColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        announcement: { ...settings.announcement, textColor: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-cream border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all"
                    >
                      <option value="text-white">White</option>
                      <option value="text-cream">Cream</option>
                      <option value="text-earthy-brown-dark">Dark Brown</option>
                    </select>
                  </div>
                </div>

                {/* Preview Box */}
                <div className="mt-6">
                  <span className="block text-sm font-semibold text-charcoal mb-2">Live Preview</span>
                  <div className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${settings.announcement.bgColor}`}>
                    <Megaphone size={16} className={settings.announcement.textColor} />
                    <p className={`text-sm font-medium text-center ${settings.announcement.textColor}`}>
                      {settings.announcement.text || "Your announcement will appear here..."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center sm:justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-earthy-brown text-[#FFFFFF] w-full sm:w-auto px-8 py-3 rounded-xl font-bold hover:bg-earthy-brown-dark transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
            style={{ color: "white" }}
          >
            {saving ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={20} />
                Save Settings
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
