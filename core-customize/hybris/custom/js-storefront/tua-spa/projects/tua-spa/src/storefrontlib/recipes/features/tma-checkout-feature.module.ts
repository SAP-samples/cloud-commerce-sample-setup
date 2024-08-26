// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CHECKOUT_FEATURE, CheckoutRootModule } from '@spartacus/checkout/base/root';
import { CmsConfig, provideConfig } from '@spartacus/core';
import { checkoutTranslationChunksConfig, checkoutTranslations } from '@spartacus/checkout/base/assets';

@NgModule({
  imports: [
    CheckoutRootModule
  ],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        [CHECKOUT_FEATURE]: {
          module: () =>
            import('./tma-checkout-wrapper.module').then(
              (m) => m.TmaCheckoutWrapperModule
            ),
        },
      },
    }),
    provideConfig({
      i18n: {
        resources: checkoutTranslations,
        chunks: checkoutTranslationChunksConfig,
      },
    }),
  ]
})
export class TmaCheckoutFeatureModule {}
