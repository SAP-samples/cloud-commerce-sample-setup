// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { IconModule, MediaModule, PromotionsModule, SpinnerModule, AtMessageModule } from '@spartacus/storefront';
import { TmaOrderSummaryComponent } from './order-summary/tma-order-summary.component';
import { TmaCartItemComponent } from './cart-item/tma-cart-item.component';
import { TmaCartItemListComponent } from './cart-item-list/tma-cart-item-list.component';
import { EffectsModule } from '@ngrx/effects';
import { TmaTmfCartEffect } from '../../../../core/tmf-cart/store/effects/tma-tmf-cart.effect';
import { TmaItemCounterModule } from '../../../shared/components/item-counter';
import {
  JourneyChecklistAppointmentModule,
  ChecklistInstallationAddressModule
} from '../../journey-checklist';
import { TmaCartItemPriceDisplayModule } from './cart-item-price-display/tma-cart-item-price-display.module';
import { TmaPurchaseReasonModule } from '../../purchase-reason';
import {
  TmaCartItemConfigurablePscvDisplayModule
} from './cart-item-configurable-pscv-display/tma-cart-item-configurable-pscv-display.module';
import { CartCouponModule, CartSharedModule } from '@spartacus/cart/base/components';
import {
  TmaLogicalResourcePickerModule
} from '../../journey-checklist/journey-checklist-logical-resource/tma-logical-resource-picker/tma-logical-resource-picker.module';
import { TmaConsumptionModule } from '../../consumption';
import { DependentProductModule } from '../../product/dependent-product/dependent-product.module';

@NgModule({
  providers: [DatePipe],
    imports: [
        CommonModule,
        RouterModule,
        AtMessageModule,
        CartCouponModule,
        ReactiveFormsModule,
        UrlModule,
        NgbModule,
        IconModule,
        PromotionsModule,
        I18nModule,
        MediaModule,
        TmaItemCounterModule,
        FeaturesConfigModule,
        SpinnerModule,
        TmaPurchaseReasonModule,
        JourneyChecklistAppointmentModule,
        TmaLogicalResourcePickerModule,
        ChecklistInstallationAddressModule,
        TmaCartItemPriceDisplayModule,
        TmaCartItemConfigurablePscvDisplayModule,
        EffectsModule.forFeature([TmaTmfCartEffect]),
        IconModule,
        TmaConsumptionModule,
        DependentProductModule
    ],
  declarations: [
    TmaCartItemComponent,
    TmaCartItemListComponent,
    TmaOrderSummaryComponent
  ],
  exports: [
    TmaCartItemComponent,
    TmaCartItemListComponent,
    TmaOrderSummaryComponent
  ]
})
export class TmaCartSharedModule extends CartSharedModule {}
