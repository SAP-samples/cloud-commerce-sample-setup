// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { CardModule } from '@spartacus/storefront';
import { TmaOrderOverviewComponent } from './tma-order-overview.component';
import { OrderDetailsModule } from '@spartacus/order/components';

@NgModule({
    imports: [CommonModule, I18nModule, CardModule, OrderDetailsModule],
  declarations: [TmaOrderOverviewComponent],
  exports: [TmaOrderOverviewComponent]
})
export class TmaOrderOverviewModule {}
