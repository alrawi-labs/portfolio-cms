"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [projectsCount, setProjectsCount] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) return;
        const data = await res.json();
        setProjectsCount(Array.isArray(data) ? data.length : 0);
      } catch {
        setProjectsCount(0);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs text-slate-400">Total Projects</div>
          <div className="mt-2 text-2xl font-bold">
            {projectsCount === null ? "..." : projectsCount}
          </div>
        </div>
      </div>
    </div>
  );
}
