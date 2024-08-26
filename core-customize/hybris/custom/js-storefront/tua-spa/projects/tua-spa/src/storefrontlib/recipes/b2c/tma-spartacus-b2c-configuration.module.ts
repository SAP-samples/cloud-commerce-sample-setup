// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { OccConfig, provideConfig, SiteContextConfig } from '@spartacus/core';
import { defaultCmsContentProviders, layoutConfig, mediaConfig, PWAModuleConfig } from '@spartacus/storefront';
import { tmaB2cLayoutConfig } from './config/index';
import {
  DeliveryModeConfig,
  JourneyChecklistConfig,
  PremiseLookupConfig,
  TmfAppointmentConfig,
  TmfConfig,
  TmfQueryServiceQualificationConfig,
  TmfResourcePoolManagementConfig
} from '../../../core';
import { CartConfig } from '@spartacus/cart/base/root';
import { LOCAL_STORAGE } from '../../../core/util/constants';

const { LOCALHOST, B2CTELCOTMFWEBSERVICES } = LOCAL_STORAGE.HTTP_LINKS;

@NgModule({
  providers: [
    provideConfig(layoutConfig),
    provideConfig(mediaConfig),
    provideConfig(tmaB2cLayoutConfig),
    ...defaultCmsContentProviders,
    provideConfig(<SiteContextConfig>{
      context: {
        urlParameters: ['baseSite', 'language', 'currency'],
        baseSite: ['telcospa', 'utilitiesspa', 'mediaspa'],
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
              version: '/v2',
              endpoint: '/productOffering/${id}',
            },
            getSubscriptions: {
              baseUrl: LOCALHOST,
              prefix: '/subscribedproducttmfwebservices',
              version: '/v2',
              endpoint: '/product'
            },
            getBillingAccounts: {
              baseUrl: LOCALHOST,
              prefix: '/billingaccounttmfwebservices',
              version: '/v2',
              endpoint: '/billingAccount'
            },
            getCustomerBills: {
              baseUrl: LOCALHOST,
              prefix: '/billmanagementtmfwebservices',
              version: '/v2',
              endpoint: '/customerBill'
            },
            getBillingAgreements: {
              baseUrl: LOCALHOST,
              prefix: '/agreementtmfwebservices',
              version: '/v2',
              endpoint: '/agreement'
            },
            getProductOfferingQualification: {
              baseUrl: LOCALHOST,
              prefix: '/productqualificationtmfwebservices',
              version: '/v1',
              endpoint: '/productOfferingQualification'
            },
            getGeographicAddress: {
              baseUrl: LOCALHOST,
              prefix: B2CTELCOTMFWEBSERVICES,
              version: '/v3',
              endpoint: 'geographicAddress/${id}',
            },
            updateGeographicAddress: {
              baseUrl: LOCALHOST,
              prefix: B2CTELCOTMFWEBSERVICES,
              version: '/v2',
              endpoint: 'geographicAddress/${id}',
            },
            getPaymentMethod: {
              prefix: B2CTELCOTMFWEBSERVICES,
              version: '/v2',
              endpoint: 'paymentMethod/${id}'
            }
          },
        },
      },
    }),
    provideConfig(<OccConfig>{
      backend: {
        occ: {
          baseUrl: LOCALHOST,
          prefix: '/occ/v2/',
        },
      },
    }),
    provideConfig(<JourneyChecklistConfig>{
      journeyChecklistSteps: ['APPOINTMENT', 'MSISDN', 'INSTALLATION_ADDRESS'],
      msisdn_reservation: {
        msisdn_qty: 1,
        msisdn_capacity_amount_demand: 1,
        msisdn_applied_capacity_amount: 5,
        applied_capacity_amount_for_msisdn_reservation: 1,
      },
      appointment: {
        requested_number_of_timeslots: 5,
        end_date_of_timeslots: 3,
      },
    }),
    provideConfig(<DeliveryModeConfig>{
      deliveryMode: {
        default_delivery_mode: 'subscription-only-gross',
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
export class TmaSpartacusB2cConfigurationModule {}
