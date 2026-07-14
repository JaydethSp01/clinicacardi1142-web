export const dynamic = "force-dynamic";
import "./globals.css";
import { AppShell } from "@/components/ui/AppShell";

const NAV = [{ href: "/", label: "Inicio" }, { href: "/inventario", label: "Inventario" }, { href: "/medicamento", label: "Medicamento" }, { href: "/receta", label: "Receta" }, { href: "/usuario", label: "Usuarios" }];

export const metadata = { title: "Panel de Control", description: "Generado con ScrumDev AI" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppShell items={NAV} title="Panel de Control">{children}</AppShell>
      </body>
    </html>
  );
}
