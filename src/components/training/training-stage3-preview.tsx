'use client';

import { useMemo, useRef, useState } from 'react';
import { mvpTrainingScenarios } from '@/features/training/scenarios';
import { InMemoryTrainingRepository } from '@/features/training/repository';
import { TrainingSessionApplicationService, type TraineeSessionView } from '@/features/training/session-service';
import type { TraineeActionKind } from '@/features/training/engine-types';
import { TrainingSessionReplay } from '@/features/training/session-replay';
import { createTrainingSessionReader } from '@/features/training/evaluation/session-reader';
import { InMemoryTrainingResultRepository } from '@/features/training/evaluation/result-repository';
import { HybridEvaluationEngine } from '@/features/training/evaluation/engine';
import { DIMENSION_LABELS, type TrainingResult } from '@/features/training/evaluation/contracts';

const actions: readonly { kind: TraineeActionKind; label: string }[] = [
  { kind: 'ASK_NEEDS', label: '探索需求' },
  { kind: 'ASK_BUDGET', label: '確認預算' },
  { kind: 'ASK_FINANCING', label: '詢問付款' },
  { kind: 'EXPLAIN_PROPERTY', label: '說明物件' },
  { kind: 'EXPLAIN_MARKET', label: '說明行情' },
  { kind: 'HANDLE_OBJECTION', label: '回應疑慮' },
  { kind: 'BUILD_TRUST', label: '建立信任' },
  { kind: 'NEGOTIATE', label: '討論條件' },
  { kind: 'PRESSURE_CLOSE', label: '催促成交（風險示範）' },
  { kind: 'DISCLOSE_RISK', label: '揭露待查證事項' },
];

export function TrainingStage3Preview() {
  const scenarioRepository = useMemo(() => new InMemoryTrainingRepository(), []);
  const service = useMemo(() => new TrainingSessionApplicationService({ scenarioRepository }), [scenarioRepository]);
  const evaluator = useMemo(() => {
    const sessions = createTrainingSessionReader(service.sessionRepository, new TrainingSessionReplay(service.scenarioEngine, service.sessionRepository));
    const versions = (id: string, version: string) => scenarioRepository.getScenarioVersion(id, version);
    return new HybridEvaluationEngine({
      sessions, versions, results: new InMemoryTrainingResultRepository(sessions, versions),
      // Demo knowledge is explicitly unverified. No invented legal source.
      knowledge: { getKnowledgeReference: async () => null },
    });
  }, [service, scenarioRepository]);
  const [evaluation, setEvaluation] = useState<TrainingResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState('');
  const evaluationPending = useRef(false);
  const [selectedId, setSelectedId] = useState(mvpTrainingScenarios[0].scenarioId);
  const [view, setView] = useState<TraineeSessionView | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [commandNumber, setCommandNumber] = useState(0);

  function start() {
    if (evaluationPending.current) return;
    setEvaluation(null);
    setEvaluationError('');
    const session = service.startSession({ scenarioId: selectedId, sessionId: `stage3-preview-${Date.now().toString(36)}` });
    setSessionId(session.sessionId);
    setCommandNumber(0);
    setView(service.getSessionView(session.sessionId));
  }

  function submit(kind: TraineeActionKind, label: string) {
    if (!sessionId || !view || view.status !== 'ACTIVE') return;
    const nextCommandNumber = commandNumber + 1;
    const result = service.submitTraineeMessage(sessionId, { commandId: `preview-command-${nextCommandNumber}`, text: label, action: { kind, text: label } });
    setCommandNumber(nextCommandNumber);
    setView(result.view);
  }

  function cancel() {
    if (!sessionId) return;
    service.cancelSession(sessionId, 'Demo session cancelled.');
    setView(service.getSessionView(sessionId));
  }

  async function evaluate() {
    if (!sessionId || evaluationPending.current) return;
    evaluationPending.current = true;
    setEvaluating(true);
    setEvaluationError('');
    try {
      setEvaluation(await evaluator.evaluate(sessionId));
    } catch {
      setEvaluationError('評估暫時無法完成，請檢查此 Mock Session 的事件完整性。');
    } finally {
      evaluationPending.current = false;
      setEvaluating(false);
    }
  }

  return <section className="glass mt-6 rounded-2xl p-6" aria-labelledby="training-stage3-preview-heading">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[.18em] text-blue-200/70">Developer Preview · Mock only</p>
        <h2 id="training-stage3-preview-heading" className="mt-2 text-xl font-semibold">Simulation Session · Events · Evidence</h2>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <label htmlFor="training-stage3-scenario">情境</label>
        <select id="training-stage3-scenario" value={selectedId} onChange={(event) => setSelectedId(event.target.value)} disabled={Boolean(view && view.status === 'ACTIVE')} className="rounded-lg border border-white/15 bg-slate-950/60 px-3 py-2 text-sm text-slate-100">
          {mvpTrainingScenarios.map((scenario) => <option key={scenario.scenarioId} value={scenario.scenarioId}>{scenario.scenarioId} · {scenario.name}</option>)}
        </select>
      </div>
    </div>
    {!view && <div className="mt-5"><p className="text-sm text-slate-300">選擇情境後啟動本機 Mock Session；所有事件只存在目前頁面的 InMemory Repository。</p><button type="button" onClick={start} className="mt-4 min-h-10 rounded-lg border border-blue-200/30 bg-blue-200/10 px-4 py-2 text-sm text-blue-100 transition hover:border-blue-200/60">開始 Mock Session</button></div>}
    {view && <>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[.03] p-4">
        <div><p className="text-xs text-slate-500">Session {view.sessionId}</p><p className="mt-1 text-sm text-slate-200">{view.scenario.scenarioName} · {view.status}</p></div>
        {view.status === 'ACTIVE' ? <button type="button" onClick={cancel} className="min-h-10 rounded-lg border border-amber-200/20 px-3 py-2 text-xs text-amber-100">取消 Session</button> : <button type="button" onClick={start} className="min-h-10 rounded-lg border border-blue-200/30 bg-blue-200/10 px-3 py-2 text-xs text-blue-100">重新開始</button>}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{view.scenario.briefing}</p>
      {view.status === 'ACTIVE' && <div className="mt-4 flex flex-wrap gap-2" aria-label="Stage 3 mock actions">{actions.map((action) => <button key={action.kind} type="button" onClick={() => submit(action.kind, action.label)} className="min-h-10 rounded-lg border border-blue-200/20 bg-blue-200/10 px-3 py-2 text-xs text-blue-100 transition hover:border-blue-200/50">{action.label}</button>)}</div>}
      <div className="mt-5 rounded-xl border border-white/10 bg-black/10 p-4">
        <h3 className="text-sm font-medium text-slate-100">事件時間線（{view.timeline.length}）</h3>
        <ol className="mt-3 space-y-2" aria-live="polite">{view.timeline.map((event) => <li key={event.eventId} className="border-l border-blue-200/20 pl-3 text-xs text-slate-300"><span className="text-slate-500">#{event.sequence} · {event.eventType} · {event.actor}</span><p className="mt-1 text-slate-300">{event.message}</p></li>)}</ol>
      </div>
      {view.status !== 'ACTIVE' && <div className="mt-5">
        <button type="button" onClick={evaluate} disabled={evaluating} className="min-h-11 rounded-lg border border-blue-200/30 px-4 py-2 text-sm text-blue-100 disabled:opacity-50">
          {evaluating ? '評估中…' : evaluation ? '重新評估（建立新 revision）' : '查看練習回饋'}
        </button>
        {evaluationError && <p role="alert" className="mt-3 text-sm text-amber-100">{evaluationError}</p>}
      </div>}
      {evaluation && <section className="mt-5 space-y-4 text-sm" aria-label="練習評估結果" aria-live="polite">
        <h3 className="font-medium">練習回饋 · Revision {evaluation.revision}</h3>
        <p>評估狀態：{evaluation.overallState} · {evaluation.verificationState}</p>
        <p className="text-slate-300">Mock 練習評估，證據以已記錄行動為限；知識與合規事項仍需查證。AI 建議不決定分數。</p>
        {(['POSITIVE', 'NEGATIVE', 'RISK'] as const).map(kind => <div key={kind}>
          <h4 className="font-medium">{kind === 'POSITIVE' ? '做得好的地方' : kind === 'NEGATIVE' ? '可改善的地方' : '風險與待確認事項'}</h4>
          <ul className="mt-2 space-y-2 text-slate-300">{evaluation.evidence.filter(item => item.kind === kind).map(item => <li key={item.evidenceId}>
            {item.finding}
            <span className="block text-xs text-slate-400">證據：{item.references.map(ref => ref.kind === 'EVENT' ? '#' + ref.sequence : ref.kind === 'OBJECTIVE' ? ref.objectiveId : ref.kind === 'RULE_HIT' ? ref.ruleId : ref.refId).join(' · ')}</span>
          </li>)}</ul>
        </div>)}
        <details>
          <summary className="cursor-pointer py-2">各能力面向與證據充分度</summary>
          <ul className="space-y-2">{evaluation.dimensionResults.map(item => <li key={item.dimensionId}>
            {DIMENSION_LABELS[item.dimensionId]}：{item.state === 'SCORED' ? item.score + '（證據充分度 ' + Math.round(item.confidence * 100) + '%）' : '證據不足'}
          </li>)}</ul>
        </details>
        <p className="text-slate-300">Mock 教練建議（{evaluation.aiAdvisory.disposition}）：{evaluation.aiAdvisory.advisory}</p>
      </section>}
    </>}
  </section>;
}
