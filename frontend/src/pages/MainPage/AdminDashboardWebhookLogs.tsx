import { useEffect, useState } from "react";
import { AdminPageTemplate } from "../templates/AdminTemplate";
import type { WebhookLog } from "../../types/WebhookLog";
import ReactJsonPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";

export default function WebhookLogsPage() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventType, setEventType] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const params = new URLSearchParams({
        eventType,
        page: page.toString(),
        size: "10",
        sortBy: "receivedAt",
        direction: "desc",
      });

      const response = await fetch(`http://localhost:8080/api/webhook-logs?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener logs");

      const data = await response.json();
      setLogs(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [eventType, page]);

  return (
    <AdminPageTemplate>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-20 bg-[#2D2A32] text-[#e8e8e8]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Panel de Transacciones</h1>
            <p className="text-lg">Visualización de logs de webhook de Stripe</p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Filtrar por tipo de evento"
              value={eventType}
              onChange={(e) => {
                setPage(0);
                setEventType(e.target.value);
              }}
              className="px-4 py-2 border border-[#4ECCA3] rounded bg-transparent text-[#e8e8e8] w-full sm:w-1/2"
            />
          </div>

          {loading ? (
            <div className="text-center text-lg text-[#4ECCA3]">Cargando...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="bg-[#4ECCA320]/90 rounded-lg shadow-lg border-2 border-[#4ECCA3] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#4ECCA3]/50">
                  <thead className="bg-[#4ECCA3]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#2D2A32] uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#2D2A32] uppercase tracking-wider">Evento</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#2D2A32] uppercase tracking-wider">Payload</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#4ECCA320]/80 divide-y divide-[#a4ebd4]/30">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#4ECCA320] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(log.receivedAt).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{log.eventType}</td>
                        <td className="px-6 py-4 text-sm max-w-lg overflow-auto">
                          <div className="bg-[#1F1D24] p-2 rounded text-xs max-h-60 overflow-auto">
                            {(() => {
                              try {
                                const parsed = JSON.parse(log.rawPayload);
                                return <ReactJsonPretty data={parsed} />;
                              } catch {
                                return <pre>{log.rawPayload}</pre>;
                              }
                            })()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center px-6 py-4 bg-[#4ECCA3]/20 border-t border-[#4ECCA3]/50">
                <div className="text-sm text-[#e8e8e8]">
                  Página {page + 1} de {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                    disabled={page === 0}
                    className={`px-4 py-2 rounded-md font-semibold ${
                      page === 0
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-[#48e0af] text-[#294a3f] hover:bg-[#4ECCA3]"
                    } transition-colors`}
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                    disabled={page + 1 >= totalPages}
                    className={`px-4 py-2 rounded-md font-semibold ${
                      page + 1 >= totalPages
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-[#48e0af] text-[#294a3f] hover:bg-[#4ECCA3]"
                    } transition-colors`}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminPageTemplate>
  );
}
