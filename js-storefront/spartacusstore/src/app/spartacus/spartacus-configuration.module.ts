import { NgModule } from '@angular/core';
import { translationChunksConfig, translations } from "@spartacus/assets";
import { OccConfig } from '@spartacus/core';
import { provideConfig } from "@spartacus/core";
import { defaultCmsContentProviders, layoutConfig, mediaConfig } from "@spartacus/storefront";
import { environment } from 'src/environments/environment';

const occConfig: OccConfig = { backend: { occ: {} } };
// only provide the `occ.baseUrl` key if it is explicitly configured, otherwise the value of
// <meta name="occ-backend-base-url" > is ignored.
// This in turn breaks the deployment in CCv2.
// https://github.com/SAP/spartacus/issues/5886
occConfig.backend.occ.prefix = '/occ/v2/'
if (environment.occBaseUrl) {
  occConfig.backend.occ.baseUrl = environment.occBaseUrl;
}

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [provideConfig(layoutConfig), provideConfig(mediaConfig), ...defaultCmsContentProviders, provideConfig({
    backend: occConfig.backend,
    smartEdit: {
      storefrontPreviewRoute: 'cx-preview',
      //TODO: adjust origins as necessary
      allowOrigin: 'localhost:9002, *.*.model-t.cc.commerce.ondemand.com:443, *.*.model-t.cc.commerce.ondemand.com',
    },
    context: {
      urlParameters: ['baseSite', 'language', 'currency'],
      baseSite: ['powertools-spa'],
      currency: ['USD','GPY'],
      language: ['en'],
    },
    i18n: {
      resources: translations,
      chunks: translationChunksConfig,
      fallbackLang: 'en'
    },
    features: {
      level: '3.2'
    }
  })]
})
export class SpartacusConfigurationModule { }
