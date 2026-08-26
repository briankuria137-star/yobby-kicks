"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";

const supabase: any = createClient();
import { Setting } from "@/types";
import { Save, Store } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("settings").select("*");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((s: any) => (map[s.key] = s.value));
        setSettings(map);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from("settings")
          .upsert(
            { key, value },
            { onConflict: "key" }
          );

        if (error) {
          console.error("Settings save error:", error);
          throw error;
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings. Check your Supabase connection and permissions.");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/60">Loading settings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#15151b] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1a1a22] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {saved && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
          Settings saved successfully.
        </div>
      )}

      <div className="bg-[#111116] rounded-lg shadow-sm border border-white/[0.08] p-6 space-y-6 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Store className="w-5 h-5 text-white/70" />
          <h2 className="font-semibold text-white">Business Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Business Name
            </label>
            <input
              value={settings.business_name || ""}
              onChange={(e) => updateSetting("business_name", e.target.value)}
              className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Business Category
            </label>
            <input
              value={settings.business_category || ""}
              onChange={(e) =>
                updateSetting("business_category", e.target.value)
              }
              placeholder="e.g. Footwear, Fashion, Electronics"
              className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Catalogue Tagline
            </label>
            <input
              value={settings.shop_tagline || ""}
              onChange={(e) =>
                updateSetting("shop_tagline", e.target.value)
              }
              placeholder="e.g. Quality products. Ready for you."
              className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Location
            </label>
            <input
              value={settings.location || ""}
              onChange={(e) => updateSetting("location", e.target.value)}
              className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              WhatsApp Number (with country code, no +)
            </label>
            <input
              value={settings.whatsapp_number || ""}
              onChange={(e) => updateSetting("whatsapp_number", e.target.value)}
              placeholder="254712345678"
              className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-white/60 mt-1">
              Example: 254712345678 (Kenya format)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Instagram Username
            </label>
            <input
              value={settings.instagram_username || ""}
              onChange={(e) => updateSetting("instagram_username", e.target.value)}
              placeholder="your_username"
              className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Shop Description
            </label>
            <textarea
              value={settings.shop_description || ""}
              onChange={(e) => updateSetting("shop_description", e.target.value)}
              rows={3}
              className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Delivery Information
            </label>
            <textarea
              value={settings.delivery_info || ""}
              onChange={(e) => updateSetting("delivery_info", e.target.value)}
              rows={2}
              className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Currency
            </label>
            <input
              value={settings.currency || "KSh"}
              disabled
              className="w-full px-3 py-2 border border-white/[0.08] rounded-md text-sm bg-[#0f0f14] text-white/60"
            />
            <p className="text-xs text-white/60 mt-1">Currency is fixed to KSh</p>
          </div>
        </div>
      </div>
    </div>
  );
}
