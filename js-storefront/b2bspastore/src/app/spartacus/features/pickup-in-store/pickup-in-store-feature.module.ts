import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from "@spartacus/core";
import { pickupInStoreTranslationChunksConfig, pickupInStoreTranslationsEn } from "@spartacus/pickup-in-store/assets";
import { PICKUP_IN_STORE_FEATURE, PickupInStoreRootModule } from "@spartacus/pickup-in-store/root";

@NgModule({
  declarations: [],
  imports: [
    PickupInStoreRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [PICKUP_IN_STORE_FEATURE]: {
        module: () =>
          import('@spartacus/pickup-in-store').then((m) => m.PickupInStoreModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: { en: pickupInStoreTranslationsEn },
      chunks: pickupInStoreTranslationChunksConfig,
    },
  })
  ]
})
export class PickupInStoreFeatureModule { }
