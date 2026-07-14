"use client";
export const dynamic = "force-dynamic";
import { Hero } from "@/components/ui/Hero";
import { POSBoard } from "@/components/ui/POSBoard";
import Link from 'next/link'
import { usuarios, medicamentos, inventario, recetas } from '@/lib/mock'
import {
  Users,
  Pill,
  Package,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react'

const totalUsuariosActivos = (usuarios ?? []).filter((u) => u.activo).length
const totalMedicamentosActivos = (medicamentos ?? []).filter((m) => m.activo).length
const itemsStockBajo = (inventario ?? []).filter((i) => i.cantidad <= i.cantidadMinima)
const recetasPendientes = (recetas ?? []).filter((r) => r.estado === 'pendiente')
const valorInventario = (inventario ?? []).reduce(
  (acc, i) => acc + i.cantidad * i.costoUnitario,
  0
)
const totalUnidades = (inventario ?? []).reduce((acc, i) => acc + i.cantidad, 0)

const estadoBadge: Record<string, string> = {
  pendiente: 'bg-amber-100 text-amber-700 border border-amber-200',
  dispensada: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  aprobada: 'bg-blue-100 text-blue-700 border border-blue-200',
  vencida: 'bg-red-100 text-red-700 border border-red-200',
  cancelada: 'bg-gray-100 text-gray-600 border border-gray-200',
}

const estadoLabel: Record<string, string> = {
  pendiente: 'Pendiente',
  dispensada: 'Dispensada',
  aprobada: 'Aprobada',
  vencida: 'Vencida',
  cancelada: 'Cancelada',
}

export default function DashboardPage() {
  const recetasRecientes = recetas.slice(0, 6)

  return (
    <div className="min-h-screen bg-slate-50">
      <Hero title="Panel de Control" subtitle="Resumen de tu operación de un vistazo." />
      <div className="mt-2"><h2 className="mb-3 text-lg font-semibold text-slate-900">Vista rápida</h2><POSBoard /></div>
      {/* Top nav */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Panel de Control</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Resumen operativo del sistema hospitalario — {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link
            href="/recetas/nueva"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Nueva Receta
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Usuarios activos */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                +12%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalUsuariosActivos}</p>
            <p className="text-sm font-medium text-slate-600 mt-0.5">Usuarios Activos</p>
            <p className="text-xs text-slate-400 mt-2">
              {usuarios?.length} registrados en total ·{' '}
              {(usuarios ?? []).filter((u) => u.rol === 'medico').length} médicos
            </p>
          </div>

          {/* Medicamentos */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center">
                <Pill className="w-5 h-5 text-violet-600" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Verificados
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalMedicamentosActivos}</p>
            <p className="text-sm font-medium text-slate-600 mt-0.5">Medicamentos</p>
            <p className="text-xs text-slate-400 mt-2">
              {(medicamentos ?? []).filter((m) => m.requiereReceta).length} requieren receta ·{' '}
              {(medicamentos ?? []).filter((m) => !m.activo).length} inactivos
            </p>
          </div>

          {/* Alertas stock */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              {itemsStockBajo?.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                  Urgente
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-red-600">{itemsStockBajo?.length}</p>
            <p className="text-sm font-medium text-slate-600 mt-0.5">Alertas de Stock</p>
            <p className="text-xs text-slate-400 mt-2">
              {totalUnidades.toLocaleString('es-ES')} uds totales ·{' '}
              {inventario?.length} lotes activos
            </p>
          </div>

          {/* Recetas pendientes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3" />
                Pendientes
              </span>
            </div>
            <p className="text-3xl font-bold text-amber-600">{recetasPendientes?.length}</p>
            <p className="text-sm font-medium text-slate-600 mt-0.5">Recetas Pendientes</p>
            <p className="text-xs text-slate-400 mt-2">
              {(recetas ?? []).filter((r) => r.estado === 'dispensada').length} dispensadas ·{' '}
              {recetas?.length} en total
            </p>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recetas table — 2/3 */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">Recetas Recientes</h2>
                <p className="text-xs text-slate-400 mt-0.5">Últimas solicitudes registradas</p>
              </div>
              <Link
                href="/recetas"
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Ver todas <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Código</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Paciente</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Médico</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Diagnóstico</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(recetasRecientes ?? []).map((receta) => (
                    <tr key={receta.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-3.5">
                        <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {receta.codigoReceta}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-medium text-slate-800">{receta.pacienteNombre}</td>
                      <td className="px-6 py-3.5 text-slate-500">{receta.medicoNombre}</td>
                      <td className="px-6 py-3.5 text-slate-500 max-w-[160px]">
                        <span className="truncate block">{receta.diagnostico}</span>
                      </td>
                      <td className="px-6 py-3.5 text-right font-semibold text-slate-800">
                        ${(receta.totalEstimado ?? 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            estadoBadge[receta.estado] ?? 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {estadoLabel[receta.estado] ?? receta.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column — 1/3 */}
          <div className="flex flex-col gap-5">
            {/* Resumen inventario */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-slate-900">Inventario</h2>
                <Link href="/inventario" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5">
                  Gestionar <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Unidades totales</span>
                  <span className="font-bold text-slate-900">{totalUnidades.toLocaleString('es-ES')}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Valor en stock</span>
                  <span className="font-bold text-slate-900">
                    ${valorInventario.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Lotes registrados</span>
                  <span className="font-bold text-slate-900">{inventario?.length}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-500">Stock crítico</span>
                  <span className={`font-bold ${itemsStockBajo?.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {itemsStockBajo?.length} ítems
                  </span>
                </div>
              </div>

              {itemsStockBajo?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Críticos</p>
                  <div className="space-y-2">
                    {itemsStockBajo.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-700 truncate">{item.medicamentoNombre}</p>
                          <p className="text-xs text-slate-400">Lote: {item.lote}</p>
                        </div>
                        <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                          {item.cantidad} uds
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Acciones rápidas */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h2 className="font-semibold text-slate-900 mb-4">Acciones Rápidas</h2>
              <div className="space-y-1.5">
                {[
                  {
                    label: 'Nueva Receta',
                    sub: 'Registrar prescripción médica',
                    href: '/recetas/nueva',
                    icon: FileText,
                    color: 'text-blue-600 bg-blue-50 group-hover:bg-blue-100',
                  },
                  {
                    label: 'Agregar Medicamento',
                    sub: 'Añadir al catálogo',
                    href: '/medicamentos/nuevo',
                    icon: Pill,
                    color: 'text-violet-600 bg-violet-50 group-hover:bg-violet-100',
                  },
                  {
                    label: 'Ingreso de Stock',
                    sub: 'Registrar entrada al inventario',
                    href: '/inventario/ingreso',
                    icon: Package,
                    color: 'text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100',
                  },
                  {
                    label: 'Crear Usuario',
                    sub: 'Médico, farmacéutico o admin',
                    href: '/usuarios/nuevo',
                    icon: Users,
                    color: 'text-slate-600 bg-slate-100 group-hover:bg-slate-200',
                  },
                ].map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${action.color}`}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 group-hover:text-slate-900">{action.label}</p>
                      <p className="text-xs text-slate-400">{action.sub}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 ml-auto shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer strip */}
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
          <span>MediGest Pro — Plataforma Hospitalaria de Gestión de Medicamentos</span>
          <span>v1.0.0 · {new Date().getFullYear()}</span>
        </div>
      </main>
    </div>
  )
}