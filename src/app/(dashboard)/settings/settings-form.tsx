"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

interface SettingsFormProps {
  defaultName: string;
  defaultEmail: string;
}

export function SettingsForm({ defaultName, defaultEmail }: SettingsFormProps) {
  const [name, setName] = useState(defaultName);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("profiles")
        .update({ full_name: name, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      setSaved(true);
    }

    setLoading(false);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <Input
        id="settings-name"
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        id="settings-email"
        label="Email"
        value={defaultEmail}
        disabled
        className="opacity-60"
      />
      <div className="flex items-center gap-3">
        <Button type="submit" loading={loading}>
          Save Changes
        </Button>
        {saved && (
          <span className="text-sm text-emerald-600 dark:text-emerald-400">
            Saved successfully
          </span>
        )}
      </div>
    </form>
  );
}
