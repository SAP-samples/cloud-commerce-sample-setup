import { NgModule } from '@angular/core';
import { checkoutTranslationChunksConfig, checkoutTranslations } from "@spartacus/checkout/assets";
import { CheckoutRootModule, CHECKOUT_FEATURE } from "@spartacus/checkout/root";
import { CmsConfig, I18nConfig, provideConfig } from "@spartacus/core";

@NgModule({
  declarations: [],
  imports: [
    CheckoutRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [CHECKOUT_FEATURE]: {
        module: () =>
          import('@spartacus/checkout').then((m) => m.CheckoutModule),
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
