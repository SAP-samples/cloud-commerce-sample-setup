import { NgModule } from '@angular/core';
import { checkoutB2BTranslationChunksConfig, checkoutB2BTranslations } from "@spartacus/checkout/b2b/assets";
import { CheckoutB2BRootModule } from "@spartacus/checkout/b2b/root";
import { checkoutTranslationChunksConfig, checkoutTranslations } from "@spartacus/checkout/base/assets";
import { CheckoutRootModule, CHECKOUT_FEATURE } from "@spartacus/checkout/base/root";
import { checkoutScheduledReplenishmentTranslationChunksConfig, checkoutScheduledReplenishmentTranslations } from "@spartacus/checkout/scheduled-replenishment/assets";
import { CheckoutScheduledReplenishmentRootModule } from "@spartacus/checkout/scheduled-replenishment/root";
import { CmsConfig, I18nConfig, provideConfig } from "@spartacus/core";

@NgModule({
  declarations: [],
  imports: [
    CheckoutRootModule,
    CheckoutB2BRootModule,
    CheckoutScheduledReplenishmentRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [CHECKOUT_FEATURE]: {
        module: () =>
          import('./checkout-wrapper.module').then((m) => m.CheckoutWrapperModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: checkoutTranslations,
      chunks: checkoutTranslationChunksConfig,
    },
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: checkoutB2BTranslations,
      chunks: checkoutB2BTranslationChunksConfig,
    },
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: checkoutScheduledReplenishmentTranslations,
      chunks: checkoutScheduledReplenishmentTranslationChunksConfig,
    },
  })
  ]
})
export class CheckoutFeatureModule { }
