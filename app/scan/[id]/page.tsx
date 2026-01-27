"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Avatar = {
  img: string;
};

function ScanContent({ id }: { id: string }) {
  const [clicked, setClicked] = useState(false);

  const searchParams = useSearchParams();
  const qrId = id;
  const venue = searchParams.get("venue") ?? "unknown";

  // Si querés, podés hacerlo dinámico por QR después
  const totalActive = 46;

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrId, venue]);

  const onClick = async () => {
    console.log("🔵 Click detectado, id:", id);
    setClicked(true);

    try {
      const url = `https://experiment-satt.onrender.com/api/btn/${id}`;
      console.log("🟡 GET request a:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      console.log("🟡 Status:", response.status);
      console.log("🟡 Ok:", response.ok);

      const data = await response.json();
      console.log("✅ Respuesta:", data);
    } catch (error) {
      console.error("❌ Error en GET:", error);
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

        {/* Avatares solapados */}
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
          disabled={clicked}
          className="mt-6 w-full rounded-2xl py-4 text-lg font-bold bg-white text-neutral-950 disabled:opacity-60 cursor-pointer disabled:cursor-default hover:bg-white/90 transition"
        >
          {clicked ? "Listo" : "Quiero verlos"}
        </button>

        <p className="mt-4 text-center text-xs text-white/50">
          Experimento universitario. No se guarda información personal.
        </p>

        {/* Debug opcional (sacalo en prod) */}
      </div>
    </main>
  );
}

export default function Scan({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950" />}>
      <ScanContent id={params.id} />
    </Suspense>
  );
}
