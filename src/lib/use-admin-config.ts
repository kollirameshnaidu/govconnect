"use client";

import { useEffect, useState } from "react";
import {
  ADMIN_CONFIG_EVENT,
  EMPTY_ADMIN_CONFIG,
  readAdminConfig,
  type AdminConfig,
} from "@/lib/admin-config";

export function useAdminConfig() {
  const [config, setConfig] = useState<AdminConfig>(EMPTY_ADMIN_CONFIG);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function sync() {
      const next = readAdminConfig();
      setConfig(next);
      setReady(true);
    }
    sync();
    window.addEventListener(ADMIN_CONFIG_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ADMIN_CONFIG_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { config, ready };
}
