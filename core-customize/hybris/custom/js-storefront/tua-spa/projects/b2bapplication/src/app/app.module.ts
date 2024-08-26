// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { translationChunksConfig, translations } from '@spartacus/assets';
import { CmsConfig, ConfigModule, FeaturesConfig, I18nConfig, provideConfig } from '@spartacus/core';
import { tmaTranslations } from '../../../tua-spa/src/assets';
import { organizationTranslationChunksConfig, organizationTranslations } from '@spartacus/organization/administration/assets';
import { orderApprovalTranslationChunksConfig, orderApprovalTranslations } from '@spartacus/organization/order-approval/assets';
import { TmaB2bSpartacusModule } from '../../../tua-spa/src/storefrontlib';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    TmaB2bSpartacusModule,
    ConfigModule.withConfig({
      i18n: {
        resources: tmaTranslations,
      },
    }),
  ],
  providers: [

    provideConfig(<CmsConfig>{
      featureModules: {
        organizationAdministration: {
          module: () =>
            import('@spartacus/organization/administration').then(
              (m) => m.AdministrationModule
            ),
        },
      },
    }),
    provideConfig({
      i18n: {
        resources: organizationTranslations,
        chunks: organizationTranslationChunksConfig,
      },
    }),
    provideConfig(<CmsConfig>{
      featureModules: {
        organizationOrderApproval: {
          module: () =>
            import('@spartacus/organization/order-approval').then(
              (m) => m.OrderApprovalModule
            ),
        },
      },
    }),
    provideConfig({
      i18n: {
        resources: orderApprovalTranslations,
        chunks: orderApprovalTranslationChunksConfig,
      },
    }),
    provideConfig(<I18nConfig>{
      // we bring in static translations to be up and running soon right away
      i18n: {
        resources: translations,
        chunks: translationChunksConfig,
        fallbackLang: 'en',
      },
    }),
    provideConfig(<FeaturesConfig>{
      features: {
        level: '*',
      },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
