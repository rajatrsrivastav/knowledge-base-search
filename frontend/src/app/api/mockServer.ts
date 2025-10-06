type Pdf = { id: string; title: string; uploaded: string };

export async function fetchPdfs({ page = 1 }: { page?: number }) {
  // very small mock: return 10 items per page
  const items: Pdf[] = Array.from({ length: 10 }).map((_, i) => ({ id: String((page - 1) * 10 + i + 1), title: `Document ${(page - 1) * 10 + i + 1}`, uploaded: '2025-10-01' }));
  return { items, total: 100 };
}
