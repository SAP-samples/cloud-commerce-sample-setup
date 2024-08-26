// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { BaseStorefrontModule } from '@spartacus/storefront';
import { TmaSpartacusB2bConfigurationModule } from './tma-spartacus-b2b-configuration.module';
import { TmaSpartacusB2bFeaturesModule } from './tma-spartacus-b2b-features.module';

@NgModule({
  imports: [
    BaseStorefrontModule,
    TmaSpartacusB2bFeaturesModule,
    TmaSpartacusB2bConfigurationModule
  ],
  exports: [BaseStorefrontModule],
})
export class TmaB2bSpartacusModule {}
