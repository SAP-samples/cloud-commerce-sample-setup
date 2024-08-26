// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule, Type } from '@angular/core';
import { CheckoutModule } from '@spartacus/checkout/base';
import { CheckoutB2BModule } from '@spartacus/checkout/b2b';
import { CheckoutScheduledReplenishmentModule } from '@spartacus/checkout/scheduled-replenishment';


const extensions: Type<any>[] = [];
extensions.push(CheckoutB2BModule, CheckoutScheduledReplenishmentModule);

@NgModule({
  imports: [CheckoutModule, ...extensions],
})
export class TmaCheckoutB2bWrapperModule {}
