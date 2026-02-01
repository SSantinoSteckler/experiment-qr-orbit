import cron, { ScheduledTask } from "node-cron";

let cronJob: ScheduledTask | null = null;

export function initializeCron() {
  if (cronJob) return; // Evitar inicializar múltiples veces

  // Ejecutar cada hora (0 * * * *)
  cronJob = cron.schedule("0 * * * *", async () => {
    try {
      console.log("[CRON] Ejecutando ping a la API...");
      const response = await fetch("https://experiment-satt.onrender.com/ping");

      if (response.ok) {
        console.log("[CRON] Ping exitoso");
      } else {
        console.error("[CRON] Error en ping:", response.status);
      }
    } catch (error) {
      console.error("[CRON] Error al hacer ping:", error);
    }
  });

  console.log("[CRON] Cron job inicializado - se ejecutará cada hora");
}

export function stopCron() {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    console.log("[CRON] Cron job detenido");
  }
}
