"use client";
export const dynamic = "force-dynamic";
import { useState, useMemo } from "react";
import Link from "next/link";
import { medicamentos as mockMedicamentos } from "@/lib/mock";

type Medicamento = {
  id: number;
  nombre: string;
  nombreGenerico: string;
  laboratorio: string;
  categoria: string;
  presentacion: string;
  concentracion: string;
  requiereReceta: boolean;
  precio: number;
  descripcion: string;
  codigoBarras: string;
  activo: boolean;
};

type FormData = Omit<Medicamento, "id">;

const emptyForm: FormData = {
  nombre: "",
  nombreGenerico: "",
  laboratorio: "",
  categoria: "",
  presentacion: "",
  concentracion: "",
  requiereReceta: false,
  precio: 0,
  descripcion: "",
  codigoBarras: "",
  activo: true,
};

const CATEGORIAS = [
  "Analgésico",
  "Antibiótico",
  "Antihipertensivo",
  "Antidiabético",
  "Antiinflamatorio",
  "Vitaminas",
  "Antihistamínico",
  "Otro",
];

const PRESENTACIONES = [
  "Tableta",
  "Cápsula",
  "Jarabe",
  "Inyectable",
  "Crema",
  "Gotas",
  "Supositorio",
  "Parche",
];

export default function MedicamentoPage() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>(mockMedicamentos);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [search, setSearch] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterReceta, setFilterReceta] = useState<"todos" | "si" | "no">("todos");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formError, setFormError] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (medicamentos ?? []).filter((m) => {
      const matchSearch =
        (m.nombre ?? "").toLowerCase().includes(q) ||
        (m.nombreGenerico ?? "").toLowerCase().includes(q) ||
        (m.laboratorio ?? "").toLowerCase().includes(q) ||
        (m.codigoBarras ?? "").toLowerCase().includes(q);
      const matchCategoria = filterCategoria === "" || m.categoria === filterCategoria;
      const matchReceta =
        filterReceta === "todos" ||
        (filterReceta === "si" && m.requiereReceta) ||
        (filterReceta === "no" && !m.requiereReceta);
      return matchSearch && matchCategoria && matchReceta;
    });
  }, [medicamentos, search, filterCategoria, filterReceta]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  }

  function openEdit(med: Medicamento) {
    setEditingId(med.id);
    const { id, ...rest } = med;
    setForm(rest);
    setFormError("");
    setShowForm(true);
  }

  function handleDelete(id: number) {
    setMedicamentos((prev) => (prev ?? []).filter((m) => m.id !== id));
    setDeleteConfirmId(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!(form.nombre ?? "").trim() || !(form.nombreGenerico ?? "").trim() || !(form.laboratorio ?? "").trim()) {
      setFormError("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (form.precio < 0) {
      setFormError("El precio no puede ser negativo.");
      return;
    }
    setFormError("");

    if (editingId !== null) {
      setMedicamentos((prev) =>
        (prev ?? []).map((m) => (m.id === editingId ? { ...form, id: editingId } : m))
      );
    } else {
      const newId = medicamentos?.length > 0 ? Math.max(...medicamentos.map((m) => m.id)) + 1 : 1;
      setMedicamentos((prev) => [...prev, { ...form, id: newId }]);
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "precio") {
      setForm((prev) => ({ ...prev, precio: parseFloat(value) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function toggleActivo(id: number) {
    setMedicamentos((prev) =>
      (prev ?? []).map((m) => (m.id === id ? { ...m, activo: !m.activo } : m))
    );
  }

  const totalActivos = (medicamentos ?? []).filter((m) => m.activo).length;
  const totalReceta = (medicamentos ?? []).filter((m) => m.requiereReceta).length;
  const precioPromedio =
    medicamentos?.length > 0
      ? (medicamentos ?? []).reduce((acc, m) => acc + m.precio, 0) / medicamentos?.length
      : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Inicio
              </Link>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-600 font-medium">Medicamentos</span>
            </nav>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </span>
              Gestión de Medicamentos
            </h1>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Medicamento
          </button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total registros</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{medicamentos?.length}</p>
            <p className="text-xs text-slate-400 mt-1">en catálogo</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Activos</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{totalActivos}</p>
            <p className="text-xs text-slate-400 mt-1">disponibles para venta</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Requieren receta</p>
            <p className="text-3xl font-bold text-amber-500 mt-1">{totalReceta}</p>
            <p className="text-xs text-slate-400 mt-1">con control médico</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Precio promedio</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">${precioPromedio.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-1">USD por unidad</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, genérico, laboratorio o código..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 bg-white min-w-[160px]"
            >
              <option value="">Todas las categorías</option>
              {(CATEGORIAS ?? []).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={filterReceta}
              onChange={(e) => setFilterReceta(e.target.value as "todos" | "si" | "no")}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 bg-white min-w-[140px]"
            >
              <option value="todos">Con/Sin receta</option>
              <option value="si">Requiere receta</option>
              <option value="no">Sin receta</option>
            </select>
            {(search || filterCategoria || filterReceta !== "todos") && (
              <button
                onClick={() => { setSearch(""); setFilterCategoria(""); setFilterReceta("todos"); }}
                className="text-sm text-slate-500 hover:text-slate-800 transition-colors px-2 whitespace-nowrap"
              >
                Limpiar filtros
              </button>
            )}
          </div>
          {filtered?.length !== medicamentos?.length && (
            <p className="text-xs text-slate-400 mt-2">
              Mostrando {filtered?.length} de {medicamentos?.length} medicamentos
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Medicamento</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Laboratorio</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Categoría</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Presentación</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Precio</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Receta</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Estado</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(filtered ?? []).map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-slate-900">{med.nombre}</p>
                        <p className="text-xs text-slate-500">{med.nombreGenerico} · {med.concentracion}</p>
                        <p className="text-xs text-slate-400 font-mono">{med.codigoBarras}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{med.laboratorio}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {med.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{med.presentacion}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900">${(med.precio ?? 0).toFixed(2)}</span>
                      <span className="text-xs text-slate-400 ml-1">USD</span>
                    </td>
                    <td className="px-4 py-3">
                      {med.requiereReceta ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Obligatoria
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                          Libre venta
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActivo(med.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                          med.activo
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                            : "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                        }`}
                        title="Clic para cambiar estado"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${med.activo ? "bg-emerald-500" : "bg-red-500"}`} />
                        {med.activo ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(med)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(med.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered?.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-slate-500 font-medium">No se encontraron medicamentos</p>
                        <p className="text-slate-400 text-xs">Prueba con otros filtros o crea un nuevo registro</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filtered?.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-400">
                {filtered?.length} {filtered?.length === 1 ? "medicamento" : "medicamentos"} en total
              </p>
            </div>
          )}
        </div>
      </main>

      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Eliminar medicamento</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Esta acción es permanente y eliminará el medicamento del catálogo. ¿Deseas continuar?
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {editingId !== null ? "Editar medicamento" : "Nuevo medicamento"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingId !== null ? "Actualiza los datos del medicamento" : "Completa los datos para agregar al catálogo"}
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
              {formError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Identificación</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nombre comercial <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Ej. Panadol"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nombre genérico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombreGenerico"
                      value={form.nombreGenerico}
                      onChange={handleChange}
                      required
                      placeholder="Ej. Paracetamol"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Laboratorio <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="laboratorio"
                      value={form.laboratorio}
                      onChange={handleChange}
                      required
                      placeholder="Ej. GlaxoSmithKline"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Código de barras
                    </label>
                    <input
                      type="text"
                      name="codigoBarras"
                      value={form.codigoBarras}
                      onChange={handleChange}
                      placeholder="Ej. 7501234567890"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-300 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Clasificación y formato</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Categoría <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="categoria"
                      value={form.categoria}
                      onChange={handleChange}
                      required
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-700"
                    >
                      <option value="">Seleccionar...</option>
                      {(CATEGORIAS ?? []).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Presentación <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="presentacion"
                      value={form.presentacion}
                      onChange={handleChange}
                      required
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-700"
                    >
                      <option value="">Seleccionar...</option>
                      {(PRESENTACIONES ?? []).map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Concentración <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="concentracion"
                      value={form.concentracion}
                      onChange={handleChange}
                      required
                      placeholder="Ej. 500mg"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Precio y control</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Precio (USD) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">$</span>
                      <input
                        type="number"
                        name="precio"
                        value={form.precio}
                        onChange={handleChange}
                        required
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                        className="w-full pl-7 pr-4 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-300"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pt-1">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="requiereReceta"
                          checked={form.requiereReceta}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-200 peer-checked:bg-amber-500 rounded-full transition-colors" />
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Requiere receta médica</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="activo"
                          checked={form.activo}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-200 peer-checked:bg-emerald-500 rounded-full transition-colors" />
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Medicamento activo</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Indicaciones, contraindicaciones, efectos secundarios, modo de uso..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-slate-300"
                />
              </div>
            </form>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex-shrink-0">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 bg-white rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  form=""
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
                >
                  {editingId !== null ? "Guardar cambios" : "Crear medicamento"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}