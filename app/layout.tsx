import type { Metadata } from 'next';
import '../src/styles/index.css';

export const metadata: Metadata = {
  title: 'FAL - Distribuidora',
  description: 'Distribuidora de produtos nordestinos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
