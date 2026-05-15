import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tienda Cercana | Inventario y ventas para negocios de barrio",
  description:
    "Aplicacion web para gestionar productos, ventas y contacto de una tienda de barrio o pequeno negocio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
