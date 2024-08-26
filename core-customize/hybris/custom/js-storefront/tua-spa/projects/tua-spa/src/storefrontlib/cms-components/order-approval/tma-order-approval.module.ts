// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthGuard, CmsConfig, ConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { TmaOrderApprovalListComponent } from './tma-order-approval-list';
import { IconModule, ListNavigationModule, MediaModule, ProductImagesModule } from '@spartacus/storefront';
import { TmaOrderApprovalListItemComponent } from './tma-order-approval-list-item';
import { TmaApproverGuard } from '../../../core/product-order/store/guards';
import { TmaOrderDetailsDropdownComponent } from './tma-order-details-dropdown';
import { TmaOrderDetailsRowComponent } from './tma-order-details-row';
import { TmaOrderDetailsSummaryComponent } from './tma-order-details-summary';
import { TmaOrderDetailsHierarchicalPricesComponent } from './tma-order-details-hierarchical-prices';
import { TmaOrderDetailsHierarchicalPriceComponent } from './tma-order-details-hierarchical-price';

@NgModule({
  imports: [
    CommonModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        OrderApprovalListComponent: {
          component: TmaOrderApprovalListComponent,
          guards: [AuthGuard, TmaApproverGuard]
        }
      }
    }),
    UrlModule,
    RouterModule,
    ListNavigationModule,
    I18nModule,
    IconModule,
    ProductImagesModule,
    MediaModule
  ],
  declarations: [
    TmaOrderApprovalListComponent,
    TmaOrderApprovalListItemComponent,
    TmaOrderDetailsDropdownComponent,
    TmaOrderDetailsRowComponent,
    TmaOrderDetailsSummaryComponent,
    TmaOrderDetailsHierarchicalPricesComponent,
    TmaOrderDetailsHierarchicalPriceComponent
  ],
  exports: [
    TmaOrderApprovalListComponent,
    TmaOrderApprovalListItemComponent,
    TmaOrderDetailsDropdownComponent,
    TmaOrderDetailsRowComponent,
    TmaOrderDetailsSummaryComponent,
    TmaOrderDetailsHierarchicalPricesComponent,
    TmaOrderDetailsHierarchicalPriceComponent
  ]
})
export class TmaOrderApprovalModule {
}
