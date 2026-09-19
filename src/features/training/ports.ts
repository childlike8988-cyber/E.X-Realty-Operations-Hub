export type TrainingSnapshotSource = 'MOCK' | 'VERIFIED';

export type PropertySnapshot = {
  propertyRef: string;
  source: TrainingSnapshotSource;
  capturedAt: string;
  summary: string;
  facts: Readonly<Record<string, string | number | boolean>>;
};

export type MarketSnapshot = {
  marketSnapshotRef: string;
  regionRef: string;
  source: TrainingSnapshotSource;
  capturedAt: string;
  summary: string;
  facts: Readonly<Record<string, string | number | boolean>>;
};

export type RegionSnapshot = {
  regionRef: string;
  source: TrainingSnapshotSource;
  capturedAt: string;
  summary: string;
  facts: Readonly<Record<string, string | number | boolean>>;
};

export type VerifiedKnowledgeSnapshot = {
  refId: string;
  source: string;
  version: string;
  effectiveDate: string;
  verifiedAt: string;
  ruleId: string;
  verificationState: 'VERIFIED' | 'NEEDS_VERIFICATION';
  content: string;
};

export type AgentScopeSnapshot = {
  organizationId: string;
  agentRef: string;
  displayLabel: string;
  allowedScenarioIds: readonly string[];
};

/** Read-only bridge to Property; Training never writes property records. */
export interface PropertySnapshotReader {
  getPropertySnapshot(propertyRef: string): Promise<PropertySnapshot | null>;
}

/** Read-only bridge to Market; Training never writes market records. */
export interface MarketSnapshotReader {
  getMarketSnapshot(marketSnapshotRef: string): Promise<MarketSnapshot | null>;
}

/** Read-only bridge to Region; Training never writes region records. */
export interface RegionSnapshotReader {
  getRegionSnapshot(regionRef: string): Promise<RegionSnapshot | null>;
}

/** Only verified-source references may become authoritative evaluation context. */
export interface VerifiedKnowledgeReader {
  getKnowledgeReference(refId: string): Promise<VerifiedKnowledgeSnapshot | null>;
}

/** Provides the agent and organization scope without owning agent persistence. */
export interface AgentScopeReader {
  getAgentScope(agentRef: string): Promise<AgentScopeSnapshot | null>;
}
