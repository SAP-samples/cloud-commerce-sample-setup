import { NgModule } from '@angular/core';
import { checkoutTranslationChunksConfig, checkoutTranslations } from "@pwa-toolset/checkout/assets";
import { CheckoutRootModule, CHECKOUT_FEATURE } from "@pwa-toolset/checkout/root";
import { CmsConfig, I18nConfig, provideConfig } from "@pwa-toolset/core";

@NgModule({
  declarations: [],
  imports: [
    CheckoutRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [CHECKOUT_FEATURE]: {
        module: () =>
          import('@pwa-toolset/checkout').then((m) => m.CheckoutModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: checkoutTranslations,
      chunks: checkoutTranslationChunksConfig,
    },
  })
  ]
})
export class CheckoutFeatureModule { }
