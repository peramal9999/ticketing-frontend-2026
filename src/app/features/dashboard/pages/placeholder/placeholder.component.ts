import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-7xl">
      <div
        class="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-surface-300 bg-surface-0/60 p-12 text-center dark:border-surface-700 dark:bg-surface-900/60"
      >
        <span class="material-icons text-[48px] text-brand-500">auto_awesome</span>
        <h1 class="mt-4 text-2xl font-bold text-surface-900 dark:text-surface-50">{{ title }}</h1>
        <p class="mt-2 max-w-md text-sm text-surface-500 dark:text-surface-400">
          This page is scaffolded. Wire up feature components here.
        </p>
      </div>
    </section>
  `,
})
export class PlaceholderComponent {
  private readonly route = inject(ActivatedRoute);
  readonly title = (this.route.snapshot.data['title'] as string) ?? 'Coming Soon';
}
