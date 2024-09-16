import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from "@spartacus/core";
import { futureStockTranslationChunksConfig, futureStockTranslations } from "@spartacus/product/future-stock/assets";
import { FutureStockRootModule, PRODUCT_FUTURE_STOCK_FEATURE } from "@spartacus/product/future-stock/root";

@NgModule({
  declarations: [],
  imports: [
    FutureStockRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [PRODUCT_FUTURE_STOCK_FEATURE]: {
        module: () =>
          import('@spartacus/product/future-stock').then((m) => m.FutureStockModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: futureStockTranslations,
      chunks: futureStockTranslationChunksConfig,
    },
  })
  ]
})
export class ProductFutureStockFeatureModule { }
