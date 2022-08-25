import { NgModule } from '@angular/core';
import { savedCartTranslationChunksConfig, savedCartTranslations } from "@pwa-toolset/cart/saved-cart/assets";
import { CART_SAVED_CART_FEATURE, SavedCartRootModule } from "@pwa-toolset/cart/saved-cart/root";
import { CmsConfig, I18nConfig, provideConfig } from "@pwa-toolset/core";

@NgModule({
  declarations: [],
  imports: [
    SavedCartRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [CART_SAVED_CART_FEATURE]: {
        module: () =>
          import('@pwa-toolset/cart/saved-cart').then((m) => m.SavedCartModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: savedCartTranslations,
      chunks: savedCartTranslationChunksConfig,
    },
  })
  ]
})
export class CartSavedCartFeatureModule { }
