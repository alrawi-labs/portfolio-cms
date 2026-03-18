import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <aside className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="px-4 py-4 border-b border-slate-800">
          <div className="text-lg font-semibold">Admin Panel</div>
          <div className="text-xs text-slate-400">Portfolio CMS</div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 text-sm">
          <Link
            href="/admin/dashboard"
            className="block px-3 py-2 rounded-md hover:bg-slate-800"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/projects"
            className="block px-3 py-2 rounded-md hover:bg-slate-800"
          >
            Projects
          </Link>
          <Link
            href="/admin/profile"
            className="block px-3 py-2 rounded-md hover:bg-slate-800"
          >
            Profile
          </Link>
          <Link
            href="/admin/skills"
            className="block px-3 py-2 rounded-md hover:bg-slate-800"
          >
            Skills
          </Link>
          <Link
            href="/admin/social"
            className="block px-3 py-2 rounded-md hover:bg-slate-800"
          >
            Social Links
          </Link>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-14 border-b border-slate-800 flex items-center px-6 justify-between bg-slate-950/80 backdrop-blur">
          <div className="font-medium">Portfolio Admin</div>
          <a
            href="/"
            className="text-xs px-3 py-1 rounded-full border border-slate-700 hover:bg-slate-800"
          >
            Siteyi görüntüle
          </a>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

