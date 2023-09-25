import { NgModule } from '@angular/core';
import { CheckoutB2BModule } from "@spartacus/checkout/b2b";
import { CheckoutModule } from "@spartacus/checkout/base";

@NgModule({
  declarations: [],
  imports: [
    CheckoutModule,
    CheckoutB2BModule
  ]
})
export class CheckoutWrapperModule { }
