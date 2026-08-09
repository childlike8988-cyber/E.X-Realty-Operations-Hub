import Link from 'next/link';
import { FolderPlus } from 'lucide-react';

export function ProjectEmptyState() {
  return <section className="rounded-2xl border border-dashed border-slate-600 bg-slate-900/25 p-10 text-center"><FolderPlus className="mx-auto text-blue-200" size={28}/><h2 className="mt-4 text-lg font-semibold">尚無符合條件的專案</h2><p className="mt-2 text-sm text-slate-400">先在 Creative Studio 儲存一個 Mock 專案，即可在此集中查看。</p><Link href="/tools/creative-studio" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950">建立素材專案</Link></section>;
}
