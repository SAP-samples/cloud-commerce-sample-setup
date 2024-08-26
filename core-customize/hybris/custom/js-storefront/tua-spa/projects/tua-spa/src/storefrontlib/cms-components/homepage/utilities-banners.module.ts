// Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { MediaModule } from '@spartacus/storefront';
import { PowerInHourHandComponent } from './power-in-your-hand-banner/power-in-hour-hand.component';
import { InformationalBannerComponent } from './informational-banner/informational-banner.component';
import { GetOnlineSupportBannerComponent } from './get-online-support-banner/get-online-support-banner.component';
import { SetUpAServiceBannerComponent } from './set-up-a-service-banner';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    I18nModule,
    FormsModule,
    ConfigModule.withConfig({
      cmsComponents: {
        UtilitiesHompagePutThePowerOfEnergyComponent: {
          component: PowerInHourHandComponent
        },
        UtilitiesHompageInformationalComponent: {
          component: InformationalBannerComponent
        },
        UtilitiesHompageGetOnlineSupportComponent: {
          component: GetOnlineSupportBannerComponent
        },
        TmaSetUpAServiceBannerComponent: {
          component: SetUpAServiceBannerComponent
        }
      }
    }),
    MediaModule
  ],
  exports: [
    PowerInHourHandComponent,
    InformationalBannerComponent,
    GetOnlineSupportBannerComponent,
    SetUpAServiceBannerComponent
  ],
  declarations: [
    PowerInHourHandComponent,
    InformationalBannerComponent,
    GetOnlineSupportBannerComponent,
    SetUpAServiceBannerComponent
  ]
})
export class UtilitiesBannersModule {
}
