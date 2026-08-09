export function EmptyResults({onClear}:{onClear:()=>void}) {
  return <section className="glass mt-6 rounded-2xl p-8 text-center"><h2 className="text-xl font-semibold">找不到符合條件的展示資料</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">可嘗試移除路段、地址或屋齡條件。本頁僅使用 Mock Data，不代表正式實價登錄查詢結果。</p><button onClick={onClear} className="mt-5 min-h-11 rounded-lg border border-blue-300/30 px-4 py-2 text-sm text-blue-100">清除查詢條件</button></section>;
}
