'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight, BarChart3, CheckCircle2, ChevronRight, ClipboardList, Eye, ShieldAlert, UsersRound } from 'lucide-react';
import { createSyntheticManagerTrainingFixture } from '@/features/training/manager/mock-fixture';
import { TrainingManagerReadModel } from '@/features/training/manager/read-model';
import { DIMENSION_LABELS, type DimensionId } from '@/features/training/evaluation/contracts';
import type { ManagerAgentFilter, ManagerEvidenceDrilldown, ManagerRiskEvent } from '@/features/training/manager/contracts';
import styles from './training-visual.module.css';
import { trainingFindingText, trainingEventText } from './training-presentation';

const FILTERS: readonly { id: ManagerAgentFilter; label: string }[] = [
  { id: 'ALL', label: '全部' },
  { id: 'NEEDS_COACHING', label: '需要教練' },
  { id: 'RISK_REVIEW', label: '風險複核' },
  { id: 'RECENTLY_ACTIVE', label: '近期練習' },
];

const skillStateLabel = {
  STRONG: '穩定表現',
  DEVELOPING: '持續發展',
  NEEDS_PRACTICE: '需要練習',
  INSUFFICIENT_EVIDENCE: '證據不足',
} as const;

const trendLabel = {
  IMPROVING: '近期提升',
  STABLE: '表現穩定',
  NEEDS_ATTENTION: '需要留意',
  INSUFFICIENT_EVIDENCE: '尚不足以判讀趨勢',
} as const;

function resultStateLabel(value: string): string {
  if (value === 'REQUIRES_REVIEW') return '需要複核';
  if (value === 'NEEDS_VERIFICATION') return '需要查證';
  if (value === 'INSUFFICIENT_EVIDENCE') return '證據不足';
  if (value === 'STRONG') return '表現穩定';
  if (value === 'DEVELOPING') return '正在發展';
  return '需要練習';
}

function riskLabel(value: string): string {
  if (value === 'REQUIRES_REVIEW') return '需要複核';
  if (value === 'NEEDS_VERIFICATION') return '需要查證';
  return '未標記風險';
}

function formatDate(value: string | null): string {
  if (!value || !Number.isFinite(Date.parse(value))) return '尚無紀錄';
  return new Intl.DateTimeFormat('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

function dimensionLabel(value: DimensionId | null): string {
  return value ? DIMENSION_LABELS[value] : '尚在累積證據';
}

let fixturePromise: ReturnType<typeof createSyntheticManagerTrainingFixture> | null = null;
function loadManagerFixture() {
  fixturePromise ??= createSyntheticManagerTrainingFixture();
  return fixturePromise;
}

/** Showcase-only Manager surface. Domain interpretation stays inside TrainingManagerReadModel. */
export function TrainingManagerExperience() {
  const [model, setModel] = useState<TrainingManagerReadModel | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<ManagerAgentFilter>('ALL');
  const [selectedAgentRef, setSelectedAgentRef] = useState<string | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<DimensionId>('NEEDS_DISCOVERY');
  const [selectedEvidence, setSelectedEvidence] = useState<ManagerEvidenceDrilldown | null>(null);
  const [focusRequest, setFocusRequest] = useState<{ id: string } | null>(null);
  const [evidenceOpener, setEvidenceOpener] = useState('manager-evidence-heading');

  useEffect(() => {
    if (!focusRequest) return;
    const target = document.getElementById(focusRequest.id);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [focusRequest]);

  useEffect(() => {
    let live = true;
    void loadManagerFixture()
      .then((fixture) => { if (live) setModel(new TrainingManagerReadModel(fixture)); })
      .catch(() => { if (live) setError('合成展示資料目前無法載入；沒有使用替代或虛構的管理結果。'); });
    return () => { live = false; };
  }, []);

  const overview = useMemo(() => model?.getManagerTrainingOverview() ?? null, [model]);
  const summaries = useMemo(() => model?.listAgentSummaries(filter) ?? [], [filter, model]);
  const activeAgentRef = selectedAgentRef && summaries.some((summary) => summary.agent.agentRef === selectedAgentRef)
    ? selectedAgentRef : summaries[0]?.agent.agentRef ?? overview?.recommendedAgent?.agent.agentRef ?? null;
  const detail = useMemo(() => model && activeAgentRef ? model.getAgentTrainingDetail(activeAgentRef) : null, [activeAgentRef, model]);
  const evidence = useMemo(() => model && detail ? model.getDimensionEvidence(detail.summary.agent.agentRef, selectedDimension) : [], [detail, model, selectedDimension]);

  function selectAgent(agentRef: string) {
    setSelectedAgentRef(agentRef);
    setSelectedEvidence(null);
    const summary = model?.getAgentTrainingSummary(agentRef);
    setSelectedDimension(summary?.primaryWeakness ?? 'NEEDS_DISCOVERY');
    setFocusRequest({ id: 'manager-agent-detail-heading' });
  }

  function selectRisk(risk: ManagerRiskEvent) {
    if (!model) return;
    setFilter('ALL');
    selectAgent(risk.agent.agentRef);
    setSelectedEvidence(model.getEvidenceDrilldown(risk.resultId, risk.evidenceId));
    setEvidenceOpener(`risk-${risk.riskId}`);
    setFocusRequest({ id: 'manager-evidence-heading' });
  }

  if (error) return <section className={`${styles.experience} ${styles.manager}`} aria-live="polite"><p className={styles.managerError}>{error}</p></section>;
  if (!model || !overview || !detail) return <section className={`${styles.experience} ${styles.manager}`} aria-live="polite"><p className={styles.managerLoading}>正在整理訓練紀錄…</p></section>;

  return <section className={`${styles.experience} ${styles.manager}`} aria-labelledby="training-manager-heading">
    <header className={styles.managerHero}>
      <div>
        <p className={styles.eyebrow}>Training · Coaching overview</p>
        <h1 id="training-manager-heading">把練習，變成有方向的陪練。</h1>
        <p className={styles.managerLead}>誰需要協助、卡在哪裡、下一步練什麼。</p>
      </div>
      <div className={styles.managerHeroActions}>
        <span className={styles.managerDemoLabel}>合成展示資料 · 非正式權限系統</span>
        <Link href="/training/" className={styles.secondary}><ArrowLeft size={17} />返回受訓入口</Link>
      </div>
    </header>

    <p className={styles.managerDisclosure}>示範組織 · 以下為合成受訓者的練習紀錄。與受訓入口的本次對話分開，不代表真實員工評估。</p>

    <section className={styles.managerStats} aria-label="訓練概況">
      <article><UsersRound size={22} aria-hidden="true" /><strong>{overview.agentCount}</strong><span>位合成受訓者</span></article>
      <article><CheckCircle2 size={22} aria-hidden="true" /><strong>{overview.completedScenarioCount}</strong><span>個完成情境</span></article>
      <article><ClipboardList size={22} aria-hidden="true" /><strong>{overview.needsCoachingCount}</strong><span>位需要教練跟進</span></article>
      <article data-risk-count={overview.riskReviewCount > 0}><ShieldAlert size={22} aria-hidden="true" /><strong>{overview.riskReviewCount}</strong><span>筆風險／待查證事項</span></article>
    </section>

    <div className={styles.managerLayout}>
      <section className={styles.managerAgents} aria-labelledby="manager-agent-list-heading">
        <div className={styles.managerSectionHeading}>
          <div><p className={styles.eyebrow}>Coaching view</p><h2 id="manager-agent-list-heading">誰需要下一次練習？</h2></div>
          <div className={styles.managerFilters} aria-label="受訓者篩選">
            {FILTERS.map((item) => <button key={item.id} type="button" className={styles.managerFilter} aria-pressed={filter === item.id} onClick={() => { setFilter(item.id); setSelectedEvidence(null); }}>{item.label}</button>)}
          </div>
        </div>
        <ul className={styles.managerAgentList}>
          {summaries.map((summary) => <li key={summary.agent.agentRef}>
            <button id={`agent-${summary.agent.agentRef}`} type="button" className={styles.managerAgentRow} aria-pressed={activeAgentRef === summary.agent.agentRef} data-active={activeAgentRef === summary.agent.agentRef} onClick={() => selectAgent(summary.agent.agentRef)}>
              <span className={styles.managerAvatar} aria-hidden="true">{summary.agent.displayName.slice(0, 1)}</span>
              <span className={styles.managerAgentBody}><strong>{summary.agent.displayName}</strong><small>{summary.agent.trainingStage} · 最近練習 {formatDate(summary.recentTrainingAt)}</small></span>
              <span className={styles.managerAgentSignals}>
                <small>{summary.keyStrength ? `強項：${dimensionLabel(summary.keyStrength)}` : '尚在累積證據'}</small>
                <b data-risk={summary.riskStatus}>{summary.riskStatus === 'NONE' ? (summary.primaryWeakness ? `加強：${dimensionLabel(summary.primaryWeakness)}` : '可持續練習') : riskLabel(summary.riskStatus)}</b>
              </span>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </li>)}
        </ul>
      </section>

      <article className={styles.managerDetail} aria-labelledby="manager-agent-detail-heading">
        <div className={styles.managerDetailTop}>
          <div><button className={styles.back} onClick={() => setFocusRequest({ id: `agent-${detail.summary.agent.agentRef}` })}><ArrowLeft size={16} />返回人員選擇</button><p className={styles.eyebrow}>Agent training summary</p><h2 id="manager-agent-detail-heading" tabIndex={-1}>{detail.summary.agent.displayName}</h2><p>{detail.summary.agent.trainingStage} · {detail.summary.completedScenarioCount} 個完成情境</p></div>
          <span className={styles.badge} data-risk={detail.summary.riskStatus}>{detail.summary.riskStatus === 'NONE' ? '持續累積' : riskLabel(detail.summary.riskStatus)}</span>
        </div>

        <section className={styles.managerProfile} aria-labelledby="manager-profile-heading">
          <div className={styles.managerSectionHeading}><div><p className={styles.eyebrow}>Skill profile</p><h3 id="manager-profile-heading">不只看分數，先看證據。</h3></div><BarChart3 size={20} aria-hidden="true" /></div>
          <div className={styles.managerSkillMatrix}>
            {detail.skillMatrix.map((row) => <button key={row.dimensionId} type="button" className={styles.managerSkill} aria-pressed={selectedDimension === row.dimensionId} data-selected={selectedDimension === row.dimensionId} data-state={row.state} onClick={() => { setSelectedDimension(row.dimensionId); setSelectedEvidence(null); setFocusRequest({ id: 'manager-evidence-heading' }); }}>
              <span><strong>{row.label}</strong><small>{skillStateLabel[row.state]} · {trendLabel[row.trend]}</small></span>
              <b>{row.score === null ? '證據不足' : `${Math.round(row.score)} / 100`}</b>
            </button>)}
          </div>
        </section>

        <section className={styles.managerEvidence} aria-labelledby="manager-evidence-heading">
          <div className={styles.managerSectionHeading}><div><p className={styles.eyebrow}>Why</p><h3 id="manager-evidence-heading" tabIndex={-1}>{selectedEvidence?.dimensionLabel ?? detail.skillMatrix.find((row) => row.dimensionId === selectedDimension)?.label} 的練習依據</h3></div><Eye size={20} aria-hidden="true" /></div>
          {selectedEvidence ? <><button className={styles.back} onClick={() => { setSelectedEvidence(null); setFocusRequest({ id: evidenceOpener }); }}><ArrowLeft size={16} />返回依據來源</button><EvidenceDetail evidence={selectedEvidence} /></> : evidence.length ? <ul className={styles.managerEvidenceList}>{evidence.map((item) => <li key={item.evidenceId}><button id={`evidence-${item.evidenceId}`} type="button" onClick={() => { setSelectedEvidence(item); setEvidenceOpener(`evidence-${item.evidenceId}`); setFocusRequest({ id: 'manager-evidence-heading' }); }}><span><b>{trainingFindingText(item.finding)}</b><small>{item.result.scenarioName} · {resultStateLabel(item.result.overallState)}</small></span><ChevronRight size={17} aria-hidden="true" /></button></li>)}</ul> : <p className={styles.managerEmpty}>此面向尚無足夠的可追溯事件證據；請以後續情境累積觀察。</p>}
        </section>

        <section className={styles.managerHistory} aria-labelledby="manager-history-heading">
          <div className={styles.managerSectionHeading}><div><p className={styles.eyebrow}>Recent training</p><h3 id="manager-history-heading">情境紀錄</h3></div></div>
          <ul>{detail.results.map((result) => <li key={result.resultId}><span><strong>{result.scenarioName}</strong><small>{formatDate(result.createdAt)} · {result.objectiveResult === 'MET' ? '完成目標' : result.objectiveResult === 'PARTIAL' ? '部分完成' : '未完成目標'}</small></span><b data-risk={result.riskStatus}>{resultStateLabel(result.overallState)}</b></li>)}</ul>
        </section>

        {detail.recommendation && <section className={styles.managerRecommendation} aria-labelledby="manager-recommendation-heading"><div><p className={styles.eyebrow}>Next deliberate practice</p><h3 id="manager-recommendation-heading">建議下一步：{detail.recommendation.scenarioName}</h3><p>{detail.recommendation.reason}</p></div><Link href={`/training/?scenario=${encodeURIComponent(detail.recommendation.scenarioId)}`} className={styles.primary}>查看情境 <ArrowUpRight size={17} /></Link></section>}
      </article>
    </div>

    <section className={styles.managerRiskQueue} aria-labelledby="manager-risk-heading">
      <div className={styles.managerSectionHeading}><div><p className={styles.eyebrow}>Independent review queue</p><h2 id="manager-risk-heading">風險與待查證，不由平均分數掩蓋。</h2></div><ShieldAlert size={22} aria-hidden="true" /></div>
      <ul>{model.listRiskEvents().map((risk) => <li key={risk.riskId}><button id={`risk-${risk.riskId}`} type="button" data-risk={risk.severity} onClick={() => selectRisk(risk)}><span><strong>{risk.agent.displayName} · {risk.scenarioName}</strong><small>{trainingFindingText(risk.summary)}</small></span><b>{riskLabel(risk.severity)}</b><ChevronRight size={18} aria-hidden="true" /></button></li>)}</ul>
    </section>
  </section>;
}

function EvidenceDetail({ evidence }: { evidence: ManagerEvidenceDrilldown }) {
  return <div className={styles.managerEvidenceDetail}>
    <p className={styles.managerEvidenceKind}>{evidence.kind === 'RISK' ? '風險事件' : evidence.kind === 'POSITIVE' ? '做得好的地方' : '需要回顧的地方'}</p>
    <p>{trainingFindingText(evidence.finding)}</p>
    <p className={styles.evidenceContext}>{evidence.result.scenarioName} · {resultStateLabel(evidence.result.overallState)} · {formatDate(evidence.result.createdAt)}</p>
    <ul>{evidence.events.map((event) => <li key={`${event.sequence}-${event.eventType}`}><strong>事件 #{event.sequence} · {event.actor === 'AGENT' ? '受訓者' : event.actor === 'NPC' ? '模擬對象' : '系統紀錄'}</strong><span>{trainingEventText(event)}</span></li>)}</ul>
    <small>{evidence.sourceLabels.join(' · ')} · {evidence.verificationState === 'VERIFIED' ? '來源已驗證' : '仍需查證'}</small>
    <details><summary>開發追溯資料</summary><small>{evidence.evidenceId} · {evidence.result.resultId}</small><p>{evidence.finding}</p>{evidence.events.map((event) => <p key={event.sequence}>#{event.sequence} · {event.message}</p>)}</details>
  </div>;
}
