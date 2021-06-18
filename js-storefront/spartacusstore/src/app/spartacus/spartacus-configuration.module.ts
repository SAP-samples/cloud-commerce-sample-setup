import { NgModule } from '@angular/core';
import { translationChunksConfig, translations } from "@spartacus/assets";
import { FeaturesConfig, I18nConfig, OccConfig, provideConfig, SiteContextConfig } from '@spartacus/core';
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
      allowOrigin: 'localhost:9002, *.*.model-t.cc.commerce.ondemand.com:443',
    },
    context: {
      urlParameters: ['baseSite', 'language', 'currency'],
      baseSite: ['electronics-spa'],
      currency: ['USD'],
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
  }), provideConfig(<SiteContextConfig>{
    context: {
      currency: ['USD'],
      language: ['en'],
    },
  }), provideConfig(<I18nConfig>{
    i18n: {
      resources: translations,
      chunks: translationChunksConfig,
      fallbackLang: 'en'
    },
  }), provideConfig(<FeaturesConfig>{
    features: {
      level: '3.4'
    }
  })]
})
export class SpartacusConfigurationModule { }
