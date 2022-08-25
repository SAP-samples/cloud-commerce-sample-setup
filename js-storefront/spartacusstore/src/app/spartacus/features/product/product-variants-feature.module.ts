import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from "@pwa-toolset/core";
import { productVariantsTranslationChunksConfig, productVariantsTranslations } from "@pwa-toolset/product/variants/assets";
import { ProductVariantsRootModule, PRODUCT_VARIANTS_FEATURE } from "@pwa-toolset/product/variants/root";

@NgModule({
  declarations: [],
  imports: [
    ProductVariantsRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [PRODUCT_VARIANTS_FEATURE]: {
        module: () =>
          import('@pwa-toolset/product/variants').then((m) => m.ProductVariantsModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: productVariantsTranslations,
      chunks: productVariantsTranslationChunksConfig,
    },
  })
  ]
})
export class ProductVariantsFeatureModule { }
