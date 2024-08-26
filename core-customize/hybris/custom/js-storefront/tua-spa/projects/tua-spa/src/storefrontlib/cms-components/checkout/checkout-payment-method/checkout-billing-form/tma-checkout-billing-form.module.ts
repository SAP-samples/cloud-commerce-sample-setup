// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule, provideConfig } from '@spartacus/core';
import { RouterModule } from '@angular/router';
import { FormErrorsModule, NgSelectA11yModule, SpinnerModule } from '@spartacus/storefront';
import { TmaCheckoutBillingFormComponent } from './tma-checkout-billing-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckoutAdapter } from '@spartacus/checkout/base/core';
import { TmaCheckoutCardModule } from '../../../../shared/components/card/tma-checkout-card.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        I18nModule,
        SpinnerModule,
        NgSelectModule,
        FormErrorsModule,
        NgSelectA11yModule,
        ReactiveFormsModule,
        TmaCheckoutCardModule
    ],
  providers: [
    {
      provide: CheckoutAdapter,
      useExisting: CheckoutAdapter
    },
    provideConfig(
      {
        cmsComponents: {
          TmaCheckoutBillingFormComponent: {
            component: TmaCheckoutBillingFormComponent
          }
        }
      }
    )],
  declarations: [TmaCheckoutBillingFormComponent],
  exports: [TmaCheckoutBillingFormComponent]
})
export class TmaCheckoutBillingFormModule  {
}
