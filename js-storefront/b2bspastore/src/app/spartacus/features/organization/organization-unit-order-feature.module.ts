import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from "@spartacus/core";
import { unitOrderTranslationChunksConfig, unitOrderTranslations } from "@spartacus/organization/unit-order/assets";
import { ORGANIZATION_UNIT_ORDER_FEATURE, UnitOrderRootModule } from "@spartacus/organization/unit-order/root";

@NgModule({
  declarations: [],
  imports: [
    UnitOrderRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [ORGANIZATION_UNIT_ORDER_FEATURE]: {
        module: () =>
          import('@spartacus/organization/unit-order').then((m) => m.UnitOrderModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: unitOrderTranslations,
      chunks: unitOrderTranslationChunksConfig,
    },
  })
  ]
})
export class OrganizationUnitOrderFeatureModule { }
