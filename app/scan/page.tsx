"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Avatar = { img: string };

function ScanQueryContent() {
  const sp = useSearchParams();
  const router = useRouter();

  const id = (sp.get("id") || "").trim(); // <-- lee ?id=
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

  // Si existe id en query, redirigimos a /scan/[id]
  // así unificás todo y nunca más tenés dudas.
  if (id) {
    // Ojo: esto corre en render, pero es client component; es OK.
    // Si preferís, lo pasamos a useEffect.
    router.replace(`/scan/${encodeURIComponent(id)}`);
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        Redirigiendo...
      </main>
    );
  }

  const onClick = async () => {
    setMsg("❌ Falta el ID. Usá /scan/ABC123 o /scan?id=ABC123");
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-5">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-3xl font-extrabold tracking-tight">
          Hay {totalActive} personas activas
          <br />
          en este bar ahora
        </h1>

        <p className="mt-6 text-center text-sm text-white/70">
          Tocá para ver quién está disponible ahora 😉
        </p>

        <button
          onClick={onClick}
          className="mt-6 w-full rounded-2xl py-4 text-lg font-bold bg-white text-neutral-950 hover:bg-white/90 transition"
        >
          Quiero verlos
        </button>

        {msg && <p className="mt-4 text-center text-sm text-red-300">{msg}</p>}

        <p className="mt-4 text-center text-xs text-white/50">
          Experimento universitario. No se guarda información personal.
        </p>
      </div>
    </main>
  );
}

export default function ScanQueryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950" />}>
      <ScanQueryContent />
    </Suspense>
  );
}
