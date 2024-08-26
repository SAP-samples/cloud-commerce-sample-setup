// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, provideConfig } from '@spartacus/core';
import { RouterModule } from '@angular/router';
import { GenericLinkModule, MediaModule } from '@spartacus/storefront';
import { NavigationBannerComponent } from './navigation-banner.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    GenericLinkModule,
    MediaModule,
  ],
  providers: [
    provideConfig(<CmsConfig>{
      cmsComponents: {
        NavigationBannerComponent: {
          component: NavigationBannerComponent,
        }
      },
    }),
  ],
  declarations: [NavigationBannerComponent],
  exports: [NavigationBannerComponent],
})
export class NavigationBannerModule {}
