// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { OrderCoreModule } from '@spartacus/order/core';
import { OrderOccModule } from '@spartacus/order/occ';
import { OrderComponentsModule } from '@spartacus/order/components';
import { TmaOrderOccModule } from '../../../core';
import { TmaOrderModule } from '../../cms-components/myaccount/order/tma-order.module';


@NgModule({
  imports: [
    OrderCoreModule,
    OrderOccModule,
    OrderComponentsModule,
    TmaOrderOccModule,
    TmaOrderModule
  ]
})
export class TmaOrderWrapperModule {}
