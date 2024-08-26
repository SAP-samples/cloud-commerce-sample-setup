/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmaProductChecklistComponent } from './tma-product-checklist.component';
import { CmsConfig, FeaturesConfigModule, I18nModule, provideDefaultConfig } from '@spartacus/core';
import {
  JourneyChecklistAppointmentModule,
  ChecklistInstallationAddressModule
} from '../../journey-checklist';
import { TmaProductSpecificationModule } from '../../product';
import {
    TmaLogicalResourcePickerModule
} from '../../journey-checklist/journey-checklist-logical-resource/tma-logical-resource-picker/tma-logical-resource-picker.module';
import { DependentProductModule } from '../../product/dependent-product/dependent-product.module';
import { TmaPurchaseReasonModule } from '../../purchase-reason';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    ChecklistInstallationAddressModule,
    TmaProductSpecificationModule,
    JourneyChecklistAppointmentModule,
    TmaLogicalResourcePickerModule,
    TmaPurchaseReasonModule,
    DependentProductModule,
    FeaturesConfigModule
  ],
  exports: [TmaProductChecklistComponent],
  declarations: [TmaProductChecklistComponent],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        ProductChecklistComponent: {
          component: TmaProductChecklistComponent
        }
      }
    })
  ]
})

export class TmaProductChecklistModule {}
