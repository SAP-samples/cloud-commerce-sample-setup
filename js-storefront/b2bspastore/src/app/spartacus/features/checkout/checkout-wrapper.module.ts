import { NgModule } from '@angular/core';
import { CheckoutB2BModule } from "@spartacus/checkout/b2b";
import { CheckoutModule } from "@spartacus/checkout/base";
import { CheckoutScheduledReplenishmentModule } from "@spartacus/checkout/scheduled-replenishment";

@NgModule({
  declarations: [],
  imports: [
    CheckoutModule,
    CheckoutB2BModule,
    CheckoutScheduledReplenishmentModule
  ]
})
export class CheckoutWrapperModule { }
