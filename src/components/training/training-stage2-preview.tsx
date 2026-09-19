'use client';

import { useMemo, useState } from 'react';
import { InMemoryTrainingRepository } from '@/features/training/repository';
import { MockConversationAdapter } from '@/features/training/mock-conversation-adapter';
import { ScenarioEngine } from '@/features/training/scenario-engine';
import type { ScenarioTransitionResult, TraineeActionKind, ScenarioRuntimeState } from '@/features/training/engine-types';

const actions: readonly { kind: TraineeActionKind; label: string }[] = [
  { kind: 'ASK_NEEDS', label: '探索需求' },
  { kind: 'ASK_FINANCING', label: '詢問付款' },
  { kind: 'EXPLAIN_PROPERTY', label: '說明物件' },
  { kind: 'EXPLAIN_MARKET', label: '說明行情' },
  { kind: 'HANDLE_OBJECTION', label: '回應疑慮' },
  { kind: 'BUILD_TRUST', label: '建立信任' },
  { kind: 'NEGOTIATE', label: '討論條件' },
  { kind: 'PRESSURE_CLOSE', label: '催促成交' },
];

export function TrainingStage2Preview() {
  const repository = useMemo(() => new InMemoryTrainingRepository(), []);
  const engine = useMemo(() => new ScenarioEngine(repository), [repository]);
  const adapter = useMemo(() => new MockConversationAdapter(engine), [engine]);
  const scenarios = repository.listScenarios();
  const [selectedId, setSelectedId] = useState('S01');
  const [runtime, setRuntime] = useState<ScenarioRuntimeState>(() => engine.createRuntime({ scenarioId: 'S01' }));
  const [lastTransition, setLastTransition] = useState<ScenarioTransitionResult | null>(null);
  const view = engine.getRuntimeView(runtime);

  function selectScenario(scenarioId: string) {
    setSelectedId(scenarioId);
    setRuntime(engine.createRuntime({ scenarioId }));
    setLastTransition(null);
  }

  function applyAction(kind: TraineeActionKind, label: string) {
    const transition = adapter.interact(runtime, { text: label, action: { kind, text: label } });
    setRuntime(transition.nextState);
    setLastTransition(transition);
  }

  return <section className="glass mt-6 rounded-2xl p-6" aria-labelledby="training-stage2-preview-heading">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[.18em] text-blue-200/70">Developer Preview · Mock only</p>
        <h2 id="training-stage2-preview-heading" className="mt-2 text-xl font-semibold">Scenario + NPC Engine</h2>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-300">情境
        <select value={selectedId} onChange={(event) => selectScenario(event.target.value)} className="rounded-lg border border-white/15 bg-slate-950/60 px-3 py-2 text-sm text-slate-100">
          {scenarios.map((scenario) => <option key={scenario.scenarioId} value={scenario.scenarioId}>{scenario.scenarioId} · {scenario.name}</option>)}
        </select>
      </label>
    </div>
    <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">{view.briefing}</p>
    <div className="mt-5 grid gap-4 md:grid-cols-[1.1fr_.9fr]">
      <div className="rounded-xl border border-white/10 bg-white/[.03] p-4">
        <h3 className="text-sm font-medium text-slate-100">目前可見資訊</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">{view.visibleInformation.map((item) => <li key={item.informationId}><span className="text-slate-400">{item.label}：</span>{item.content}</li>)}</ul>
        <p className="mt-3 text-xs text-slate-500">尚未揭露 {view.hiddenInformationCount} 項；系統判定資料 {view.systemInformationCount} 項不會提供給受訓者。</p>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[.03] p-4">
        <h3 className="text-sm font-medium text-slate-100">NPC 狀態 · {view.status}</h3>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-300">
          <div><dt className="text-xs text-slate-500">Trust</dt><dd>{view.npc.trust}</dd></div>
          <div><dt className="text-xs text-slate-500">Interest</dt><dd>{view.npc.interest}</dd></div>
          <div><dt className="text-xs text-slate-500">Pressure</dt><dd>{view.npc.pressure}</dd></div>
          <div><dt className="text-xs text-slate-500">Emotion</dt><dd>{view.npc.emotion}</dd></div>
        </dl>
      </div>
    </div>
    <div className="mt-5 flex flex-wrap gap-2" aria-label="Mock trainee actions">{actions.map((action) => <button key={action.kind} type="button" onClick={() => applyAction(action.kind, action.label)} className="min-h-10 rounded-lg border border-blue-200/20 bg-blue-200/10 px-3 py-2 text-xs text-blue-100 transition hover:border-blue-200/40">{action.label}</button>)}</div>
    {lastTransition && <div className="mt-5 rounded-xl border border-white/10 bg-black/10 p-4" aria-live="polite">
      <p className="text-sm text-slate-200">{lastTransition.response}</p>
      <p className="mt-2 text-xs text-slate-400">State delta · Trust {lastTransition.stateDelta.trust >= 0 ? '+' : ''}{lastTransition.stateDelta.trust} · Interest {lastTransition.stateDelta.interest >= 0 ? '+' : ''}{lastTransition.stateDelta.interest} · Pressure {lastTransition.stateDelta.pressure >= 0 ? '+' : ''}{lastTransition.stateDelta.pressure}</p>
      {lastTransition.triggeredEvents.length > 0 && <p className="mt-2 text-xs text-amber-200/80">Events · {lastTransition.triggeredEvents.map((event) => event.eventType).join(' · ')}</p>}
    </div>}
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      <div><h3 className="text-sm font-medium text-slate-100">Objective progress</h3><ul className="mt-2 space-y-1 text-xs text-slate-400">{view.objectiveProgress.map((objective) => <li key={objective.objectiveId}>{objective.status} · {objective.label}</li>)}</ul></div>
      <div><h3 className="text-sm font-medium text-slate-100">Risk boundary</h3><p className="mt-2 text-xs text-slate-400">{view.riskHits.length === 0 ? '尚未觸發風險事件。' : view.riskHits.map((risk) => `${risk.ruleId} · ${risk.verificationState}`).join('；')}</p></div>
    </div>
  </section>;
}
