// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { ICON_TYPE, ViewComponent } from '@spartacus/storefront';

@Component({
  selector: 'cx-selfcare-card',
  templateUrl: './tma-card.component.html',
  styleUrls: ['./tma-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' }
})
export class TmaCardComponent {
  @Input() i18nRoot: string;
  @Input() previous: boolean | string = true;
  @Input() subtitle?: string;
  @Input() showHint? = false;

  protected itemKey;

  iconTypes = ICON_TYPE;

  @ViewChild(ViewComponent, { read: ViewComponent }) view: ViewComponent;

  constructor() {
  }

  /**
   * The views are router based, which means if we close a view, the router outlet is
   * cleaned immediately. To prevent this, we're closing the view manually, before
   * navigating back.
   */
  closeView(event: MouseEvent) {
    event.stopPropagation();
    this.view.toggle(true);

    setTimeout(() => {
      (event.target as HTMLElement)?.parentElement.click();
    }, 500);

    return false;
  }

  get previousLabel(): string {
    return this.previous as string;
  }
}
