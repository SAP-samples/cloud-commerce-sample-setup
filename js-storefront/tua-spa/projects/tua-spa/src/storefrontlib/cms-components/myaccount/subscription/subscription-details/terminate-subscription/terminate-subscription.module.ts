// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { I18nModule } from '@spartacus/core';
import { CardModule, FormErrorsModule, IconModule, KeyboardFocusModule, SpinnerModule } from '@spartacus/storefront';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TmaCartSharedModule } from '../../../../cart';
import { TmaPriceDisplayModule } from '../../../../product/price/price-display/tma-price-display.module';
import { TerminationButtonComponent } from './termination-button/termination-button.component';
import { CheckoutPaymentMethodModule } from '@spartacus/checkout/base/components';
import { TerminationConfirmModule } from './termination-confirm/termination-confirm.module';

@NgModule({
  declarations: [
    TerminationButtonComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    I18nModule,
    SpinnerModule,
    NgxSpinnerModule,
    CheckoutPaymentMethodModule,
    CardModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormErrorsModule,
    IconModule,
    TmaPriceDisplayModule,
    TmaCartSharedModule,
    KeyboardFocusModule,
    TerminationConfirmModule
  ],
  exports: [TerminationButtonComponent]
})
export class TerminateSubscriptionModule { }
