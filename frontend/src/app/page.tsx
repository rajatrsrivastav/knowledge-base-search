"use client";

import { useMemo, useState } from "react";

type Result = { id: string; title: string; snippet: string; type: "PDF" | "FAQ" | "Link" };

const MOCK: Result[] = [
  { id: "1", title: "How to onboard", snippet: "Steps to onboard new hires...", type: "FAQ" },
  { id: "2", title: "Company Handbook (PDF)", snippet: "Full handbook for employees...", type: "PDF" },
  { id: "3", title: "Team blog", snippet: "Recent updates from the team...", type: "Link" },
];

export default function Home() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"ALL" | Result["type"]>("ALL");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return MOCK.filter((r) => (filter === "ALL" ? true : r.type === filter) && (!term || r.title.toLowerCase().includes(term) || r.snippet.toLowerCase().includes(term)));
  }, [q, filter]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">InsightEngine</h1>
          <p className="text-sm text-gray-500">Instant access to institutional knowledge</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search documents, FAQs, links..."
              className="flex-1 border rounded-md px-4 py-3 focus:outline-none focus:shadow-md transition-shadow"
            />
            <button onClick={() => setQ("")} className="px-4 py-3 bg-indigo-600 text-white rounded-md">
              Clear
            </button>
          </div>

          <div className="mt-4 flex gap-2">
            {(["ALL", "PDF", "FAQ", "Link"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t as any)}
                className={`text-sm px-3 py-1 rounded-full border ${filter === t ? "bg-indigo-600 text-white" : "bg-white text-gray-700"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {results.length === 0 && <div className="text-gray-500">No results</div>}
            {results.map((r) => (
              <div key={r.id} className="p-4 border rounded-md bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{r.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">{r.type}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{r.snippet}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
