import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from "@pwa-toolset/core";
import { storeFinderTranslationChunksConfig, storeFinderTranslations } from "@pwa-toolset/storefinder/assets";
import { StoreFinderRootModule, STORE_FINDER_FEATURE } from "@pwa-toolset/storefinder/root";

@NgModule({
  declarations: [],
  imports: [
    StoreFinderRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [STORE_FINDER_FEATURE]: {
        module: () =>
          import('@pwa-toolset/storefinder').then((m) => m.StoreFinderModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: storeFinderTranslations,
      chunks: storeFinderTranslationChunksConfig,
    },
  })
  ]
})
export class StoreFinderFeatureModule { }
