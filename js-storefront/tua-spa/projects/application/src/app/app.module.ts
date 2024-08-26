// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { translationChunksConfig, translations } from '@spartacus/assets';
import { ConfigModule, FeaturesConfig, I18nConfig, provideConfig } from '@spartacus/core';
import { tmaTranslations } from '../../../tua-spa/src/assets';
import { TmaSpartacusModule } from '../../../tua-spa/src/storefrontlib';
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
    TmaSpartacusModule,
    ConfigModule.withConfig({
      i18n: {
        resources: tmaTranslations,
      },
    })
  ],
  providers: [
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
        directDebitFeature: true,
        purchaseWithAssuranceFeature: true
      },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
