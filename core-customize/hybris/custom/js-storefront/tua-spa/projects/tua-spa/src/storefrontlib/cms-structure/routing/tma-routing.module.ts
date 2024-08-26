// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  AuthGuard,
  provideConfig,
  RoutingModule as CoreRoutingModule,
  RoutingModule
} from '@spartacus/core';
import { CmsPageGuard, CmsRouteModule, PageLayoutComponent } from '@spartacus/storefront';
import { defaultTmaSelfcareRoutingConfig } from '../../../core/tmf/adapters/selfcare';
import { defaultTmaRoutingConfig } from './tma-default-routing-config';
import { RouterModule } from '@angular/router';
import { TmaCommodityServiceDetailsGuard } from '../guards';

@NgModule({
  imports: [
    CoreRoutingModule.forRoot(), CmsRouteModule,
    RouterModule.forChild([
      {
        // @ts-ignore
        path: 'my-account/selfcare',
        canActivate: [AuthGuard, CmsPageGuard],
        component: PageLayoutComponent
      },
      {
        path: 'product/:productCode',
        component: PageLayoutComponent,
        canActivate: [CmsPageGuard, TmaCommodityServiceDetailsGuard],
      },
      {
        path: 'p/:productCode',
        component: PageLayoutComponent,
        canActivate: [CmsPageGuard, TmaCommodityServiceDetailsGuard],
      }
    ]),]
})
export class TmaRoutingModule extends RoutingModule {
  static forRoot(): ModuleWithProviders<TmaRoutingModule> {
    return {
      ngModule: TmaRoutingModule,
      providers: [
        TmaCommodityServiceDetailsGuard,
        provideConfig(defaultTmaRoutingConfig),
        provideConfig(defaultTmaSelfcareRoutingConfig)
      ]
    };
  }
}
