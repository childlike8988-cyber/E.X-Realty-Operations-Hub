'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, FolderOpen, History, Lightbulb, Save, Star, Trash2, Upload } from 'lucide-react';
import { AssetManager } from '@/components/creative-studio/asset-manager/asset-manager';
import { BrandKitEditor } from '@/components/creative-studio/brand-kit-editor';
import { TemplateGallery } from '@/components/creative-studio/template-gallery/template-gallery';
import { createCreativeContext } from '@/features/creative-studio/creative-context';
import { createCreativeProject } from '@/features/creative-studio/creative-project';
import { exportCreativePreview, getCreativeExportFileName } from '@/features/creative-studio/export';
import { listExportHistory, recordExport } from '@/features/creative-studio/export-history';
import { listProjectHistory, recordProjectHistory } from '@/features/creative-studio/history';
import { downloadProjectBackup, parseProjectBackup, restoreProjectBackup } from '@/features/creative-studio/project-backup';
import { deleteProject, listProjects, loadProject, saveProject } from '@/features/creative-studio/project-storage';
import { createTemplateFieldValues, creativeTemplates, getCreativeTemplate, updateTemplateFieldValue } from '@/features/creative-studio/template-engine';
import { listFavoriteTemplates, listRecentTemplates, recordRecentTemplate, toggleFavoriteTemplate } from '@/features/creative-studio/template-preferences';
import type { CreativeExportRecord, CreativeProject, CreativeProjectStatus, TemplateFieldValues } from '@/features/creative-studio/types';
import { adaptProposalContextToMarketingContext } from '@/features/property-intelligence/marketing-adapter';
import { mockProperties } from '@/features/property-intelligence/mock-properties';
import { adaptPropertyToProposalContext } from '@/features/property-intelligence/proposal-adapter';
import { generateMarketingContent } from '@/features/property-marketing/generate-marketing-content';
import { TemplateFieldEditor } from './template-editor/template-field-editor';
import { PreviewPanel } from './template-editor/preview-panel';

function formatTime(value: string) {
  return new Intl.DateTimeFormat('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

function templateName(id: string) {
  return creativeTemplates.find((template) => template.id === id)?.name ?? id;
}

export function CreativeStudio() {
  const [propertyId, setPropertyId] = useState(mockProperties[0].id);
  const [templateId, setTemplateId] = useState(creativeTemplates[0].id);
  const [fieldValues, setFieldValues] = useState<TemplateFieldValues>({});
  const [projectStatus, setProjectStatus] = useState<CreativeProjectStatus>('DRAFT');
  const [isExporting, setIsExporting] = useState(false);
  const [projects, setProjects] = useState<CreativeProject[]>([]);
  const [exports, setExports] = useState<CreativeExportRecord[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentTemplates, setRecentTemplates] = useState<string[]>([]);
  const [backupMessage, setBackupMessage] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);
  const skipDefaultValues = useRef(false);
  const property = mockProperties.find((item) => item.id === propertyId) ?? mockProperties[0];
  const template = getCreativeTemplate(templateId);
  const marketingContext = useMemo(() => adaptProposalContextToMarketingContext(adaptPropertyToProposalContext(property)), [property]);
  const marketingContent = useMemo(() => generateMarketingContent(marketingContext), [marketingContext]);
  const context = useMemo(() => createCreativeContext(marketingContext, marketingContent), [marketingContent, marketingContext]);

  const refreshWorkspace = () => {
    setProjects(listProjects());
    setExports(listExportHistory());
    setFavorites(listFavoriteTemplates());
    setRecentTemplates(listRecentTemplates());
  };

  useEffect(() => { refreshWorkspace(); }, []);
  useEffect(() => {
    if (skipDefaultValues.current) {
      skipDefaultValues.current = false;
      return;
    }
    setFieldValues(createTemplateFieldValues(context, template));
    setProjectStatus('EDITING');
  }, [context, template]);
  useEffect(() => { setRecentTemplates(recordRecentTemplate(templateId)); }, [templateId]);

  const project = useMemo(
    () => createCreativeProject({ propertyId: property.id, template, context, fieldValues, status: projectStatus }),
    [context, fieldValues, projectStatus, property.id, template],
  );

  const applyProject = (saved: CreativeProject) => {
    skipDefaultValues.current = saved.propertyId !== propertyId || saved.templateId !== templateId;
    setPropertyId(saved.propertyId);
    setTemplateId(saved.templateId);
    setFieldValues(saved.fieldValues);
    setProjectStatus(saved.status);
  };

  const saveCurrentProject = () => {
    const saved = saveProject({ ...project, status: 'READY' });
    recordProjectHistory({ projectId: saved.id, action: 'SAVED', description: `已儲存 ${saved.name}` });
    setProjectStatus('READY');
    refreshWorkspace();
  };

  const loadSavedProject = (projectId: string) => {
    const saved = loadProject(projectId);
    if (!saved) return;
    applyProject(saved);
    recordProjectHistory({ projectId: saved.id, action: 'EDITED', description: `已開啟 ${saved.name}` });
    refreshWorkspace();
  };

  const removeCurrentProject = () => {
    if (!deleteProject(project.id)) return;
    recordProjectHistory({ projectId: project.id, action: 'DELETED', description: `已刪除 ${project.name}` });
    setProjectStatus('DRAFT');
    refreshWorkspace();
  };

  const updateField = (fieldId: string, value: string) => {
    setFieldValues((current) => updateTemplateFieldValue(current, fieldId, value));
    setProjectStatus('EDITING');
  };

  const exportPreview = async (type: 'PNG' | 'PDF') => {
    if (!previewRef.current || isExporting) return;
    setIsExporting(true);
    try {
      await exportCreativePreview({ element: previewRef.current, propertyName: property.title, templateName: template.name, type });
      const filename = getCreativeExportFileName(property.title, template.name, type);
      const saved = saveProject({ ...project, status: 'EXPORTED', exportedAt: new Date().toISOString() });
      recordExport({ filename, format: type, template: template.name, projectId: saved.id });
      recordProjectHistory({ projectId: saved.id, action: 'EXPORTED', description: `已匯出 ${filename}` });
      setProjectStatus('EXPORTED');
      refreshWorkspace();
    } finally {
      setIsExporting(false);
    }
  };

  const importBackup = async (file: File | undefined) => {
    if (!file) return;
    try {
      const saved = restoreProjectBackup(parseProjectBackup(await file.text()));
      applyProject(saved);
      recordProjectHistory({ projectId: saved.id, action: 'EDITED', description: `由備份匯入 ${saved.name}` });
      setBackupMessage(`已從備份還原 ${saved.name}`);
      refreshWorkspace();
    } catch (error) {
      setBackupMessage(error instanceof Error ? error.message : '無法匯入備份檔案。');
    }
  };

  const toggleFavorite = () => setFavorites(toggleFavoriteTemplate(template.id));

  return (
    <div className="mx-auto max-w-[1600px] pb-10">
      <section className="overflow-hidden rounded-3xl border border-blue-300/20 bg-[radial-gradient(circle_at_84%_15%,rgba(126,167,255,.28),transparent_26%),linear-gradient(135deg,#071321,#102b4b)] p-6 sm:p-10">
        <span className="inline-flex rounded-full border border-blue-200/25 bg-blue-300/10 px-3 py-1 text-xs tracking-[.16em] text-blue-100">CREATIVE WORKSPACE · LOCAL MOCK DATA</span>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold sm:text-5xl">Creative Studio</h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-300">從案件行銷內容建立固定模板素材；全部編輯、素材、備份及歷程僅保存在目前瀏覽器，不含真實資料或外部服務。</p>
          </div>
          <Link href="/tools/creative-studio/projects" className="inline-flex min-h-11 items-center rounded-lg border border-blue-300/30 px-4 py-2 text-sm text-blue-100">Project Dashboard</Link>
        </div>
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[360px_360px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <article className="rounded-2xl border border-emerald-300/25 bg-emerald-300/5 p-5">
            <p className="text-xs tracking-[.16em] text-emerald-100">PROPERTY / PROJECT</p>
            <label className="mt-4 block text-sm">選擇示範案件
              <select value={propertyId} onChange={(event) => setPropertyId(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
                {mockProperties.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
              </select>
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={saveCurrentProject} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-amber-300 px-3 py-2 text-sm font-semibold text-slate-950"><Save size={15} />儲存專案</button>
              <button type="button" onClick={() => downloadProjectBackup(project)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-blue-300/30 px-3 py-2 text-sm text-blue-100"><Download size={15} />Export Backup</button>
              <button type="button" onClick={() => backupInputRef.current?.click()} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-blue-300/30 px-3 py-2 text-sm text-blue-100"><Upload size={15} />Import Backup</button>
              <button type="button" onClick={removeCurrentProject} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-300/30 px-3 py-2 text-sm text-red-200"><Trash2 size={15} />刪除</button>
              <input ref={backupInputRef} type="file" accept="application/json,.json" className="sr-only" onChange={(event) => void importBackup(event.target.files?.[0])} />
            </div>
            {backupMessage && <p className="mt-3 text-xs leading-5 text-slate-400">{backupMessage}</p>}
            <p className="mt-3 text-xs text-slate-400">目前狀態：<span className="font-medium text-amber-100">{projectStatus}</span> · localStorage</p>
          </article>
          <TemplateGallery templates={creativeTemplates} selectedId={templateId} favoriteIds={favorites} onApply={setTemplateId} />
          <article className="rounded-2xl border border-violet-300/25 bg-violet-300/5 p-5">
            <div className="flex items-center justify-between gap-3">
              <div><p className="text-xs tracking-[.16em] text-violet-100">TEMPLATE MANAGEMENT</p><p className="mt-1 text-sm text-slate-200">收藏與最近使用模板</p></div>
              <button type="button" onClick={toggleFavorite} aria-label="切換模板收藏" className={`grid h-10 w-10 place-items-center rounded-lg border ${favorites.includes(template.id) ? 'border-amber-300 bg-amber-300/15 text-amber-100' : 'border-slate-600 text-slate-400'}`}><Star size={17} fill={favorites.includes(template.id) ? 'currentColor' : 'none'} /></button>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">收藏：{favorites.length ? favorites.map(templateName).join(' · ') : '尚未收藏模板'}</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">最近使用：{recentTemplates.length ? recentTemplates.map(templateName).join(' · ') : '尚無使用紀錄'}</p>
          </article>
        </aside>
        <TemplateFieldEditor template={template} values={fieldValues} onChange={updateField} />
        <main className="min-w-0 space-y-5">
          <PreviewPanel ref={previewRef} project={project} template={template} isExporting={isExporting} onExport={exportPreview} />
          <article className="rounded-2xl border border-blue-300/20 bg-blue-300/5 p-5">
            <div className="flex items-center gap-2"><Lightbulb size={18} className="text-amber-200" /><p className="text-xs tracking-[.16em] text-blue-200">LOCAL WORKSPACE</p></div>
            <p className="mt-3 text-sm leading-6 text-slate-200">專案、素材、Brand Kit、備份與紀錄均使用瀏覽器 localStorage。Backup JSON 會檢查版本，請勿放入真實個資或機密素材。</p>
          </article>
        </main>
      </section>

      <section className="mt-7 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-700 bg-slate-900/35 p-5">
          <div className="flex items-center gap-2"><FolderOpen size={17} className="text-blue-200" /><h2 className="font-semibold">最近專案</h2></div>
          <div className="mt-4 space-y-2">{projects.length ? projects.slice(0, 5).map((item) => <button type="button" key={item.id} onClick={() => loadSavedProject(item.id)} className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-700 p-3 text-left hover:border-blue-300/40"><span className="min-w-0"><span className="block truncate text-sm text-slate-100">{item.name}</span><span className="mt-1 block text-xs text-slate-500">{item.status} · {item.format} · {item.updatedAt ? formatTime(item.updatedAt) : '尚未儲存'}</span></span><span className="text-xs text-blue-200">開啟</span></button>) : <p className="text-sm text-slate-500">尚未儲存專案。</p>}</div>
        </article>
        <article className="rounded-2xl border border-slate-700 bg-slate-900/35 p-5">
          <div className="flex items-center gap-2"><History size={17} className="text-blue-200" /><h2 className="font-semibold">匯出紀錄</h2></div>
          <div className="mt-4 space-y-2">{exports.length ? exports.slice(0, 5).map((item) => <div key={`${item.projectId}-${item.time}-${item.filename}`} className="rounded-lg border border-slate-700 p-3"><p className="truncate text-sm text-slate-100">{item.filename}</p><p className="mt-1 text-xs text-slate-500">{item.format} · {item.template} · {formatTime(item.time)}</p></div>) : <p className="text-sm text-slate-500">尚無匯出紀錄。</p>}</div>
          <p className="mt-4 text-xs text-slate-600">目前專案操作歷程：{listProjectHistory(project.id).length} 筆</p>
        </article>
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-2">
        <AssetManager />
        <BrandKitEditor />
      </section>
    </div>
  );
}
