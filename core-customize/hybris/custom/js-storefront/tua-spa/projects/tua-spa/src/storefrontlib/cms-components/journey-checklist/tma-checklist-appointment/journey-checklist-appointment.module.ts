// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {I18nModule} from '@spartacus/core';
import {FormErrorsModule, IconModule} from '@spartacus/storefront';
import {JourneyChecklistAppointmentComponent} from './journey-checklist-appointment.component';
import {TmaOrderApprovalModule} from '../../order-approval';
import {TmaPriceDisplayModule} from '../../product/price/price-display/tma-price-display.module';
import {TmaAddressFormModule} from '../../address-form';
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormErrorsModule,
    I18nModule,
    TmaOrderApprovalModule,
    IconModule,
    TmaPriceDisplayModule,
    TmaAddressFormModule,
    FormsModule,
    NgSelectModule
  ],
  declarations: [JourneyChecklistAppointmentComponent],
  exports: [JourneyChecklistAppointmentComponent]
})
export class JourneyChecklistAppointmentModule {
}
