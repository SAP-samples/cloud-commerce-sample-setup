// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaProductSpecificationForViewDetailsConfig } from './tma-product-specification-for-view-details-config';

/**
 * Default configuration for the product specification details view
 */
export const defaultTmaProductSpecificationForViewDetailsConfig: TmaProductSpecificationForViewDetailsConfig = {
  /**
   * The product specification types
   */
  productSpecificationForViewDetails: [
    'electricity',
    'gas'
  ]
};
