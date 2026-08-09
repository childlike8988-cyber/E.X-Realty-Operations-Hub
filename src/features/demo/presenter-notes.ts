import type { DemoStep } from './demo-flow';

type DemoStepId = DemoStep['id'];

export type DemoNote = { stepId: DemoStepId; title: string; content: string };

export const presenterNotes: DemoNote[] = [
  { stepId: 'overview', title: 'Property Overview', content: '展示物件資訊整理與智慧分析入口，先確認目標客群與案件定位。' },
  { stepId: 'market', title: 'Market Analysis', content: '展示市場資料如何協助業務建立價格策略；本畫面所有成交資料均為 Mock Data。' },
  { stepId: 'location', title: 'Location Intelligence', content: '展示生活圈、交通、採買與休閒等規則式分析，協助說明居住價值。' },
  { stepId: 'intelligence', title: 'Property Intelligence', content: '將市場與生活圈資訊轉成目標客群、核心賣點與銷售策略。' },
  { stepId: 'marketing', title: 'Marketing Content', content: '展示同一份案件 Context 如何產生多平台行銷內容；目前為規則式 Mock。' },
  { stepId: 'creative', title: 'Creative Studio', content: '展示固定模板如何把行銷內容轉為一致的視覺素材，避免自由設計器的複雜度。' },
  { stepId: 'proposal', title: 'Proposal Export', content: '展示市場提案包與 PDF 匯出方向；正式估價、AI 洞察與對外發布尚未啟用。' },
];

export function getPresenterNote(stepId: DemoStepId) { return presenterNotes.find((note) => note.stepId === stepId) ?? null; }
