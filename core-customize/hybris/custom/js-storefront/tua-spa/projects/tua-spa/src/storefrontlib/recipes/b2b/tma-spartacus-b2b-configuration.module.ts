// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { OccConfig, provideConfig, SiteContextConfig } from '@spartacus/core';
import { defaultB2bOccConfig } from '@spartacus/setup';
import { defaultCmsContentProviders, layoutConfig, mediaConfig, PWAModuleConfig } from '@spartacus/storefront';
import {
  PremiseLookupConfig,
  TmfAppointmentConfig,
  TmfConfig,
  TmfQueryServiceQualificationConfig,
  TmfResourcePoolManagementConfig
} from '../../../core';
import {
  defaultTmaB2bLayoutConfig,
  defaultTmaB2bOrderApprovalConfig,
  defaultTmaB2bOrganizationAdministrationConfig
} from './config/index';
import { defaultB2BCheckoutConfig } from '@spartacus/checkout/b2b/root';
import { CartConfig } from '@spartacus/cart/base/root';

const LOCALHOST = 'https://api.cy8u-telcoacce1-s12-public.model-t.cc.commerce.ondemand.com';
const B2CTELCOTMFWEBSERVICES = '/b2ctelcotmfwebservices';

@NgModule({
  providers: [
    provideConfig(layoutConfig),
    provideConfig(mediaConfig),
    provideConfig(defaultTmaB2bLayoutConfig),
    provideConfig(defaultTmaB2bOrderApprovalConfig),
    provideConfig(defaultTmaB2bOrganizationAdministrationConfig),
    provideConfig(defaultB2bOccConfig),
    provideConfig(defaultB2BCheckoutConfig),
    ...defaultCmsContentProviders,
    provideConfig(<SiteContextConfig>{
      context: {
        urlParameters: ['baseSite', 'language', 'currency'],
        baseSite: ['b2btelcospa'],
        currency: ['USD'],
        language: ['en'],
      },
    }),
    provideConfig(<PWAModuleConfig>{
      pwa: {
        enabled: true,
        addToHomeScreen: true,
      },
    }),
    provideConfig(<CartConfig>{
      cart: {
        selectiveCart: {
          enabled: false,
        },
      },
    }),
    provideConfig(<TmfConfig>{
      backend: {
        tmf: {
          baseUrl: LOCALHOST,
          prefix: B2CTELCOTMFWEBSERVICES,
          version: '/v2',
          endpoints: {
            getProduct: {
              baseUrl: LOCALHOST,
              prefix: B2CTELCOTMFWEBSERVICES,
              version: '/v3',
              endpoint: '/product/${id}',
            },
            getProductOffering: {
              baseUrl: LOCALHOST,
              prefix: B2CTELCOTMFWEBSERVICES,
              version: '/v3',
              endpoint: '/productOffering/${id}',
            },
          },
        },
      },
    }),
    provideConfig(<OccConfig>{
      backend: {
        occ: {
          baseUrl: LOCALHOST,
          prefix: '/occ/v2/',
          endpoints: {
            addEntries: {
              default: 'orgUsers/${userId}/carts/${cartId}/entries?quantity=${quantity}&code=${code}'
            },
            placeOrder: {
              default: 'users/${userId}/orders'
            }
          }
        },
      },
    }),
    provideConfig(<TmfResourcePoolManagementConfig>{
      backend: {
        tmf_resource_pool_management: {
          baseUrl: LOCALHOST,
          prefix: '/b2ctelcomocks',
        },
      },
    }),
    provideConfig(<TmfAppointmentConfig>{
      backend: {
        tmf_appointment: {
          baseUrl: LOCALHOST,
          prefix: '/b2ctelcomocks',
        },
      },
    }),
    provideConfig(<PremiseLookupConfig>{
      backend: {
        premiseLookup: {
          baseUrl: LOCALHOST,
          prefix: '/b2ctelcomocks/premise/',
        },
      },
    }),
    provideConfig(<TmfQueryServiceQualificationConfig>{
      backend: {
        tmf_query_service_qualification: {
          baseUrl: LOCALHOST,
          prefix: '/b2ctelcomocks',
        },
      },
    }),
  ],
})
export class TmaSpartacusB2bConfigurationModule { }
