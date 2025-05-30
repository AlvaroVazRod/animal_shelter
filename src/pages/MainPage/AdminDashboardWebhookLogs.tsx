import { useEffect, useState } from "react";
import { AdminPageTemplate } from "../templates/AdminTemplate";
import type { WebhookLog } from "../../types/WebhookLog";

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
            const params = new URLSearchParams({
                eventType,
                page: page.toString(),
                size: "10",
                sortBy: "receivedAt",
                direction: "desc",
            });

            const response = await fetch(`http://localhost:8080/api/webhook-logs?${params}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
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
            <div className="max-w-7xl mx-auto text-[#e8e8e8]">
                <h1 className="text-3xl font-bold mb-4">Logs de Webhook</h1>

                <div className="mb-4 flex gap-4">
                    <input
                        type="text"
                        placeholder="Filtrar por tipo de evento"
                        value={eventType}
                        onChange={(e) => {
                            setPage(0);
                            setEventType(e.target.value);
                        }}
                        className="px-4 py-2 border border-[#4ECCA3] rounded bg-transparent text-[#e8e8e8]"
                    />
                </div>

                {loading ? (
                    <p>Cargando...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="overflow-x-auto bg-[#4ECCA320]/90 rounded-lg shadow-lg border border-[#4ECCA3]">
                        <table className="min-w-full divide-y divide-[#4ECCA3]/50">
                            <thead className="bg-[#4ECCA3]">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-[#2D2A32]">Fecha</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-[#2D2A32]">Tipo de Evento</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-[#2D2A32]">Payload</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#a4ebd4]/30">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-[#4ECCA320]">
                                        <td className="px-4 py-2 whitespace-nowrap">{new Date(log.receivedAt).toLocaleString()}</td>
                                        <td className="px-4 py-2">{log.eventType}</td>
                                        <td className="px-4 py-2 text-sm break-all max-w-xs overflow-auto">
                                            <pre className="whitespace-pre-wrap">{log.payload}</pre>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-4 flex justify-between items-center">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                        disabled={page === 0}
                        className="bg-[#4ECCA3] text-black px-4 py-2 rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span>Página {page + 1} de {totalPages}</span>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                        disabled={page + 1 >= totalPages}
                        className="bg-[#4ECCA3] text-black px-4 py-2 rounded disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </AdminPageTemplate>
    );
}
