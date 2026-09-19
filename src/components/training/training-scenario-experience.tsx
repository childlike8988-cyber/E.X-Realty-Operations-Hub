'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { InMemoryTrainingRepository } from '@/features/training/repository';
import { TrainingSessionApplicationService } from '@/features/training/session-service';
import { TrainingSessionReplay } from '@/features/training/session-replay';
import { createTrainingSessionReader } from '@/features/training/evaluation/session-reader';
import { InMemoryTrainingResultRepository } from '@/features/training/evaluation/result-repository';
import { HybridEvaluationEngine } from '@/features/training/evaluation/engine';
import { DIMENSION_LABELS, type EvaluationEvidence, type TrainingResult } from '@/features/training/evaluation/contracts';
import {
  TrainingExperienceService,
  type TrainingBriefingView,
  type TrainingReactionView,
  type TrainingWorkspaceView,
} from '@/features/training/training-experience';

import { ArrowUpRight, ArrowLeft, Clock3, UsersRound, MessageCircle, Building2, X, Send, BookOpen, ShieldCheck } from 'lucide-react';
import styles from './training-visual.module.css';
import { groupTrainingEvidence, trainingFindingText, trainingEventText } from './training-presentation';

type ExperienceScreen = 'HOME' | 'BRIEFING' | 'SIMULATION' | 'RESULT';

const difficultyLabels = {
  BEGINNER: '入門',
  INTERMEDIATE: '進階',
  ADVANCED: '挑戰',
} as const;

const skillLabels: Readonly<Record<string, string>> = {
  'Needs Discovery': '需求探索', 'Communication': '溝通表達',
  'Property Knowledge': '物件理解', 'Market Interpretation': '行情解讀',
  'Objection Handling': '異議處理', 'Negotiation': '協商議價',
  'Risk Awareness': '風險意識', 'Professionalism': '專業態度',
};
const skillText = (skills: readonly string[]) => skills.map((skill) => skillLabels[skill] ?? skill).join(' · ');

const promptHints: Readonly<Record<string, readonly string[]>> = {
  S01: ['想先了解家庭需求與通勤安排。', '想了解月付與貸款負擔。', '我保證現在買一定會漲。'],
  S02: ['想先說明物件的採光與格局動線。', '想了解家庭需求與收納安排。', '我保證現在買一定會漲。'],
  S03: ['想先理解擔心太貴的疑慮，再看附近成交行情。', '想了解比較社區與家庭需求。', '我保證現在買一定會漲。'],
  S04: ['想確認總價、月付與付款安排。', '可以一起討論議價與其他條件。', '我保證現在買一定會漲。'],
  S05: ['想先了解搬遷時程與價格以外的顧慮。', '可以用市場行情與選項一起討論。', '我保證現在買一定會漲。'],
};

function relationshipLabel(value: number): string {
  if (value >= 60) return '對話關係漸增';
  if (value <= 25) return '對話關係脆弱';
  return '仍在建立對話關係';
}

function interestLabel(value: number): string {
  if (value >= 65) return '願意繼續探討';
  if (value <= 30) return '參與度正在下降';
  return '仍在觀察情境';
}

function pressureLabel(value: number): string {
  if (value >= 65) return '壓力偏高，宜調整節奏';
  if (value <= 25) return '壓力已緩和';
  return '對話壓力可控';
}

function eventReferenceText(evidence: EvaluationEvidence): string {
  const references = evidence.references.map((reference) => {
    if (reference.kind === 'EVENT') return '事件 #' + reference.sequence;
    if (reference.kind === 'OBJECTIVE') return '訓練目標';
    if (reference.kind === 'RULE_HIT') return '風險事件';
    return '查證資料';
  });
  return [...new Set(references)].join(' · ');
}

function resultStateLabel(result: TrainingResult): string {
  if (result.overallState === 'REQUIRES_REVIEW') return '需要複核';
  if (result.overallState === 'NEEDS_VERIFICATION') return '需要查證';
  if (result.overallState === 'INSUFFICIENT_EVIDENCE') return '證據不足';
  if (result.overallState === 'STRONG') return '表現穩定';
  if (result.overallState === 'DEVELOPING') return '正在發展';
  return '需要練習';
}

export function TrainingScenarioExperience() {
  const catalog = useMemo(() => new InMemoryTrainingRepository(), []);
  const sessions = useMemo(() => new TrainingSessionApplicationService({ scenarioRepository: catalog }), [catalog]);
  const versions = useMemo(() => (scenarioId: string, versionId: string) => catalog.getScenarioVersion(scenarioId, versionId), [catalog]);
  const reader = useMemo(() => createTrainingSessionReader(sessions.sessionRepository, new TrainingSessionReplay(sessions.scenarioEngine, sessions.sessionRepository)), [sessions]);
  const results = useMemo(() => new InMemoryTrainingResultRepository(reader, versions), [reader, versions]);
  const evaluation = useMemo(() => new HybridEvaluationEngine({
    sessions: reader,
    versions,
    results,
    // Stage 5A remains a Mock demo. Missing verified knowledge stays fail-closed.
    knowledge: { getKnowledgeReference: async () => null },
  }), [reader, results, versions]);
  const experience = useMemo(() => new TrainingExperienceService({ catalog, sessions, evaluation, results }), [catalog, evaluation, results, sessions]);

  const [screen, setScreen] = useState<ExperienceScreen>('HOME');
  const [briefing, setBriefing] = useState<TrainingBriefingView | null>(null);
  const [workspace, setWorkspace] = useState<TrainingWorkspaceView | null>(null);
  const [reaction, setReaction] = useState<TrainingReactionView | null>(null);
  const [result, setResult] = useState<TrainingResult | null>(null);
  const [completedScenarioIds, setCompletedScenarioIds] = useState<ReadonlySet<string>>(() => new Set());
  const [draft, setDraft] = useState('');
  const [contextOpen, setContextOpen] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState('');
  const sessionCounter = useRef(0);
  const commandCounter = useRef(0);
  const handledScenarioQuery = useRef(false);
  const scenarioCards = experience.listScenarios(completedScenarioIds);
  const headingRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (screen !== 'HOME') headingRef.current?.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [screen]);
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet || !contextOpen) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    sheet.showModal();
    return () => { sheet.close(); previous?.focus(); };
  }, [contextOpen]);

  const openBriefing = useCallback((scenarioId: string) => {
    setBriefing(experience.getBriefing(scenarioId));
    setWorkspace(null);
    setReaction(null);
    setResult(null);
    setError('');
    setScreen('BRIEFING');
  }, [experience]);

  useEffect(() => {
    if (handledScenarioQuery.current) return;
    const scenarioId = new URLSearchParams(window.location.search).get('scenario');
    if (!scenarioId || !catalog.getScenario(scenarioId)) return;
    handledScenarioQuery.current = true;
    openBriefing(scenarioId);
  }, [catalog, openBriefing]);

  function startSession() {
    if (!briefing) return;
    sessionCounter.current += 1;
    const sessionId = 'training-experience-' + Date.now().toString(36) + '-' + sessionCounter.current;
    setWorkspace(experience.startSession(briefing.scenarioId, sessionId));
    setReaction(null);
    setResult(null);
    setDraft('');
    setError('');
    setScreen('SIMULATION');
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!workspace || workspace.session.status !== 'ACTIVE' || !draft.trim()) return;
    try {
      commandCounter.current += 1;
      const next = experience.submitMessage(workspace.session.sessionId, 'training-ui-command-' + commandCounter.current, draft.trim());
      setWorkspace(next.workspace);
      setReaction(next.reaction);
      setDraft('');
      setError('');
    } catch {
      setError('目前無法送出這則訊息，請確認練習是否仍在進行。');
    }
  }

  function cancelSession() {
    if (!workspace || workspace.session.status !== 'ACTIVE') return;
    try {
      setWorkspace(experience.cancelSession(workspace.session.sessionId));
      setReaction(null);
      setError('');
    } catch {
      setError('目前無法取消這次練習，請稍後再試。');
    }
  }

  async function showResult() {
    if (!workspace || workspace.session.status === 'ACTIVE' || evaluating) return;
    setEvaluating(true);
    setError('');
    try {
      const evaluated = await experience.evaluateSession(workspace.session.sessionId);
      setResult(evaluated);
      if (workspace.session.status === 'COMPLETED' && evaluated.objectiveResult === 'MET') {
        setCompletedScenarioIds((current) => new Set([...current, evaluated.scenarioId]));
      }
      setScreen('RESULT');
    } catch {
      setError('評估暫時無法完成；不會產生替代或虛構結果。');
    } finally {
      setEvaluating(false);
    }
  }

  function returnHome() {
    setScreen('HOME');
    setBriefing(null);
    setWorkspace(null);
    setReaction(null);
    setResult(null);
    setDraft('');
    setError('');
  }

  const contextPanel = workspace && <div className={styles.context} aria-label="可用情境資料">
    <p className={styles.eyebrow}>Evidence & context</p><h3>手邊的情境資料</h3>
    <section><h4>已知資訊</h4><ul>{workspace.session.scenario.visibleInformation.map((item) =>
      <li key={item.informationId}><strong>{item.label}</strong><p>{item.content}</p></li>)}</ul></section>
    <section><h4>可用工具</h4><ul>{workspace.contextTools.map((tool) =>
      <li key={tool.contextId}><strong><Building2 size={16} aria-hidden="true" />{tool.label}</strong><p>本情境允許使用的模擬參考資料。</p>
        {tool.verificationState !== 'VERIFIED' && <small className={styles.caution}>需要查證，不作為正式結論。</small>}
        <details><summary>開發資料來源參照</summary><p>{tool.summary}</p><small>{tool.reference}</small></details>
      </li>)}</ul></section>
  </div>;

  if (screen === 'HOME') return <section className={styles.experience} aria-labelledby="training-home-heading">
    <div className={styles.hero}>
      <div><p className={styles.eyebrow}>AI Realty Training Center</p>
        <h1 id="training-home-heading">把第一次犯錯，<br />留在訓練場。</h1>
        <p className={styles.lead}>房仲 AI 實戰訓練中心</p>
        <p className={styles.heroCopy}>從第一次接待到價格協商，練習理解客戶、使用證據。讓每一次對話，都成為下一次的底氣。</p>
        <div className={styles.heroActions}><button className={styles.primary} onClick={() => openBriefing('S01')}>開始第一個練習 <ArrowUpRight size={18} /></button>
        <Link href="/training/manager/" className={styles.managerEntry}>店長教練視角 <ArrowUpRight size={15} /></Link></div>
        <p className={styles.footnote}>模擬客戶 · 本機練習 · 無正式客戶資料</p>
      </div>
      <aside className={styles.featured} aria-label="精選情境">
        <picture className={styles.heroPhoto}>
          <source media="(max-width: 1199px)" srcSet={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/training/hero-consultation-800.webp`} type="image/webp" />
          <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/training/hero-consultation-1600.webp`} width={1600} height={900} alt="明亮住宅空間中的專業諮詢情境示意" unoptimized loading="eager" fetchPriority="high" />
        </picture>
        <span className={styles.badge}>本日練習起點</span><UsersRound size={34} strokeWidth={1.2} aria-hidden="true" />
        <p className={styles.eyebrow}>S01 / The first conversation</p><h2>{scenarioCards[0].name}</h2>
        <p>{scenarioCards[0].persona}</p><p className={styles.featuredNote}>好的接待，從好好理解一個人開始。</p>
        <div className={styles.meta}><span><Clock3 size={15} />約 {scenarioCards[0].estimatedDurationMinutes} 分鐘</span><span>{difficultyLabels[scenarioCards[0].difficulty]}</span></div>
      </aside>
    </div>
    <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Practice collection</p><h2>五種情境，逐步建立專業。</h2></div><span>01 — 05</span></div>
    <ol className={styles.shelf}>
      {scenarioCards.map((scenario, index) => <li key={scenario.scenarioId} className={styles.scenarioCard}>
        <div className={styles.cardTop}><span className={styles.scenarioNumber}>{String(index + 1).padStart(2, '0')}</span><span className={styles.badge}>{difficultyLabels[scenario.difficulty]}</span></div>
        <p className={styles.eyebrow}>{scenario.scenarioId}</p><h3>{scenario.name}</h3>
        <p className={styles.persona}>{scenario.persona}</p><p className={styles.skill}>{skillText(scenario.skillFocus)}</p>
        <div className={styles.meta}><span><Clock3 size={14} />{scenario.estimatedDurationMinutes} 分鐘</span><span>{scenario.completionState === 'COMPLETED' ? '本次已完成' : '尚未開始'}</span></div>
        <button onClick={() => openBriefing(scenario.scenarioId)} aria-label={scenario.scenarioId + ' ' + scenario.name + ' 查看情境'} className={styles.cardAction}>查看情境 <ArrowUpRight size={18} /></button>
      </li>)}
    </ol><p className={styles.footerNote}>示範版採用預設模擬回應，未連接即時 AI。進度保留於本次頁面；重新整理後重新開始。</p>
    <details className={styles.disclosure}><summary>關於示範資料</summary><p>Mock 模擬練習：情境、對象與管理端範例皆為合成資料，不含真實客戶或員工。</p></details>
  </section>;

  if (screen === 'BRIEFING' && briefing) return <section ref={headingRef} className={styles.experience} aria-labelledby="training-briefing-heading">
    <button onClick={returnHome} className={styles.back}><ArrowLeft size={17} />返回情境庫</button>
    <div className={styles.caseHeader}><p className={styles.eyebrow}>Case file / {briefing.scenarioId}</p>
      <h2 id="training-briefing-heading" tabIndex={-1}>{briefing.name}</h2>
      <div className={styles.meta}><span className={styles.badge}>{difficultyLabels[briefing.difficulty]}</span><span><Clock3 size={16} />約 {briefing.estimatedDurationMinutes} 分鐘</span><span>模擬情境</span></div>
    </div>
    <div className={styles.briefingGrid}><article className={styles.caseBody}>
      <p className={styles.eyebrow}>The situation</p><h3>先理解眼前的這個人。</h3>
      <div className={styles.personaLine}><UsersRound size={28} strokeWidth={1.3} aria-hidden="true" /><div><small>模擬對象</small><strong>{briefing.persona}</strong></div></div>
      <p className={styles.mission}>{briefing.mission}</p>
      <h3>已知情境</h3><dl className={styles.known}>{briefing.knownInformation.map((item) => <div key={item.informationId}><dt>{item.label}</dt><dd>{item.content}</dd></div>)}</dl>
      <details className={styles.disclosure}><summary>可用資料與練習方式</summary><p>開始後可查閱本情境允許的物件、行情與區域資料。透過對話理解更多需求；資料尚未查證時，請保留判斷。</p></details>
    </article><aside className={styles.missionRail}><p className={styles.eyebrow}>Your focus</p><h3>這次練習的重點</h3>
      <p>{skillText(briefing.skillFocus)}</p><ul className={styles.objectives}>{briefing.objectives.map((objective) => <li key={objective.objectiveId}><ShieldCheck size={18} aria-hidden="true" /><span>{objective.label}</span></li>)}</ul>
      <button onClick={startSession} className={styles.primary}>開始情境練習 <ArrowUpRight size={18} /></button><small>模擬對話，從一則開放式提問開始。</small>
    </aside></div>
  </section>;

  if (screen === 'RESULT' && result && workspace) {
    const recommendation = experience.suggestNextScenario(result);
    const positive = result.evidence.filter((item) => item.kind === 'POSITIVE');
    const negative = result.evidence.filter((item) => item.kind === 'NEGATIVE');
    const risks = result.evidence.filter((item) => item.kind === 'RISK');
    return <section ref={headingRef} className={styles.experience} aria-labelledby="training-result-heading">
      <button onClick={returnHome} className={styles.back}><ArrowLeft size={17} />返回情境庫</button>
      <header className={styles.resultHeading}><p className={styles.eyebrow}>Reflection / {result.scenarioId}</p><h2 id="training-result-heading" tabIndex={-1}>每一次對話，都有值得帶走的收穫。</h2><p>練習回饋 · {workspace.session.scenario.scenarioName}</p></header>
      <div className={styles.resultStatus} data-state={result.overallState} role="status"><ShieldCheck size={24} aria-hidden="true" /><div><strong>{resultStateLabel(result)}</strong>
        {result.overallState === 'REQUIRES_REVIEW' && <p>已觸發風險事件。請先複核相關表述，再繼續實際應用。</p>}
        {result.overallState === 'NEEDS_VERIFICATION' && <p>情境知識尚未查證；本次回饋不能視為法規、行情或契約的正式結論。</p>}
        {result.overallState === 'INSUFFICIENT_EVIDENCE' && <p>目前對話證據不足，暫不評分。再練習一次，讓表現有機會被看見。</p>}
      </div></div>
      {workspace.session.status === 'CANCELLED' && <p className={styles.cancelled}>本次練習已取消，並未完成情境。以下回饋僅依取消前的對話。</p>}
      <div className={styles.coaching}><section><span className={styles.sectionIndex}>01</span><h3>做得好的地方</h3><EvidenceList evidence={positive} timeline={workspace.session.timeline} empty="本次尚未形成足夠的正向證據。" /></section>
        <section><span className={styles.sectionIndex}>02</span><h3>可改善的地方</h3><EvidenceList evidence={negative} timeline={workspace.session.timeline} empty="本次沒有額外的負向目標證據。" /></section>
        <section className={styles.riskSection}><span className={styles.sectionIndex}>03</span><h3>風險與待確認事項</h3><EvidenceList evidence={risks} timeline={workspace.session.timeline} empty="尚未觸發風險事件。" /></section></div>
      <section className={styles.recommendation}><div><p className={styles.eyebrow}>Your next practice</p><h3>{recommendation.scenarioId} · {experience.listScenarios().find((scenario) => scenario.scenarioId === recommendation.scenarioId)?.name}</h3><p>{recommendation.reason}</p></div>
        <button onClick={() => openBriefing(recommendation.scenarioId)} className={styles.primary}>前往下一個練習 <ArrowUpRight size={18} /></button></section>
      <section className={styles.dimensions}><p className={styles.eyebrow}>Skills in context</p><h3>能力摘要</h3><ul>{result.dimensionResults.map((dimension) =>
        <li key={dimension.dimensionId}><span>{DIMENSION_LABELS[dimension.dimensionId]}</span><span>{dimension.state === 'SCORED' ? dimension.score + ' 分' : '證據不足'}</span></li>)}</ul></section>
      <aside className={styles.managerHandoff}><Link href="/training/manager/" className={styles.secondary}>查看店長教練視角 <ArrowUpRight size={17} /></Link><p>接著以合成受訓者範例，了解能力、風險與下一步練習。本次對話不會同步到管理端範例。</p></aside>
      <p className={styles.footerNote}>根據本次實際對話與事件形成回饋。AI 模擬建議不決定專業分數或風險判定。</p>
    </section>;
  }

  if (!workspace) return null;
  const terminal = workspace.session.status !== 'ACTIVE';
  const hints = promptHints[workspace.session.scenario.scenarioId] ?? [];
  const timeline = workspace.session.timeline.filter((event) => event.actor === 'AGENT' || event.actor === 'NPC');
  return <section ref={headingRef} className={styles.experience} aria-labelledby="training-simulation-heading">
    <div className={styles.workspaceBar}><button onClick={returnHome} className={styles.back}><ArrowLeft size={17} />返回情境庫</button>
      <button onClick={() => setContextOpen(true)} className={styles.contextButton} aria-haspopup="dialog" aria-expanded={contextOpen}><BookOpen size={17} />查看資料</button></div>
    <header className={styles.workspaceHeading}><div><p className={styles.eyebrow}>Practice session / {workspace.session.scenario.scenarioId}</p><h2 id="training-simulation-heading" tabIndex={-1}>{workspace.session.scenario.scenarioName}</h2></div>
      <span className={styles.badge}>{workspace.session.status === 'ACTIVE' ? '對話進行中' : workspace.session.status === 'COMPLETED' ? '情境已完成' : workspace.session.status === 'FAILED' ? '情境已結束' : '練習已取消'}</span></header>
    <div className={styles.workspace}><div className={styles.conversationColumn}>
      <section className={styles.npcPresence}><UsersRound size={30} strokeWidth={1.3} aria-hidden="true" /><div><small>模擬客戶／屋主</small><h3>{briefing?.persona}</h3><p>透過對話，理解尚未說出口的需求。</p></div></section>
      <section className={styles.situation} aria-label="目前情境狀態"><span>{relationshipLabel(workspace.session.scenario.npc.trust)}</span><span>{interestLabel(workspace.session.scenario.npc.interest)}</span><span>{pressureLabel(workspace.session.scenario.npc.pressure)}</span></section>
      <section className={styles.conversation} aria-label="NPC conversation">
        {timeline.length === 0 && <div className={styles.emptyConversation}><MessageCircle size={28} strokeWidth={1.2} /><h3>一段好對話，從傾聽開始。</h3><p>先介紹目的，或問一個開放式問題。</p></div>}
        <ol aria-live="polite">{timeline.map((event) => <li key={event.eventId} data-actor={event.actor}><small>{event.actor === 'NPC' ? '模擬對象' : '受訓者'} · 對話 #{event.sequence}</small><p>{event.message}</p></li>)}</ol>
      </section>
      {reaction && <section className={styles.reaction} aria-live="polite"><p>對話已有新的回應。</p>
        {reaction.revealedInformation.length > 0 && <p>新理解的需求：{reaction.revealedInformation.map((item) => item.label).join(' · ')}</p>}
        {reaction.eventTypes.length > 0 && <small>已記錄 {reaction.eventTypes.length} 項情境變化，可於回饋中追溯。</small>}</section>}
      {!terminal && <form className={styles.composer} onSubmit={submitMessage}><label htmlFor="training-message">下一句，試著這樣說。</label><textarea id="training-message" value={draft} onChange={(event) => setDraft(event.target.value)} rows={3} placeholder="先了解需求與目前最在意的條件…" />
        <details className={styles.hints}><summary>需要一個開場提示？</summary><div>{hints.map((hint) => <button key={hint} type="button" onClick={() => setDraft(hint)}>{hint}</button>)}</div></details>
        <div className={styles.composerActions}><button type="button" onClick={cancelSession} className={styles.secondary}>取消練習</button><button type="submit" disabled={!draft.trim()} className={styles.primary}>送出回應 <Send size={16} /></button></div></form>}
      {terminal && <section className={styles.terminal}><h3>{workspace.session.status === 'COMPLETED' ? '情境已完成' : workspace.session.status === 'FAILED' ? '情境已結束' : '練習已取消'}</h3><p>{workspace.session.status === 'CANCELLED' ? '可查看取消前的對話回饋；本次不列為完成。' : '停下來回顧，看看哪些話帶來改變。'}</p><button onClick={showResult} disabled={evaluating} className={styles.primary}>{evaluating ? '產生回饋中…' : '查看練習回饋'} <ArrowUpRight size={17} /></button></section>}
      {error && <p role="alert" className={styles.cancelled}>{error}</p>}
    </div><aside className={styles.contextRail}>{contextPanel}</aside></div>
    {contextOpen && <dialog ref={sheetRef} className={styles.contextSheet} aria-label="可用情境資料" onCancel={() => setContextOpen(false)} onClose={() => setContextOpen(false)}>
      <div className={styles.sheetHeader}><strong>情境資料</strong><button onClick={() => setContextOpen(false)} aria-label="關閉資料"><X size={20} /></button></div>{contextPanel}
    </dialog>}
  </section>;
}

function EvidenceList({ evidence, empty, timeline }: { evidence: readonly EvaluationEvidence[]; empty: string; timeline: TrainingWorkspaceView['session']['timeline'] }) {
    if (!evidence.length) return <p className={styles.emptyEvidence}>{empty}</p>;
    return <ul className={styles.evidence}>{groupTrainingEvidence(evidence).map((group) => { const item = group[0]; return <li key={item.evidenceId}>
      <p>{trainingFindingText(item.finding)}</p>
      <span>{eventReferenceText(item)}</span>
      <details><summary>查看對話與依據</summary>
        <p>相關能力：{[...new Set(group.map((entry) => DIMENSION_LABELS[entry.dimensionId]))].join('、')}</p>
        {timeline.filter((event) => item.references.some((reference) => 'eventId' in reference && reference.eventId === event.eventId)).map((event) => <blockquote key={event.eventId}>事件 #{event.sequence} · {trainingEventText(event)}</blockquote>)}
        <details><summary>開發證據詳情</summary>{group.map((entry) => <small key={entry.evidenceId}>{entry.evidenceId} · {entry.finding}<br /></small>)}</details>
      </details>
    </li>; })}</ul>;
  }
