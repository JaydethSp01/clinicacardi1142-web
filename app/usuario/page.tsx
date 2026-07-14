"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { usuarios as usuariosMock } from "@/lib/mock";

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  telefono: string;
  cedula: string;
  activo: boolean;
  creadoEn: string;
}

type FormData = Omit<Usuario, "id" | "creadoEn">;

const ROLES = ["Administrador", "Médico", "Farmacéutico", "Paciente", "Enfermero"];

const emptyForm: FormData = {
  nombre: "",
  apellido: "",
  email: "",
  rol: "Paciente",
  telefono: "",
  cedula: "",
  activo: true,
};

const rolColors: Record<string, string> = {
  Administrador: "bg-purple-100 text-purple-800",
  Médico: "bg-blue-100 text-blue-800",
  Farmacéutico: "bg-emerald-100 text-emerald-800",
  Paciente: "bg-amber-100 text-amber-800",
  Enfermero: "bg-pink-100 text-pink-800",
};

export default function UsuarioPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosMock);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filtroRol, setFiltroRol] = useState("Todos");

  const filtrados = (usuarios ?? []).filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      (u.nombre ?? "").toLowerCase().includes(q) ||
      (u.apellido ?? "").toLowerCase().includes(q) ||
      (u.email ?? "").toLowerCase().includes(q) ||
      (u.cedula ?? "").toLowerCase().includes(q) ||
      (u.rol ?? "").toLowerCase().includes(q);
    const matchRol = filtroRol === "Todos" || u.rol === filtroRol;
    return matchSearch && matchRol;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setUsuarios((prev) =>
        (prev ?? []).map((u) => (u.id === editingId ? { ...u, ...form } : u))
      );
    } else {
      const nuevo: Usuario = {
        id: `USR-${Date.now()}`,
        ...form,
        creadoEn: new Date().toISOString().split("T")[0],
      };
      setUsuarios((prev) => [nuevo, ...prev]);
    }
    resetForm();
  };

  const handleEdit = (u: Usuario) => {
    setEditingId(u.id);
    setForm({
      nombre: u.nombre,
      apellido: u.apellido,
      email: u.email,
      rol: u.rol,
      telefono: u.telefono,
      cedula: u.cedula,
      activo: u.activo,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setUsuarios((prev) => (prev ?? []).filter((u) => u.id !== id));
    setDeleteConfirm(null);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const totalActivos = (usuarios ?? []).filter((u) => u.activo).length;
  const totalInactivos = (usuarios ?? []).filter((u) => !u.activo).length;
  const rolesUnicos = new Set((usuarios ?? []).map((u) => u.rol)).size;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Usuarios</h1>
            <p className="text-sm text-slate-500 mt-0.5">Administra el personal y pacientes del sistema hospitalario</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Usuarios", value: usuarios?.length, icon: "👤", color: "text-blue-700", bg: "bg-blue-50 border-blue-100" },
            { label: "Activos", value: totalActivos, icon: "✅", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
            { label: "Inactivos", value: totalInactivos, icon: "🔴", color: "text-rose-700", bg: "bg-rose-50 border-rose-100" },
            { label: "Roles distintos", value: rolesUnicos, icon: "🏷️", color: "text-violet-700", bg: "bg-violet-50 border-violet-100" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border rounded-2xl p-4 flex items-center gap-4`}>
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{s.label}</p>
                <p className={`text-3xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, email, cédula o rol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
            />
          </div>
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
          >
            <option value="Todos">Todos los roles</option>
            {(ROLES ?? []).map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Usuario</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Cédula</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Teléfono</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Rol</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Estado</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Registrado</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtrados?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400">
                      <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="font-medium">No se encontraron usuarios</p>
                      <p className="text-xs mt-1">Intenta ajustar los filtros de búsqueda</p>
                    </td>
                  </tr>
                ) : (
                  (filtrados ?? []).map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                            {(u.nombre ?? "").charAt(0)}{(u.apellido ?? "").charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{u.nombre} {u.apellido}</p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 font-mono text-xs tracking-wide">{u.cedula}</td>
                      <td className="px-5 py-3.5 text-slate-700">{u.telefono}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${rolColors[u.rol] ?? "bg-slate-100 text-slate-700"}`}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${u.activo ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.activo ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {u.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">{u.creadoEn}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(u)}
                            title="Editar usuario"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(u.id)}
                            title="Eliminar usuario"
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Mostrando <span className="font-semibold text-slate-700">{filtrados?.length}</span> de <span className="font-semibold text-slate-700">{usuarios?.length}</span> usuarios</span>
            <span className="text-slate-400">ID sistema: {filtrados[0]?.id.split("-")[0] ?? "—"}</span>
          </div>
        </div>
      </div>

      {/* Modal: Crear / Editar */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? "Editar Usuario" : "Nuevo Usuario"}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {editingId ? "Actualiza la información del usuario" : "Completa los datos para registrar un usuario"}
                </p>
              </div>
              <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Juan"
                    className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Apellido *</label>
                  <input
                    type="text"
                    required
                    value={form.apellido}
                    onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                    placeholder="Pérez"
                    className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="juan.perez@hospital.com"
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Cédula *</label>
                  <input
                    type="text"
                    required
                    value={form.cedula}
                    onChange={(e) => setForm({ ...form, cedula: e.target.value })}
                    placeholder="1234567890"
                    className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Teléfono *</label>
                  <input
                    type="tel"
                    required
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder="+593 99 123 4567"
                    className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Rol *</label>
                <select
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-700"
                >
                  {(ROLES ?? []).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Estado del usuario</p>
                  <p className="text-xs text-slate-400 mt-0.5">{form.activo ? "El usuario puede iniciar sesión" : "El acceso está bloqueado"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, activo: !form.activo })}
                  className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${form.activo ? "bg-blue-600" : "bg-slate-300"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${form.activo ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  {editingId ? "Guardar Cambios" : "Crear Usuario"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar eliminación */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-14 h-14 bg-rose-100 rounded-full mx-auto mb-4">
              <svg className="w-7 h-7 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-center text-lg font-bold text-slate-900 mb-1">¿Eliminar usuario?</h3>
            <p className="text-center text-sm text-slate-500 mb-6 leading-relaxed">
              Esta acción es permanente. El usuario perderá todo acceso al sistema y sus datos serán removidos.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}