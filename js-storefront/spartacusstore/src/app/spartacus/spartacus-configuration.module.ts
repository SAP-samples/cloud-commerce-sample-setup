import { NgModule } from '@angular/core';
import { translationChunksConfig, translations } from "@pwa-toolset/assets";
import { FeaturesConfig, I18nConfig, OccConfig, provideConfig, SiteContextConfig } from "@pwa-toolset/core";
import { defaultCmsContentProviders, layoutConfig, mediaConfig } from "@pwa-toolset/storefront";
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [provideConfig(layoutConfig), provideConfig(mediaConfig), ...defaultCmsContentProviders, provideConfig(<OccConfig>{
    backend: {
      occ: {
        baseUrl: environment.occBaseUrl
      }
    },
  }), provideConfig(<SiteContextConfig>{
    context: {
      // TODO: adjust parameters and site
      urlParameters: ['baseSite', 'language', 'currency'],
      baseSite: ['electronics-spa'],
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
      level: '4.1'
    }
  })]
})
export class SpartacusConfigurationModule { }
