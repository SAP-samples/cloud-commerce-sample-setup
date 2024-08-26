// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';
import { orderTranslationChunksConfig, orderTranslations } from '@spartacus/order/assets';
import { ORDER_FEATURE, OrderRootModule } from '@spartacus/order/root';
import { OrderConnector } from '@spartacus/order/core';
import { TmaOrderWrapperModule } from './tma-order-wrapper.module';

@NgModule({
  imports: [OrderRootModule],
  providers: [
    OrderConnector,
    provideConfig(<CmsConfig>{
      featureModules: {
        [ORDER_FEATURE]: {
          module: () => import('./tma-order-wrapper.module').then((m) => m.TmaOrderWrapperModule),
        },
      },
    }),
    provideConfig(<I18nConfig>{
      i18n: {
        resources: orderTranslations,
        chunks: orderTranslationChunksConfig,
        fallbackLang: 'en',
      },
    })
  ],
})
export class TmaOrderFeatureModule {}
