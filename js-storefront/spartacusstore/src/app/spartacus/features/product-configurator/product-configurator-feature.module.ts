import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from "@spartacus/core";
import { configuratorTranslationChunksConfig, configuratorTranslations } from "@spartacus/product-configurator/common/assets";
import { PRODUCT_CONFIGURATOR_RULEBASED_FEATURE, RulebasedConfiguratorRootModule } from "@spartacus/product-configurator/rulebased/root";
import { PRODUCT_CONFIGURATOR_TEXTFIELD_FEATURE, TextfieldConfiguratorRootModule } from "@spartacus/product-configurator/textfield/root";

@NgModule({
  declarations: [],
  imports: [
    RulebasedConfiguratorRootModule,
    TextfieldConfiguratorRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [PRODUCT_CONFIGURATOR_RULEBASED_FEATURE]: {
        module: () =>
          import('@spartacus/product-configurator/rulebased').then((m) => m.RulebasedConfiguratorModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: configuratorTranslations,
      chunks: configuratorTranslationChunksConfig,
    },
  }),
  provideConfig(<CmsConfig>{
    featureModules: {
      [PRODUCT_CONFIGURATOR_TEXTFIELD_FEATURE]: {
        module: () =>
          import('@spartacus/product-configurator/textfield').then((m) => m.TextfieldConfiguratorModule),
      },
    }
  })
  ]
})
export class ProductConfiguratorFeatureModule { }
