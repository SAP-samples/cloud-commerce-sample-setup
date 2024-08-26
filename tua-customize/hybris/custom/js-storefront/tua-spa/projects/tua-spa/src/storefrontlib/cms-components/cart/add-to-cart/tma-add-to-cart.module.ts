// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CmsConfig, FeaturesConfigModule, I18nModule, provideConfig, UrlModule } from '@spartacus/core';
import { IconModule, ItemCounterModule, SpinnerModule } from '@spartacus/storefront';
import { TmaAddToCartComponent } from './tma-add-to-cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  JourneyChecklistAppointmentModule,
  ChecklistInstallationAddressModule
} from '../../journey-checklist';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TmaProductSpecificationModule } from '../../product';
import { AddToCartModule } from '@spartacus/cart/base/components/add-to-cart';
import {TmaTechnicalIdFormModule} from "../../technical-id-form";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SpinnerModule,
    NgxSpinnerModule,
    FeaturesConfigModule,
    UrlModule,
    IconModule,
    I18nModule,
    ItemCounterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideConfig(<CmsConfig>{
      cmsComponents: {
        ProductAddToCartComponent: {
          component: TmaAddToCartComponent,
        },
      },
    }),
  ],
  declarations: [TmaAddToCartComponent],
  exports: [TmaAddToCartComponent]
})
export class TmaAddToCartModule extends AddToCartModule {
}
