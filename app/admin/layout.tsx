import AdminShell from "./_components/AdminShell";

export const metadata = { title: "Admin CMS" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; }
          a { text-decoration: none; }
          input, button, textarea, select { font-family: inherit; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
        `}</style>
      </head>
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}