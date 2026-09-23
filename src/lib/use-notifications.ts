"use client";

import { useEffect, useState } from "react";
import { api } from "@/constants/api";
import { apiRequest } from "@/lib/api-client";

export function useNotifications<T>() {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiRequest<{ notifications: T[] }>(api.notifications)
      .then((data) => {
        if (!cancelled) setItems(Array.isArray(data.notifications) ? data.notifications : []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading };
}
