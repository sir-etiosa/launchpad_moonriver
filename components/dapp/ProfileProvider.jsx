"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";

const DEFAULT_NAME = "You";
const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const { address, isConnected } = useAccount();
  const [displayName, setDisplayName] = useState(DEFAULT_NAME);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    if (!isConnected || !address) {
      setDisplayName(DEFAULT_NAME);
      setError("");
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    fetch(`/api/profiles/${address}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Profile could not be loaded.");
        return response.json();
      })
      .then((profile) => {
        if (!active) return;
        setDisplayName(profile.displayName || DEFAULT_NAME);
        setError("");
      })
      .catch(() => {
        if (active) setError("Profile is temporarily unavailable.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [address, isConnected]);

  async function saveDisplayName(nextName) {
    if (!address) return false;

    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/profiles/${address}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ displayName: nextName }),
      });
      const profile = await response.json();
      if (!response.ok) throw new Error(profile.error || "Profile could not be saved.");
      setDisplayName(profile.displayName);
      return true;
    } catch (saveError) {
      setError(saveError.message);
      return false;
    } finally {
      setSaving(false);
    }
  }

  const value = useMemo(
    () => ({ address, displayName, error, loading, saving, saveDisplayName }),
    [address, displayName, error, loading, saving],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const profile = useContext(ProfileContext);
  if (!profile) throw new Error("useProfile must be used inside ProfileProvider.");
  return profile;
}
