// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule } from '@spartacus/core';
import { TmaUsageChargeComponent } from './usage-charge/tma-usage-charge.component';
import { TmaRecurringChargeComponent } from './recurring-charge/tma-recurring-charge.component';
import { TmaOneTimeChargeComponent } from './one-time-charge/tma-one-time-charge.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
  ],
  declarations: [TmaOneTimeChargeComponent, TmaRecurringChargeComponent, TmaUsageChargeComponent],
  exports: [TmaOneTimeChargeComponent, TmaRecurringChargeComponent, TmaUsageChargeComponent]
})
export class TmaPriceModule {
}
