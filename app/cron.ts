"use client";

import { useEffect } from "react";

export function useFrontendCron() {
  useEffect(() => {
    const ping = async () => {
      try {
        console.log("[FRONT CRON] Ping API");
        await fetch("/ping", {
          cache: "no-store",
        });
      } catch (e) {
        console.error("[FRONT CRON] Error", e);
      }
    };

    // Ejecuta al cargar la page
    ping();

    // Cada 5 minutos
    const interval = setInterval(ping, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
}
