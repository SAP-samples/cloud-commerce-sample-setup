import { NgModule } from '@angular/core';
import { translationChunksConfig, translations } from "@spartacus/assets";
import { FeaturesConfig, I18nConfig, OccConfig, provideConfig, SiteContextConfig } from "@spartacus/core";
import { defaultCmsContentProviders, layoutConfig, mediaConfig } from "@spartacus/storefront";

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [provideConfig(layoutConfig), provideConfig(mediaConfig), ...defaultCmsContentProviders, provideConfig(<OccConfig>{
    backend: {
      occ: {
        // baseUrl: 'https://localhost:9002',
      }
    },
  }), provideConfig(<SiteContextConfig>{
    context: {
      currency: ['USD', 'GBP'],
      language: ['en', 'de', 'ja', 'zh'],
      baseSite: ['electronics-spa', 'apparel-uk-spa'],
      urlParameters: ['baseSite', 'language', 'currency']
    },
  }), provideConfig(<I18nConfig>{
    i18n: {
      resources: translations,
      chunks: translationChunksConfig,
      fallbackLang: 'en'
    },
  }), provideConfig(<FeaturesConfig>{
    features: {
      level: '4.3'
    }
  })]
})
export class SpartacusConfigurationModule { }
