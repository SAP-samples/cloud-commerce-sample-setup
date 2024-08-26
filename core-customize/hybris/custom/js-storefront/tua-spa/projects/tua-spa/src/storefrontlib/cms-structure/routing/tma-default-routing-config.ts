// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { RoutesConfig, RoutingConfig } from '@spartacus/core';

export const defaultTmaStorefrontRoutesConfig: RoutesConfig = {
  product: {
    paths: ['product/:productCode']
  },
  category: {
    paths: ['c/:categoryCode'],
  },
  usageConsumption: {
    paths: ['my-account/subscription/subscription-base/:subscriptionId'],
    paramsMapping: { subscriptionId: 'code' },
  },
  subscriptions: {
    paths: ['/my-account/subscription'],
  },
  cgs: {
    paths: ['cgs/:bpoCode/:process'],
    paramsMapping: { bpoCode: 'code', process: 'process' }
  },
  subscriptionDetail: {
    paths: ['my-account/subscription/subscriptionDetail/:subscriptionId'],
    paramsMapping: { subscriptionId: 'code' }
  },
  setUpAService: {
    paths:['/set-up-a-service']
  },
  productCarouselSearch: {
    paths: ['set-up-a-service/plp'],
  },
  commodityProductDetails: {
    paths: ['set-up-a-service/plp/:productCode'],
    paramsMapping: {productCode: 'code'}
  },
  switchProvider: {
    paths: ['/switch-provider'],
  },
  productCarouselSearchSwitchProvider: {
    paths: ['switch-provider/plp'],
  },
  commodityProductDetailsSwitchProvider: {
    paths: ['switch-provider/plp/:productCode'],
    paramsMapping: {productCode: 'code'}
  },
};

export const defaultTmaRoutingConfig: RoutingConfig = {
  routing: {
    routes: defaultTmaStorefrontRoutesConfig
  }
};
