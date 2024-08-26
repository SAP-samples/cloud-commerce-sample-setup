// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, HostBinding, OnInit } from '@angular/core';
import { CmsBannerComponent } from '@spartacus/core';
import { CmsComponentData } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'cx-selfcare-banner',
  templateUrl: './selfcare-banner.component.html'
})
export class SelfcareBannerComponent implements OnInit {
  @HostBinding('class') styleClasses: string;

  data$: Observable<CmsBannerComponent> = this.component.data$.pipe(
    tap((data) => (this.styleClasses = data.styleClasses))
  );

  constructor(protected component: CmsComponentData<CmsBannerComponent>) {}

  ngOnInit() {
  }

  /**
   * Returns `_blank` to force opening the link in a new window whenever the
   * `data.external` flag is set to true.
   */
  getTarget(data: CmsBannerComponent): string | null {
    return data.external === 'true' || data.external === true ? '_blank' : null;
  }
}
