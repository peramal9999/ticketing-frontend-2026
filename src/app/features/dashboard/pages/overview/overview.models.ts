export type RangeMode = 'days' | 'weeks';

export type KpiAccent = 'brand' | 'red' | 'green' | 'sky';
export type BadgeTone = 'up' | 'critical' | 'info' | 'neutral';
export type ClusterStatus = 'critical' | 'optimal' | 'stable';

export interface KpiCard {
  label: string;
  value: string;
  accent: KpiAccent;
  badge?: { text: string; tone: BadgeTone };
}

export interface PriorityBucket {
  label: string;
  color: string;
  percent: number;
}

export interface LedgerUpdate {
  icon: string;
  tint: string;
  title: string;
  ticketId: string;
  detail?: string;
  actor: string;
  at: string;
}

export interface ClusterHealth {
  name: string;
  activeTickets: number;
  status: ClusterStatus;
}

export interface ChartPoint {
  label: string;
  value: number;
}
