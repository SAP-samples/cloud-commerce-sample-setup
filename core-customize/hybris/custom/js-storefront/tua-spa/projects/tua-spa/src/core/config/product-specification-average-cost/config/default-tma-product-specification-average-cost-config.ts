// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaProductSpecificationAverageCostConfig } from './tma-product-specification-average-cost-config';

/**
 * Default configuration for the product specification average cost
 */
export const defaultTmaProductSpecificationAverageCostConfig: TmaProductSpecificationAverageCostConfig = {
  /**
   * The product specification types
   */
  productSpecificationAverageCost: [
    'electricity',
    'gas'
  ]
};
