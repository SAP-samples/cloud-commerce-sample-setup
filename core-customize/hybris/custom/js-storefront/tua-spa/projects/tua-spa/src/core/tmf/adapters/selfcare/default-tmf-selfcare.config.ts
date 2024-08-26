// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfConfig } from '../..';
import { LOCAL_STORAGE } from '../../../util/constants';

const { LOCALHOST } = LOCAL_STORAGE.HTTP_LINKS;

export const defaultTmfSelfcareConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
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
        getBillingAgreements: {
          baseUrl: LOCALHOST,
          prefix: '/agreementtmfwebservices',
          version: '/v2',
          endpoint: '/agreement'
        },
        getCustomerBills: {
          baseUrl: LOCALHOST,
          prefix: '/billmanagementtmfwebservices',
          version: '/v2',
          endpoint: '/customerBill'
        }
      }
    }
  }
};
