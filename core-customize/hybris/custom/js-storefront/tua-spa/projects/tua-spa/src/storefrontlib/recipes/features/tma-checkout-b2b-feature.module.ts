// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule, Provider, Type } from '@angular/core';
import { CHECKOUT_FEATURE, CheckoutRootModule } from '@spartacus/checkout/base/root';
import { CheckoutB2BRootModule } from '@spartacus/checkout/b2b/root';
import { CheckoutScheduledReplenishmentRootModule } from '@spartacus/checkout/scheduled-replenishment/root';
import { CmsConfig, provideConfig } from '@spartacus/core';
import { checkoutB2BTranslationChunksConfig, checkoutB2BTranslations } from '@spartacus/checkout/b2b/assets';
import {
  checkoutScheduledReplenishmentTranslationChunksConfig,
  checkoutScheduledReplenishmentTranslations
} from '@spartacus/checkout/scheduled-replenishment/assets';

const extensionModules: Type<any>[] = [];
const extensionProviders: Provider[] = [];

  extensionModules.push(
    CheckoutB2BRootModule,
    CheckoutScheduledReplenishmentRootModule
  );

  extensionProviders.push(
    provideConfig({
      i18n: {
        resources: checkoutB2BTranslations,
        chunks: checkoutB2BTranslationChunksConfig,
      },
    })
  );
  extensionProviders.push(
    provideConfig({
      i18n: {
        resources: checkoutScheduledReplenishmentTranslations,
        chunks: checkoutScheduledReplenishmentTranslationChunksConfig,
      },
    })
  );

@NgModule({
  imports: [
    CheckoutRootModule, ...extensionModules
  ],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        [CHECKOUT_FEATURE]: {
          module: () =>
            import('./tma-checkout-b2b-wrapper.module').then(
              (m) => m.TmaCheckoutB2bWrapperModule
            ),
        },
      },
    }),
    provideConfig({
      i18n: {
        resources: checkoutB2BTranslations,
        chunks: checkoutB2BTranslationChunksConfig,
      },
    }),
    provideConfig({
      i18n: {
        resources: checkoutScheduledReplenishmentTranslations,
        chunks: checkoutScheduledReplenishmentTranslationChunksConfig,
      },
    }),
  ],
  ...extensionProviders,
})
export class TmaCheckoutB2bFeatureModule {}
