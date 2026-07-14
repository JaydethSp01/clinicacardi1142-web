"use client";
export const dynamic = "force-dynamic";
import { useState, useMemo } from "react";
import Link from "next/link";
import { recetas as mockRecetas } from "@/lib/mock";

type EstadoReceta = "pendiente" | "dispensada" | "cancelada" | "vencida";

interface RecetaItem {
  medicamentoId: string;
  medicamentoNombre: string;
  cantidad: number;
  dosis: string;
  frecuencia: string;
  duracion: string;
  precio: number;
}

interface Receta {
  id: string;
  codigoReceta: string;
  pacienteId: string;
  pacienteNombre: string;
  medicoId: string;
  medicoNombre: string;
  farmaceuticoId: string;
  farmaceuticoNombre: string;
  items: RecetaItem[];
  estado: EstadoReceta;
  diagnostico: string;
  fechaEmision: string;
  fechaVencimiento: string;
  fechaDispensacion: string | null;
  observaciones: string;
  totalEstimado: number;
}

const estadoConfig: Record<EstadoReceta, { label: string; bg: string }> = {
  pendiente:  { label: "Pendiente",  bg: "bg-yellow-100 text-yellow-800 ring-yellow-200" },
  dispensada: { label: "Dispensada", bg: "bg-green-100 text-green-800 ring-green-200"   },
  cancelada:  { label: "Cancelada",  bg: "bg-red-100 text-red-800 ring-red-200"         },
  vencida:    { label: "Vencida",    bg: "bg-gray-100 text-gray-600 ring-gray-200"      },
};

const emptyForm: Omit<Receta, "id"> = {
  codigoReceta:       "",
  pacienteId:         "",
  pacienteNombre:     "",
  medicoId:           "",
  medicoNombre:       "",
  farmaceuticoId:     "",
  farmaceuticoNombre: "",
  items:              [],
  estado:             "pendiente",
  diagnostico:        "",
  fechaEmision:       new Date().toISOString().split("T")[0],
  fechaVencimiento:   "",
  fechaDispensacion:  null,
  observaciones:      "",
  totalEstimado:      0,
};

export default function RecetaPage() {
  const [recetas, setRecetas]               = useState<Receta[]>(mockRecetas as Receta[]);
  const [searchTerm, setSearchTerm]         = useState("");
  const [filterEstado, setFilterEstado]     = useState("todos");
  const [showModal, setShowModal]           = useState(false);
  const [editingId, setEditingId]           = useState<string | null>(null);
  const [form, setForm]                     = useState<Omit<Receta, "id">>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [itemsModal, setItemsModal]         = useState<Receta | null>(null);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return (recetas ?? []).filter((r) => {
      const matchQ =
        !q ||
        (r.codigoReceta ?? "").toLowerCase().includes(q) ||
        (r.pacienteNombre ?? "").toLowerCase().includes(q) ||
        (r.medicoNombre ?? "").toLowerCase().includes(q) ||
        (r.diagnostico ?? "").toLowerCase().includes(q);
      const matchE = filterEstado === "todos" || r.estado === filterEstado;
      return matchQ && matchE;
    });
  }, [recetas, searchTerm, filterEstado]);

  const stats = useMemo(() => ({
    total:      recetas?.length,
    pendientes: (recetas ?? []).filter((r) => r.estado === "pendiente").length,
    dispensadas:(recetas ?? []).filter((r) => r.estado === "dispensada").length,
    vencidas:   (recetas ?? []).filter((r) => r.estado === "vencida").length,
  }), [recetas]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (r: Receta) => {
    setEditingId(r.id);
    setForm({
      codigoReceta:       r.codigoReceta,
      pacienteId:         r.pacienteId,
      pacienteNombre:     r.pacienteNombre,
      medicoId:           r.medicoId,
      medicoNombre:       r.medicoNombre,
      farmaceuticoId:     r.farmaceuticoId,
      farmaceuticoNombre: r.farmaceuticoNombre,
      items:              r.items,
      estado:             r.estado,
      diagnostico:        r.diagnostico,
      fechaEmision:       r.fechaEmision,
      fechaVencimiento:   r.fechaVencimiento,
      fechaDispensacion:  r.fechaDispensacion,
      observaciones:      r.observaciones,
      totalEstimado:      r.totalEstimado,
    });
    setShowModal(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const set = (field: keyof Omit<Receta, "id" | "items">, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!(form.codigoReceta ?? "").trim() || !(form.pacienteNombre ?? "").trim() || !(form.medicoNombre ?? "").trim()) return;
    if (editingId) {
      setRecetas((prev) => (prev ?? []).map((r) => (r.id === editingId ? { ...form, id: editingId } : r)));
    } else {
      setRecetas((prev) => [...prev, { ...form, id: `rec-${Date.now()}` }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setRecetas((prev) => (prev ?? []).filter((r) => r.id !== id));
    setDeleteConfirmId(null);
  };

  const isFormValid = (form.codigoReceta ?? "").trim() && (form.pacienteNombre ?? "").trim() && (form.medicoNombre ?? "").trim();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ───── Topbar ───── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium transition">
              Dashboard
            </Link>
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-semibold text-slate-800">Recetas Médicas</span>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Receta
          </button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-8 space-y-6">

        {/* ───── Stats ───── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Recetas",  value: stats.total,       color: "text-slate-900",   icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
            { label: "Pendientes",     value: stats.pendientes,  color: "text-yellow-600",  icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "Dispensadas",    value: stats.dispensadas, color: "text-green-600",   icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "Vencidas",       value: stats.vencidas,    color: "text-slate-500",   icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
              <div className={`w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center ${color}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ───── Filters ───── */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3 shadow-sm">
          <div className="relative flex-1">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por código, paciente, médico o diagnóstico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="dispensada">Dispensada</option>
            <option value="cancelada">Cancelada</option>
            <option value="vencida">Vencida</option>
          </select>
        </div>

        {/* ───── Table ───── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                  {["Código", "Paciente", "Médico", "Farmacéutico", "Diagnóstico", "Emisión", "Vencimiento", "Dispensación", "Estado", "Total", "Ítems", "Acciones"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered?.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-6 py-16 text-center text-slate-400 text-sm">
                      <svg className="w-10 h-10 mx-auto mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      No se encontraron recetas con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  (filtered ?? []).map((r) => {
                    const cfg = estadoConfig[r.estado] ?? { label: r.estado, bg: "bg-slate-100 text-slate-600 ring-slate-200" };
                    return (
                      <tr key={r.id} className="hover:bg-slate-50 transition group">
                        <td className="px-4 py-3 font-mono font-semibold text-blue-700 whitespace-nowrap">
                          {r.codigoReceta}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="font-medium text-slate-900">{r.pacienteNombre}</p>
                          <p className="text-xs text-slate-400">{r.pacienteId}</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="font-medium text-slate-800">{r.medicoNombre}</p>
                          <p className="text-xs text-slate-400">{r.medicoId}</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                          {r.farmaceuticoNombre ? (
                            <>
                              <p>{r.farmaceuticoNombre}</p>
                              <p className="text-xs text-slate-400">{r.farmaceuticoId}</p>
                            </>
                          ) : (
                            <span className="text-slate-300 italic text-xs">No asignado</span>
                          )}
                        </td>
                        <td className="px-4 py-3 max-w-[160px]">
                          <p className="truncate text-slate-700" title={r.diagnostico}>{r.diagnostico}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{r.fechaEmision}</td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{r.fechaVencimiento}</td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                          {r.fechaDispensacion ?? <span className="text-slate-300 italic text-xs">—</span>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${cfg.bg}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                          S/ {(r.totalEstimado ?? 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => setItemsModal(r)}
                            className="text-blue-600 hover:text-blue-800 text-xs underline font-medium transition"
                          >
                            {r.items?.length} ítem{r.items?.length !== 1 ? "s" : ""}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEdit(r)}
                              title="Editar receta"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(r.id)}
                              title="Eliminar receta"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-400 flex justify-between items-center">
            <span>Mostrando <strong className="text-slate-600">{filtered?.length}</strong> de <strong className="text-slate-600">{recetas?.length}</strong> recetas</span>
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════
          MODAL CREAR / EDITAR
      ═══════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? "Editar Receta" : "Nueva Receta"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingId ? "Modifica los campos y guarda los cambios." : "Completa los campos obligatorios para registrar la receta."}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">

              {/* Identificación */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Identificación</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Código Receta *</label>
                    <input
                      type="text"
                      value={form.codigoReceta}
                      onChange={(e) => set("codigoReceta", e.target.value)}
                      placeholder="REC-2026-001"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Estado</label>
                    <select
                      value={form.estado}
                      onChange={(e) => set("estado", e.target.value as EstadoReceta)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="dispensada">Dispensada</option>
                      <option value="cancelada">Cancelada</option>
                      <option value="vencida">Vencida</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Paciente */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Paciente</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">ID Paciente *</label>
                    <input
                      type="text"
                      value={form.pacienteId}
                      onChange={(e) => set("pacienteId", e.target.value)}
                      placeholder="PAC-001"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Nombre Paciente *</label>
                    <input
                      type="text"
                      value={form.pacienteNombre}
                      onChange={(e) => set("pacienteNombre", e.target.value)}
                      placeholder="Juan Pérez García"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </section>

              {/* Médico */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Médico Tratante</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">ID Médico *</label>
                    <input
                      type="text"
                      value={form.medicoId}
                      onChange={(e) => set("medicoId", e.target.value)}
                      placeholder="MED-001"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Nombre Médico *</label>
                    <input
                      type="text"
                      value={form.medicoNombre}
                      onChange={(e) => set("medicoNombre", e.target.value)}
                      placeholder="Dra. María López"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </section>

              {/* Farmacéutico */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Farmacéutico Responsable</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">ID Farmacéutico</label>
                    <input
                      type="text"
                      value={form.farmaceuticoId}
                      onChange={(e) => set("farmaceuticoId", e.target.value)}
                      placeholder="FARM-001"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Nombre Farmacéutico</label>
                    <input
                      type="text"
                      value={form.farmaceuticoNombre}
                      onChange={(e) => set("farmaceuticoNombre", e.target.value)}
                      placeholder="Carlos Ruiz Mena"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </section>

              {/* Clínica */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Información Clínica</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Diagnóstico *</label>
                    <input
                      type="text"
                      value={form.diagnostico}
                      onChange={(e) => set("diagnostico", e.target.value)}
                      placeholder="Hipertensión arterial esencial (I10)"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Observaciones</label>
                    <textarea
                      value={form.observaciones}
                      onChange={(e) => set("observaciones", e.target.value)}
                      rows={3}
                      placeholder="Indicaciones adicionales, alergias conocidas, interacciones a vigilar..."
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* Fechas */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Fechas</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Emisión *</label>
                    <input
                      type="date"
                      value={form.fechaEmision}
                      onChange={(e) => set("fechaEmision", e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Vencimiento *</label>
                    <input
                      type="date"
                      value={form.fechaVencimiento}
                      onChange={(e) => set("fechaVencimiento", e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Dispensación</label>
                    <input
                      type="date"
                      value={form.fechaDispensacion ?? ""}
                      onChange={(e) => set("fechaDispensacion", e.target.value || null)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </section>

              {/* Total */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Valorización</h3>
                <div className="max-w-[220px]">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Total Estimado (S/)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">S/</span>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={form.totalEstimado}
                      onChange={(e) => set("totalEstimado", parseFloat(e.target.value) || 0)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-between gap-3">
              <p className="text-xs text-slate-400">* Campos obligatorios</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isFormValid}
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition shadow-sm"
                >
                  {editingId ? "Guardar cambios" : "Crear receta"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          MODAL ÍTEMS
      ═══════════════════════════════════════════════════ */}
      {itemsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Medicamentos Recetados</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {itemsModal.codigoReceta} &mdash; {itemsModal.pacienteNombre}
                </p>
              </div>
              <button onClick={() => setItemsModal(null)} className="text-slate-400 hover:text-slate-600 transition mt-0.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-3">
              {itemsModal.items?.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">Sin ítems registrados en esta receta.</p>
              ) : (
                (itemsModal.items ?? []).map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{item.medicamentoNombre}</p>
                        <p className="text-xs text-slate-400">{item.medicamentoId}</p>
                      </div>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 ring-1 ring-blue-100 px-2.5 py-0.5 rounded-full">
                        S/ {(item.precio ?? 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
                      <span><span className="font-medium text-slate-700">Cantidad:</span> {item.cantidad}</span>
                      <span><span className="font-medium text-slate-700">Dosis:</span> {item.dosis}</span>
                      <span><span className="font-medium text-slate-700">Frecuencia:</span> {item.frecuencia}</span>
                      <span><span className="font-medium text-slate-700">Duración:</span> {item.duracion}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-between items-center">
              <p className="text-sm">
                <span className="text-slate-500">Total estimado: </span>
                <span className="font-bold text-blue-700">S/ {(itemsModal.totalEstimado ?? 0).toFixed(2)}</span>
              </p>
              <button
                onClick={() => setItemsModal(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-white transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          MODAL CONFIRMAR ELIMINAR
      ═══════════════════════════════════════════════════ */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Eliminar receta</h3>
                <p className="text-sm text-slate-500">Esta acción no se puede deshacer.</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              ¿Confirmas que deseas eliminar esta receta? Todos los datos asociados serán eliminados permanentemente del sistema.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}