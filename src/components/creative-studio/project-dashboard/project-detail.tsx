'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Pencil, ShieldAlert } from 'lucide-react';
import { getCreativeLibraryAsset } from '@/data/mock/creative-assets/library';
import { listExportHistory } from '@/features/creative-studio/export-history';
import { listProjectHistory } from '@/features/creative-studio/history';
import { loadProject } from '@/features/creative-studio/project-storage';
import { getCreativeTemplate } from '@/features/creative-studio/template-engine';
import type { CreativeProject } from '@/features/creative-studio/types';

function displayTime(value?: string) {
  return value ? new Intl.DateTimeFormat('zh-TW', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '尚無紀錄';
}

export function ProjectDetail({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<CreativeProject | null>(null);
  useEffect(() => setProject(loadProject(projectId)), [projectId]);

  if (!project) return <div className="mx-auto max-w-4xl pb-10"><section className="rounded-2xl border border-slate-700 bg-slate-900/35 p-8"><ShieldAlert className="text-amber-100" size={28} /><h1 className="mt-4 text-2xl font-semibold">找不到此專案</h1><p className="mt-2 text-slate-400">專案只儲存在建立它的瀏覽器 localStorage。可返回 Creative Studio 建立專案，或匯入對應 Backup JSON。</p><Link href="/tools/creative-studio/projects" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-blue-300/30 px-4 py-2 text-sm text-blue-100"><ArrowLeft size={16} />返回 Project Dashboard</Link></section></div>;

  const template = getCreativeTemplate(project.templateId);
  const history = listProjectHistory(project.id);
  const exports = listExportHistory().filter((record) => record.projectId === project.id);
  return <div className="mx-auto max-w-5xl pb-10"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs tracking-[.16em] text-blue-200">CREATIVE PROJECT DETAIL · LOCAL STORAGE</p><h1 className="mt-2 text-3xl font-semibold">{project.name}</h1><p className="mt-2 text-slate-400">{project.status} · {template.name} · 最後修改 {displayTime(project.updatedAt)}</p></div><Link href="/tools/creative-studio" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950"><Pencil size={16} />重新編輯</Link></div><section className="mt-7 grid gap-5 md:grid-cols-2"><article className="rounded-2xl border border-slate-700 bg-slate-900/35 p-5"><h2 className="font-semibold">專案資訊</h2><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-500">模板</dt><dd>{template.name}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">尺寸</dt><dd>{project.format}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">建立時間</dt><dd>{displayTime(project.createdAt)}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">匯出時間</dt><dd>{displayTime(project.exportedAt)}</dd></div></dl></article><article className="rounded-2xl border border-slate-700 bg-slate-900/35 p-5"><h2 className="font-semibold">使用素材</h2><div className="mt-4 flex flex-wrap gap-2">{project.assets.length ? project.assets.map((id) => <span key={id} className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-300">{getCreativeLibraryAsset(id)?.name ?? id}</span>) : <p className="text-sm text-slate-500">此專案尚未選擇素材。</p>}</div></article></section><section className="mt-5 grid gap-5 md:grid-cols-2"><article className="rounded-2xl border border-slate-700 bg-slate-900/35 p-5"><h2 className="font-semibold">操作歷程</h2><div className="mt-4 space-y-3">{history.length ? history.map((entry) => <div key={`${entry.timestamp}-${entry.description}`} className="border-b border-slate-800 pb-3 text-sm"><p className="text-slate-200">{entry.description}</p><p className="mt-1 text-xs text-slate-500">{entry.action} · {displayTime(entry.timestamp)}</p></div>) : <p className="text-sm text-slate-500">尚無操作歷程。</p>}</div></article><article className="rounded-2xl border border-slate-700 bg-slate-900/35 p-5"><h2 className="font-semibold">匯出紀錄</h2><div className="mt-4 space-y-3">{exports.length ? exports.map((record) => <div key={`${record.filename}-${record.time}`} className="border-b border-slate-800 pb-3 text-sm"><p className="text-slate-200">{record.filename}</p><p className="mt-1 text-xs text-slate-500">{record.format} · {displayTime(record.time)}</p></div>) : <p className="text-sm text-slate-500">尚無匯出紀錄。</p>}</div></article></section></div>;
}
