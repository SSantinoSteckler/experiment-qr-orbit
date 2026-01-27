"use client";

import { Suspense, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Avatar = { img: string };

function ScanParamContent() {
  const params = useParams();
  const idRaw = (params?.id ?? "") as string;
  const id = 0;

  const totalActive = 46;

  const [clicked, setClicked] = useState(false);
  const [msg, setMsg] = useState("");

  const avatars: Avatar[] = useMemo(
    () => [
      {
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=60",
      },
      {
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=60",
      },
      {
        img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=60",
      },
      {
        img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=60",
      },
    ],
    [],
  );

  const extra = Math.max(0, totalActive - avatars.length);

  const onClick = async () => {
    console.log("🔵 Click detectado, id:", id);

    if (!id) {
      setMsg("❌ ID inválido en la URL.");
      return;
    }

    setClicked(true);
    setMsg("⏳ Enviando...");

    try {
      const res = await fetch(
        `https://experiment-satt.onrender.com/api/btn/${encodeURIComponent(id)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMsg(`❌ ${data?.error ?? `Error HTTP ${res.status}`}`);
        setClicked(false);
        return;
      }

      setMsg("✅ Listo");
      console.log("✅ Respuesta:", data);
    } catch (e) {
      console.error(e);
      setMsg("❌ Error de red / conexión");
      setClicked(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-5">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-3xl font-extrabold tracking-tight">
          Hay {totalActive} personas activas
          <br />
          en este bar ahora
        </h1>

        {/* Debug visible */}
        <p className="mt-3 text-center text-xs text-white/50">
          Debug: <span className="font-mono">/scan/{id || "(vacío)"}</span>
        </p>

        <div className="mt-8 flex items-center justify-center">
          <div className="flex -space-x-4">
            {avatars.map((a, i) => (
              <div
                key={i}
                className="relative h-16 w-16 rounded-full overflow-hidden border border-white/20"
              >
                <img
                  src={a.img}
                  alt=""
                  className="h-full w-full object-cover blur-[6px] scale-110"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            ))}

            <div className="h-16 w-16 rounded-full border border-white/20 bg-white/5 flex items-center justify-center backdrop-blur">
              <div className="text-sm font-semibold text-white/80">
                +{extra}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-white/70">
          Tocá para ver quién está disponible ahora 😉
        </p>

        <button
          onClick={onClick}
          disabled={clicked || !id}
          className="mt-6 w-full rounded-2xl py-4 text-lg font-bold bg-white text-neutral-950 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-white/90 transition"
        >
          {clicked ? "Listo" : "Quiero verlos"}
        </button>

        {msg && (
          <p
            className={`mt-4 text-center text-sm ${msg.startsWith("✅") ? "text-green-300" : "text-red-300"}`}
          >
            {msg}
          </p>
        )}

        <p className="mt-4 text-center text-xs text-white/50">
          Experimento universitario. No se guarda información personal.
        </p>
      </div>
    </main>
  );
}

export default function ScanParamPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950" />}>
      <ScanParamContent />
    </Suspense>
  );
}
