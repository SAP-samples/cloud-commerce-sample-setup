import { NgModule } from '@angular/core';
import { translationChunksConfig, translations } from "@spartacus/assets";
import { CheckoutConfig } from '@spartacus/checkout/root';
import { FeaturesConfig, I18nConfig, OccConfig, provideConfig, CartConfig } from "@spartacus/core";
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
  }), provideConfig(<I18nConfig>{
    i18n: {
      resources: translations,
      chunks: translationChunksConfig,
      fallbackLang: 'en'
    },
  }),
  provideConfig(<CheckoutConfig> {
    checkout: {
      express: true,
      guest: true,
    }
  }), provideConfig(<CartConfig> {
    cart: {
      validation: true
    }
  }),provideConfig(<FeaturesConfig>{
    features: {
      level: '4.2'
    }
  })]
})
export class SpartacusConfigurationModule { }
