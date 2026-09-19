export type TrainingAppearance = 'light' | 'dark' | 'system';
export const TRAINING_APPEARANCE_KEY = 'ex-realty-training-appearance-v1';
export function parseTrainingAppearance(value: unknown): TrainingAppearance {
  return value === 'light' || value === 'dark' ? value : 'system';
}
export function readTrainingAppearance(storage: Pick<Storage, 'getItem'>): TrainingAppearance {
  try { return parseTrainingAppearance(storage.getItem(TRAINING_APPEARANCE_KEY)); } catch { return 'system'; }
}
export function persistTrainingAppearance(storage: Pick<Storage, 'setItem'>, value: TrainingAppearance): boolean {
  try { storage.setItem(TRAINING_APPEARANCE_KEY, value); return true; } catch { return false; }
}
export function resolveTrainingAppearance(value: TrainingAppearance, prefersDark: boolean): 'light' | 'dark' {
  return value === 'system' ? (prefersDark ? 'dark' : 'light') : value;
}
// Runs before route content is painted. Only the appearance key is read.
export const trainingAppearanceBootstrap = `try{var r=document.currentScript.parentElement;var v=localStorage.getItem('ex-realty-training-appearance-v1');r.dataset.appearance=(v==='light'||v==='dark')?v:'system'}catch{}`;
