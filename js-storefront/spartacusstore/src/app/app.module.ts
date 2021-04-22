import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { translations, translationChunksConfig } from '@spartacus/assets';
import { B2cStorefrontModule } from '@spartacus/storefront';
import { OccConfig } from '@spartacus/core';
import { environment } from 'src/environments/environment';

const occConfig: OccConfig = { backend: { occ: {} } };
// only provide the `occ.baseUrl` key if it is explicitly configured, otherwise the value of
// <meta name="occ-backend-base-url" > is ignored.
// This in turn breaks the deployment in CCv2
// https://github.com/SAP/spartacus/issues/5886
occConfig.backend.occ.prefix = '/occ/v2/';
if (environment.occBaseUrl) {
  occConfig.backend.occ.baseUrl = environment.occBaseUrl;
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    B2cStorefrontModule.withConfig({
      backend: occConfig.backend,
      context: {
        currency: ['USD'],
        language: ['en'],
        baseSite: ['electronics-spa']
      },
      i18n: {
        resources: translations,
        chunks: translationChunksConfig,
        fallbackLang: 'en'
      },
      features: {
        level: '3.1'
      }
    }),
    BrowserTransferStateModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
