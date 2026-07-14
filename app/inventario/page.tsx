"use client";
export const dynamic = "force-dynamic";
import { useState, useMemo } from 'react'
import { inventario as inventarioMock } from '@/lib/mock'

interface Inventario {
  id: string
  medicamentoId: string
  medicamentoNombre: string
  lote: string
  cantidad: number
  cantidadMinima: number
  fechaVencimiento: string
  fechaIngreso: string
  ubicacion: string
  estado: string
  proveedorNombre: string
  costoUnitario: number
}

type FormData = Omit<Inventario, 'id'>

const estadoBadge: Record<string, string> = {
  activo: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  bajo_stock: 'bg-amber-100 text-amber-700 border border-amber-200',
  vencido: 'bg-red-100 text-red-700 border border-red-200',
  agotado: 'bg-gray-100 text-gray-600 border border-gray-200',
  inactivo: 'bg-slate-100 text-slate-500 border border-slate-200',
}

const estadoLabel: Record<string, string> = {
  activo: 'Activo',
  bajo_stock: 'Bajo Stock',
  vencido: 'Vencido',
  agotado: 'Agotado',
  inactivo: 'Inactivo',
}

const FORM_INICIAL: FormData = {
  medicamentoId: '',
  medicamentoNombre: '',
  lote: '',
  cantidad: 0,
  cantidadMinima: 10,
  fechaVencimiento: '',
  fechaIngreso: new Date().toISOString().split('T')[0],
  ubicacion: '',
  estado: 'activo',
  proveedorNombre: '',
  costoUnitario: 0,
}

export default function InventarioPage() {
  const [registros, setRegistros] = useState<Inventario[]>(inventarioMock as Inventario[])
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [modalVisible, setModalVisible] = useState(false)
  const [esEdicion, setEsEdicion] = useState(false)
  const [idActivo, setIdActivo] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(FORM_INICIAL)
  const [pendienteEliminar, setPendienteEliminar] = useState<string | null>(null)

  const registrosFiltrados = useMemo(() => {
    return (registros ?? []).filter((r) => {
      const texto = busqueda.toLowerCase()
      const coincide =
        (r.medicamentoNombre ?? "").toLowerCase().includes(texto) ||
        (r.lote ?? "").toLowerCase().includes(texto) ||
        (r.proveedorNombre ?? "").toLowerCase().includes(texto) ||
        (r.ubicacion ?? "").toLowerCase().includes(texto)
      const coincideEstado = filtroEstado === 'todos' || r.estado === filtroEstado
      return coincide && coincideEstado
    })
  }, [registros, busqueda, filtroEstado])

  const stats = useMemo(() => ({
    total: registros?.length,
    unidades: (registros ?? []).reduce((s, r) => s + r.cantidad, 0),
    bajoStock: (registros ?? []).filter((r) => r.cantidad <= r.cantidadMinima).length,
    valorTotal: (registros ?? []).reduce((s, r) => s + r.cantidad * r.costoUnitario, 0),
  }), [registros])

  const abrirCrear = () => {
    setForm(FORM_INICIAL)
    setEsEdicion(false)
    setIdActivo(null)
    setModalVisible(true)
  }

  const abrirEditar = (r: Inventario) => {
    const { id, ...resto } = r
    setForm(resto)
    setEsEdicion(true)
    setIdActivo(id)
    setModalVisible(true)
  }

  const cerrarModal = () => {
    setModalVisible(false)
    setIdActivo(null)
    setForm(FORM_INICIAL)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const guardar = (e: React.FormEvent) => {
    e.preventDefault()
    if (esEdicion && idActivo) {
      setRegistros((prev) =>
        (prev ?? []).map((r) => (r.id === idActivo ? { id: idActivo, ...form } : r))
      )
    } else {
      setRegistros((prev) => [{ id: `inv-${Date.now()}`, ...form }, ...prev])
    }
    cerrarModal()
  }

  const ejecutarEliminar = () => {
    if (pendienteEliminar) {
      setRegistros((prev) => (prev ?? []).filter((r) => r.id !== pendienteEliminar))
      setPendienteEliminar(null)
    }
  }

  const getBadge = (estado: string) =>
    estadoBadge[estado] ?? 'bg-gray-100 text-gray-600 border border-gray-200'

  const getLabel = (estado: string) => estadoLabel[estado] ?? estado

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventario de Medicamentos</h1>
          <p className="mt-0.5 text-sm text-slate-500">Control de stock, lotes y ubicaciones en tiempo real</p>
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Registro
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Productos</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{stats.total}</p>
          <p className="mt-0.5 text-xs text-slate-400">registros totales</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Unidades</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">{(stats.unidades ?? 0).toLocaleString('es-MX')}</p>
          <p className="mt-0.5 text-xs text-slate-400">en inventario total</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bajo Stock</p>
          <p className={`mt-1 text-2xl font-bold ${stats.bajoStock > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {stats.bajoStock}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">productos críticos</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Valor Total</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">
            ${(stats.valorTotal ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">costo del inventario</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por medicamento, lote, proveedor o ubicación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="bajo_stock">Bajo Stock</option>
          <option value="vencido">Vencido</option>
          <option value="agotado">Agotado</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <span className="whitespace-nowrap text-xs text-slate-500">
          {registrosFiltrados?.length} de {registros?.length} registros
        </span>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Medicamento</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Lote</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Cantidad</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Mín.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Vencimiento</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Ingreso</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Ubicación</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Proveedor</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Costo Unit.</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Estado</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registrosFiltrados?.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-14 text-center">
                    <svg className="mx-auto mb-3 h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm font-medium text-slate-400">No se encontraron registros</p>
                    <p className="mt-0.5 text-xs text-slate-300">Intenta con otros filtros o crea un nuevo registro</p>
                  </td>
                </tr>
              ) : (
                (registrosFiltrados ?? []).map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{r.medicamentoNombre}</p>
                      <p className="text-xs text-slate-400">{r.medicamentoId}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{r.lote}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${r.cantidad <= r.cantidadMinima ? 'text-amber-600' : 'text-slate-800'}`}>
                        {(r.cantidad ?? 0).toLocaleString('es-MX')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">{r.cantidadMinima}</td>
                    <td className="px-4 py-3 text-slate-600">{r.fechaVencimiento}</td>
                    <td className="px-4 py-3 text-slate-600">{r.fechaIngreso}</td>
                    <td className="px-4 py-3 text-slate-600">{r.ubicacion}</td>
                    <td className="px-4 py-3 text-slate-600">{r.proveedorNombre}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700">
                      ${(r.costoUnitario ?? 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getBadge(r.estado)}`}>
                        {getLabel(r.estado)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => abrirEditar(r)}
                          title="Editar registro"
                          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setPendienteEliminar(r.id)}
                          title="Eliminar registro"
                          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>

      {/* Modal Crear / Editar */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {esEdicion ? 'Editar Registro de Inventario' : 'Nuevo Registro de Inventario'}
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  {esEdicion ? 'Modifica los datos del registro seleccionado' : 'Completa el formulario para agregar un nuevo producto'}
                </p>
              </div>
              <button
                onClick={cerrarModal}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={guardar} className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Nombre del Medicamento <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="medicamentoNombre"
                    value={form.medicamentoNombre}
                    onChange={handleChange}
                    placeholder="Ej. Paracetamol 500mg"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    ID Medicamento <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="medicamentoId"
                    value={form.medicamentoId}
                    onChange={handleChange}
                    placeholder="MED-001"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Número de Lote <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="lote"
                    value={form.lote}
                    onChange={handleChange}
                    placeholder="LOT-2025-001"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Cantidad <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    min={0}
                    name="cantidad"
                    value={form.cantidad}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Cantidad Mínima <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    min={0}
                    name="cantidadMinima"
                    value={form.cantidadMinima}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Fecha de Vencimiento <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="date"
                    name="fechaVencimiento"
                    value={form.fechaVencimiento}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Fecha de Ingreso <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="date"
                    name="fechaIngreso"
                    value={form.fechaIngreso}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Ubicación en Farmacia <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="ubicacion"
                    value={form.ubicacion}
                    onChange={handleChange}
                    placeholder="Ej. Estante A-3, Refrigerador 2"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Proveedor <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="proveedorNombre"
                    value={form.proveedorNombre}
                    onChange={handleChange}
                    placeholder="Laboratorios ABC S.A."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Costo Unitario (MXN) <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    min={0}
                    step={0.01}
                    name="costoUnitario"
                    value={form.costoUnitario}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="activo">Activo</option>
                    <option value="bajo_stock">Bajo Stock</option>
                    <option value="vencido">Vencido</option>
                    <option value="agotado">Agotado</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  {esEdicion ? 'Guardar Cambios' : 'Crear Registro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminar */}
      {pendienteEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-800">Eliminar registro</h3>
            <p className="mt-1.5 text-sm text-slate-500">
              Esta acción es permanente y no se puede deshacer. ¿Deseas eliminar este registro del inventario?
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setPendienteEliminar(null)}
                className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={ejecutarEliminar}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}