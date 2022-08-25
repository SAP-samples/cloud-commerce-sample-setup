import { NgModule } from '@angular/core';
import { quickOrderTranslationChunksConfig, quickOrderTranslations } from "@pwa-toolset/cart/quick-order/assets";
import { CART_QUICK_ORDER_FEATURE, QuickOrderRootModule } from "@pwa-toolset/cart/quick-order/root";
import { CmsConfig, I18nConfig, provideConfig } from "@pwa-toolset/core";

@NgModule({
  declarations: [],
  imports: [
    QuickOrderRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [CART_QUICK_ORDER_FEATURE]: {
        module: () =>
          import('@pwa-toolset/cart/quick-order').then((m) => m.QuickOrderModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: quickOrderTranslations,
      chunks: quickOrderTranslationChunksConfig,
    },
  })
  ]
})
export class CartQuickOrderFeatureModule { }
