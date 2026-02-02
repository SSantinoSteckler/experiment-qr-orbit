"use client";

import { useEffect, useState } from "react";

interface Stats {
  total?: number;
}

interface DetailedQRStats {
  scans: number;
  clicks: number;
  clicksType1: number;
  clicksType2: number;
  percentage: number;
  percentageType1: number;
  percentageType2: number;
}

interface BtnStats {
  total?: number;
  type1?: number;
  type2?: number;
}

export default function DashboardPage() {
  const [totalScans, setTotalScans] = useState<number | null>(null);
  const [totalClicks, setTotalClicks] = useState<number | null>(null);
  const [totalClicksType1, setTotalClicksType1] = useState<number | null>(null);
  const [totalClicksType2, setTotalClicksType2] = useState<number | null>(null);
  const [globalPercentage, setGlobalPercentage] = useState<number | null>(null);
  const [globalPercentageType1, setGlobalPercentageType1] = useState<
    number | null
  >(null);
  const [globalPercentageType2, setGlobalPercentageType2] = useState<
    number | null
  >(null);
  const [qrStats, setQrStats] = useState<{ [key: number]: DetailedQRStats }>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrId, setQrId] = useState("");

  const parseClicks = (data: BtnStats | unknown) => {
    const d = (data || {}) as BtnStats;
    const type1 = typeof d.type1 === "number" ? d.type1 : 0;
    const type2 = typeof d.type2 === "number" ? d.type2 : 0;
    if (typeof d.total === "number") {
      return { total: d.total, type1, type2 };
    }
    return { total: type1 + type2, type1, type2 };
  };

  // Fetch estadísticas globales
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [scansRes, clicksRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/btn-stats"),
        ]);

        if (!scansRes.ok || !clicksRes.ok) {
          throw new Error("Error fetching stats");
        }

        const scansData: Stats = await scansRes.json();
        const clicksData: BtnStats = await clicksRes.json();

        const scans = scansData.total || 0;
        const {
          total: clicks,
          type1: clicksType1,
          type2: clicksType2,
        } = parseClicks(clicksData);

        const percentage = scans > 0 ? (clicks / scans) * 100 : 0;
        const percentageType1 = scans > 0 ? (clicksType1 / scans) * 100 : 0;
        const percentageType2 = scans > 0 ? (clicksType2 / scans) * 100 : 0;

        setTotalScans(scans);
        setTotalClicks(clicks);
        setTotalClicksType1(clicksType1);
        setTotalClicksType2(clicksType2);
        setGlobalPercentage(percentage);
        setGlobalPercentageType1(percentageType1);
        setGlobalPercentageType2(percentageType2);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setTotalScans(null);
        setTotalClicks(null);
        setGlobalPercentage(null);
        setTotalClicksType1(null);
        setTotalClicksType2(null);
        setGlobalPercentageType1(null);
        setGlobalPercentageType2(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refrescar cada 30 segundos
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch estadísticas de un QR específico
  const handleSearchQr = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!qrId.trim()) {
      setError("Por favor ingresa un ID de QR");
      return;
    }

    try {
      const [scansRes, clicksRes] = await Promise.all([
        fetch(`/api/stats/${qrId}`),
        fetch(`/api/btn-stats/${qrId}`),
      ]);

      if (!scansRes.ok || !clicksRes.ok) {
        throw new Error("QR no encontrado");
      }

      const scansData: Stats = await scansRes.json();
      const clicksData: BtnStats = await clicksRes.json();

      const scans = scansData.total || 0;
      const {
        total: clicks,
        type1: clicksType1,
        type2: clicksType2,
      } = parseClicks(clicksData);

      const percentage = scans > 0 ? (clicks / scans) * 100 : 0;
      const percentageType1 = scans > 0 ? (clicksType1 / scans) * 100 : 0;
      const percentageType2 = scans > 0 ? (clicksType2 / scans) * 100 : 0;

      setQrStats({
        ...qrStats,
        [Number(qrId)]: {
          scans,
          clicks,
          clicksType1,
          clicksType2,
          percentage,
          percentageType1,
          percentageType2,
        },
      });
      setError(null);
      setQrId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar QR");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Monitorea estadísticas de escaneos QR</p>
        </div>

        {/* Tarjeta de estadísticas globales */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Estadísticas Globales
          </h2>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-lg text-gray-500">Cargando...</div>
            </div>
          ) : error && totalScans === null ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="text-sm font-medium opacity-90">
                  Escaneos Totales
                </div>
                <div className="text-4xl font-bold mt-2">{totalScans}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="text-sm font-medium opacity-90">
                  Clicks Totales
                </div>
                <div className="text-4xl font-bold mt-2">{totalClicks}</div>
                <div className="text-xs opacity-90 mt-3">
                  <div>
                    Type1: {totalClicksType1 ?? 0} (
                    {globalPercentageType1?.toFixed(1) ?? "0"}%)
                  </div>
                  <div>
                    Type2: {totalClicksType2 ?? 0} (
                    {globalPercentageType2?.toFixed(1) ?? "0"}%)
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <div className="text-sm font-medium opacity-90">
                  Tasa de Conversión
                </div>
                <div className="text-4xl font-bold mt-2">
                  {globalPercentage?.toFixed(1)}%
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="text-sm font-medium opacity-90">
                  Última Actualización
                </div>
                <div className="text-lg font-bold mt-2">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Búsqueda de QR específico */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Buscar QR Específico
          </h2>

          <form onSubmit={handleSearchQr} className="flex gap-4 mb-6">
            <input
              type="number"
              value={qrId}
              onChange={(e) => setQrId(e.target.value)}
              placeholder="Ingresa el ID del QR"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Buscar
            </button>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
              {error}
            </div>
          )}

          {/* Resultados de búsqueda */}
          {Object.keys(qrStats).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Resultados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(qrStats).map(([id, stats]) => (
                  <div
                    key={id}
                    className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6"
                  >
                    <div className="text-sm font-semibold text-gray-700 mb-4">
                      QR ID: {id}
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Escaneos:</span>
                        <span className="text-2xl font-bold text-indigo-600">
                          {stats.scans}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Clicks:</span>
                        <span className="text-2xl font-bold text-green-600">
                          {stats.clicks}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-white/20 rounded p-2">
                          <div className="text-xs text-gray-600">Type1</div>
                          <div className="text-lg font-bold text-indigo-600">
                            {stats.clicksType1}
                          </div>
                          <div className="text-xs text-gray-500">
                            {stats.percentageType1.toFixed(1)}%
                          </div>
                        </div>
                        <div className="bg-white/20 rounded p-2">
                          <div className="text-xs text-gray-600">Type2</div>
                          <div className="text-lg font-bold text-indigo-600">
                            {stats.clicksType2}
                          </div>
                          <div className="text-xs text-gray-500">
                            {stats.percentageType2.toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-white rounded p-2 mt-3">
                        <span className="text-sm text-gray-600">
                          Conversión:
                        </span>
                        <span className="text-2xl font-bold text-orange-600">
                          {stats.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          <p>Los datos se actualizan automáticamente cada 30 segundos</p>
        </div>
      </div>
    </div>
  );
}
