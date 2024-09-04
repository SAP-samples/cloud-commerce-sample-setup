import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from "@spartacus/core";
import { customerTicketingTranslationChunksConfig, customerTicketingTranslations } from "@spartacus/customer-ticketing/assets";
import { CUSTOMER_TICKETING_FEATURE, CustomerTicketingRootModule } from "@spartacus/customer-ticketing/root";

@NgModule({
  declarations: [],
  imports: [
    CustomerTicketingRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [CUSTOMER_TICKETING_FEATURE]: {
        module: () =>
          import('@spartacus/customer-ticketing').then((m) => m.CustomerTicketingModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: customerTicketingTranslations,
      chunks: customerTicketingTranslationChunksConfig,
    },
  })
  ]
})
export class CustomerTicketingFeatureModule { }
