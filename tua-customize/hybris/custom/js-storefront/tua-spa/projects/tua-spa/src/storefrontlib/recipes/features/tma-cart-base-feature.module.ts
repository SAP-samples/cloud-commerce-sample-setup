// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { cartBaseTranslationChunksConfig, cartBaseTranslations } from '@spartacus/cart/base/assets';
import { ADD_TO_CART_FEATURE, CART_BASE_FEATURE, CartBaseRootModule, MINI_CART_FEATURE } from '@spartacus/cart/base/root';
import { provideConfig } from '@spartacus/core';

@NgModule({
  imports: [CartBaseRootModule],
  providers: [
    provideConfig({
      featureModules: {
        [CART_BASE_FEATURE]: {
          module: () =>
            import('../../../core').then((m) => m.TmaCartModule),
        },
      },
    }),
    provideConfig({
      featureModules: {
        [MINI_CART_FEATURE]: {
          module: () =>
            import('@spartacus/cart/base/components/mini-cart').then(
              (m) => m.MiniCartModule
            ),
        },
      },
    }),
    provideConfig({
      featureModules: {
        [ADD_TO_CART_FEATURE]: {
          module: () =>
            import('../../cms-components/cart/add-to-cart/tma-add-to-cart.module').then(
              (m) => m.TmaAddToCartModule
            ),
        },
      },
    }),
    provideConfig({
      i18n: {
        resources: cartBaseTranslations,
        chunks: cartBaseTranslationChunksConfig,
        fallbackLang: 'en',
      },
    }),
  ],
})
export class TmaCartBaseFeatureModule {}
