const pageLabels: Record<string, string> = { '共用素材庫': 'Asset Library', '模板管理': 'Template Management', '榮譽與成交圖': 'Award Graphics', '公告圖編輯中心': 'Announcement Studio', '房產資料工具': 'Realty Data Tools', '房貸試算': 'Mortgage Calculator', '房產市場智慧報告': 'Property Market Report' };

export function PageHeader({ title, description }: { title: string; description: string }) {
  return <div className="page-header mb-7"><div className="page-header-kicker mb-2 text-xs uppercase tracking-[.2em]">E.X REALTY HUB · {pageLabels[title] ?? 'WORKSPACE'}</div><h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1><p className="page-header-description mt-2 max-w-2xl">{description}</p></div>;
}
