import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  ChartPoint,
  ClusterHealth,
  ClusterStatus,
  KpiCard,
  LedgerUpdate,
  PriorityBucket,
  RangeMode,
} from './overview.models';

@Component({
  selector: 'app-overview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-7xl space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-brand-700 sm:text-3xl dark:text-brand-300">
            System Overview
          </h1>
          <p class="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Real-time performance and ticket distribution across clusters.
          </p>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-surface-200 bg-surface-0 px-4 py-2 text-sm font-semibold text-surface-700 hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-200 dark:hover:bg-surface-800"
          >
            <span class="material-icons text-[18px]">description</span>
            Generate Report
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <span class="material-icons text-[18px]">add</span>
            New Ticket
          </button>
        </div>
      </div>

      <!-- KPI cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        @for (card of kpiCards; track card.label) {
          <div
            class="relative overflow-hidden rounded-xl border border-surface-200 bg-surface-0 p-5 dark:border-surface-800 dark:bg-surface-900"
          >
            <p class="text-[10px] font-bold uppercase tracking-[0.15em] text-surface-500 dark:text-surface-400">
              {{ card.label }}
            </p>
            <div class="mt-3 flex items-end justify-between gap-2">
              <span
                class="text-3xl font-extrabold"
                [class.text-brand-700]="card.accent === 'brand'"
                [class.dark:text-brand-300]="card.accent === 'brand'"
                [class.text-red-600]="card.accent === 'red'"
                [class.dark:text-red-400]="card.accent === 'red'"
                [class.text-emerald-600]="card.accent === 'green'"
                [class.dark:text-emerald-400]="card.accent === 'green'"
                [class.text-sky-600]="card.accent === 'sky'"
                [class.dark:text-sky-300]="card.accent === 'sky'"
              >
                {{ card.value }}
              </span>
              @if (card.badge) {
                <span
                  class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold"
                  [class.bg-sky-100]="card.badge.tone === 'up' || card.badge.tone === 'info'"
                  [class.text-sky-700]="card.badge.tone === 'up' || card.badge.tone === 'info'"
                  [class.dark:bg-sky-900/40]="card.badge.tone === 'up' || card.badge.tone === 'info'"
                  [class.dark:text-sky-300]="card.badge.tone === 'up' || card.badge.tone === 'info'"
                  [class.bg-red-100]="card.badge.tone === 'critical'"
                  [class.text-red-700]="card.badge.tone === 'critical'"
                  [class.dark:bg-red-900/40]="card.badge.tone === 'critical'"
                  [class.dark:text-red-300]="card.badge.tone === 'critical'"
                  [class.bg-surface-100]="card.badge.tone === 'neutral'"
                  [class.text-surface-700]="card.badge.tone === 'neutral'"
                >
                  @if (card.badge.tone === 'up') {
                    <span class="material-icons text-[14px]">trending_up</span>
                  }
                  {{ card.badge.text }}
                </span>
              }
            </div>
          </div>
        }
      </div>

      <!-- Chart + Priority -->
      <div class="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <!-- Ticket volume -->
        <div
          class="rounded-xl border border-surface-200 bg-surface-0 p-5 dark:border-surface-800 dark:bg-surface-900"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-50">
                Ticket Volume
              </h2>
              <p class="text-sm text-surface-500 dark:text-surface-400">
                {{ rangeMode() === 'days' ? 'Daily ticket influx over last 7 days' : 'Weekly ticket influx' }}
              </p>
            </div>
            <div
              class="inline-flex rounded-lg bg-surface-100 p-1 text-xs font-semibold dark:bg-surface-800"
            >
              <button
                type="button"
                (click)="rangeMode.set('days')"
                [class.bg-surface-0]="rangeMode() === 'days'"
                [class.text-surface-900]="rangeMode() === 'days'"
                [class.dark:bg-surface-700]="rangeMode() === 'days'"
                [class.dark:text-surface-50]="rangeMode() === 'days'"
                [class.shadow]="rangeMode() === 'days'"
                [class.text-surface-500]="rangeMode() !== 'days'"
                class="rounded-md px-3 py-1"
              >
                Days
              </button>
              <button
                type="button"
                (click)="rangeMode.set('weeks')"
                [class.bg-surface-0]="rangeMode() === 'weeks'"
                [class.text-surface-900]="rangeMode() === 'weeks'"
                [class.dark:bg-surface-700]="rangeMode() === 'weeks'"
                [class.dark:text-surface-50]="rangeMode() === 'weeks'"
                [class.shadow]="rangeMode() === 'weeks'"
                [class.text-surface-500]="rangeMode() !== 'weeks'"
                class="rounded-md px-3 py-1"
              >
                Weeks
              </button>
            </div>
          </div>

          <!-- Lightweight chart using CSS bars -->
          <div class="mt-6 flex h-56 items-end justify-between gap-2 sm:h-64">
            @for (point of chartPoints(); track point.label) {
              <div class="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div
                  class="w-full max-w-10 rounded-t-md bg-gradient-to-t from-brand-600 to-brand-300 transition-all"
                  [style.height.%]="point.value"
                ></div>
                <span class="text-[10px] font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
                  {{ point.label }}
                </span>
              </div>
            }
          </div>
        </div>

        <!-- Priority distribution -->
        <div
          class="rounded-xl border border-surface-200 bg-surface-0 p-5 dark:border-surface-800 dark:bg-surface-900"
        >
          <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-50">
            Priority Distribution
          </h2>
          <p class="text-sm text-surface-500 dark:text-surface-400">
            Current active workload by severity
          </p>

          <div class="mt-6 flex items-center justify-center">
            <div
              class="relative flex h-44 w-44 items-center justify-center rounded-full"
              [style.background]="donutBackground()"
            >
              <div
                class="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-surface-0 dark:bg-surface-900"
              >
                <span class="text-3xl font-extrabold text-surface-900 dark:text-surface-50">1.2k</span>
                <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-500 dark:text-surface-400">
                  Total
                </span>
              </div>
            </div>
          </div>

          <ul class="mt-6 space-y-2.5 text-sm">
            @for (bucket of priorityBuckets; track bucket.label) {
              <li class="flex items-center justify-between">
                <span class="flex items-center gap-2">
                  <span class="h-3 w-3 rounded-sm" [style.background]="bucket.color"></span>
                  <span class="text-surface-700 dark:text-surface-200">{{ bucket.label }}</span>
                </span>
                <span class="font-semibold text-surface-900 dark:text-surface-50">{{ bucket.percent }}%</span>
              </li>
            }
          </ul>
        </div>
      </div>

      <!-- Recent updates + Cluster health -->
      <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div
          class="rounded-xl border border-surface-200 bg-surface-0 p-5 dark:border-surface-800 dark:bg-surface-900"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-50">
              Recent Ledger Updates
            </h2>
            <a
              href="#"
              class="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300"
            >
              View All
            </a>
          </div>
          <ul class="mt-4 space-y-4">
            @for (update of ledgerUpdates; track update.ticketId + update.at) {
              <li class="flex gap-3">
                <span
                  class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  [class]="update.tint"
                >
                  <span class="material-icons text-[18px]">{{ update.icon }}</span>
                </span>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-surface-900 dark:text-surface-50">
                    {{ update.title }}
                    <a href="#" class="text-brand-600 dark:text-brand-300">{{ update.ticketId }}</a>
                  </p>
                  @if (update.detail) {
                    <p class="mt-0.5 border-l-2 border-surface-200 pl-3 text-sm text-surface-600 italic dark:border-surface-700 dark:text-surface-300">
                      "{{ update.detail }}"
                    </p>
                  }
                  <p class="mt-1 text-xs text-surface-500 dark:text-surface-400">
                    {{ update.actor }} &bull; {{ update.at }}
                  </p>
                </div>
              </li>
            }
          </ul>
        </div>

        <div
          class="rounded-xl border border-surface-200 bg-surface-0 p-5 dark:border-surface-800 dark:bg-surface-900"
        >
          <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-50">Cluster Health</h2>
          <ul class="mt-4 space-y-4">
            @for (cluster of clusters; track cluster.name) {
              <li class="flex items-center gap-4">
                <span
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-200"
                >
                  <span class="material-icons text-[20px]">storage</span>
                </span>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-surface-900 dark:text-surface-50">{{ cluster.name }}</p>
                  <p class="text-xs text-surface-500 dark:text-surface-400">
                    {{ cluster.activeTickets }} active tickets
                  </p>
                </div>
                <div class="flex w-32 flex-col items-end gap-1">
                  <div class="h-1.5 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
                    <div
                      class="h-full rounded-full"
                      [class.bg-red-500]="cluster.status === 'critical'"
                      [class.bg-brand-500]="cluster.status === 'optimal'"
                      [class.bg-sky-400]="cluster.status === 'stable'"
                      [style.width.%]="getStatusWidth(cluster.status)"
                    ></div>
                  </div>
                  <span
                    class="text-[10px] font-bold uppercase tracking-wide"
                    [class.text-red-600]="cluster.status === 'critical'"
                    [class.dark:text-red-400]="cluster.status === 'critical'"
                    [class.text-brand-600]="cluster.status === 'optimal'"
                    [class.dark:text-brand-300]="cluster.status === 'optimal'"
                    [class.text-sky-600]="cluster.status === 'stable'"
                    [class.dark:text-sky-300]="cluster.status === 'stable'"
                  >
                    {{ cluster.status }} health
                  </span>
                </div>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
})
export class OverviewComponent {
  readonly rangeMode = signal<RangeMode>('days');

  readonly kpiCards: KpiCard[] = [
    { label: 'Total Active Tickets', value: '1,284', accent: 'brand', badge: { text: '12%', tone: 'up' } },
    { label: 'Tickets Overdue (SLA)', value: '42', accent: 'red', badge: { text: 'Critical', tone: 'critical' } },
    { label: 'Resolved Today', value: '156', accent: 'green', badge: { text: '+14.2%', tone: 'info' } },
    { label: 'New Tickets', value: '89', accent: 'sky', badge: { text: 'Last 6h', tone: 'info' } },
  ];

  readonly priorityBuckets: PriorityBucket[] = [
    { label: 'Critical', color: '#dc2626', percent: 15 },
    { label: 'High', color: '#0ea5e9', percent: 25 },
    { label: 'Medium', color: '#7dd3fc', percent: 45 },
    { label: 'Low', color: '#cbd5e1', percent: 15 },
  ];

  readonly ledgerUpdates: LedgerUpdate[] = [
    {
      icon: 'chat',
      tint: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
      title: 'New comment on',
      ticketId: '#AL-982',
      detail:
        'The server latency issues have been replicated in the staging environment. Proceeding with patch.',
      actor: 'John Doe',
      at: '12 mins ago',
    },
    {
      icon: 'check_circle',
      tint: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
      title: 'Ticket Resolved',
      ticketId: '#AL-741',
      actor: 'Sarah Jenkins',
      at: '45 mins ago',
    },
    {
      icon: 'swap_horiz',
      tint: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
      title: 'Status change: In Progress',
      ticketId: '#AL-1024',
      actor: 'Auto-System',
      at: '2 hours ago',
    },
  ];

  readonly clusters: ClusterHealth[] = [
    { name: 'Core Infrastructure', activeTickets: 424, status: 'critical' },
    { name: 'Cloud Portal UI', activeTickets: 128, status: 'optimal' },
    { name: 'Data Warehouse', activeTickets: 312, status: 'stable' },
  ];

  readonly chartPoints = computed<ChartPoint[]>(() => {
    if (this.rangeMode() === 'days') {
      return [
        { label: 'Mon', value: 55 },
        { label: 'Tue', value: 70 },
        { label: 'Wed', value: 48 },
        { label: 'Thu', value: 82 },
        { label: 'Fri', value: 92 },
        { label: 'Sat', value: 36 },
        { label: 'Sun', value: 28 },
      ];
    }
    return [
      { label: 'W1', value: 60 },
      { label: 'W2', value: 78 },
      { label: 'W3', value: 52 },
      { label: 'W4', value: 88 },
    ];
  });

  readonly donutBackground = computed(() => {
    let runningPercent = 0;
    const stops = this.priorityBuckets
      .map((bucket) => {
        const from = runningPercent;
        runningPercent += bucket.percent;
        return `${bucket.color} ${from}% ${runningPercent}%`;
      })
      .join(', ');
    return `conic-gradient(${stops})`;
  });

  getStatusWidth(status: ClusterStatus): number {
    return status === 'critical' ? 90 : status === 'stable' ? 60 : 40;
  }
}
