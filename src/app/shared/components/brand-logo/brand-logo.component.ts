import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: inline-flex;
      }
      .brand-logo-img {
        background: transparent;
        mix-blend-mode: multiply;
      }
      :host-context(html.dark) .brand-logo-img {
        mix-blend-mode: screen;
        filter: brightness(1.15);
      }
    `,
  ],
  template: `
    <img
      src="PSPLLOGO.png"
      alt="PSPL"
      class="brand-logo-img object-contain select-none"
      [class]="imgClass()"
      [style.height.px]="height()"
      width="auto"
      draggable="false"
    />
  `,
})
export class BrandLogoComponent {
  readonly height = input<number>(32);
  readonly imgClass = input<string>('');
}
