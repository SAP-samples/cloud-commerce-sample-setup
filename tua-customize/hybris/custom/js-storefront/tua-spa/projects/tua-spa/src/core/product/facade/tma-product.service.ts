// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { TmaProductSpecificationAverageCostConfig } from '../../config/product-specification-average-cost/config';
import { TmaProductSpecificationForViewDetailsConfig } from '../../config/product-specification-for-view-details/config';

@Injectable({
  providedIn: 'root'
})
export class TmaProductService {

  constructor(
    protected productSpecificationViewDetailsConfig: TmaProductSpecificationForViewDetailsConfig,
    protected productSpecificationForAverageCostConfig: TmaProductSpecificationAverageCostConfig
  ) {
  }

  isProductSpecificationForViewDetails(productSpecification: string): boolean {
    return productSpecification &&
      !!this.productSpecificationViewDetailsConfig.productSpecificationForViewDetails.find((pSpec: string) => pSpec === productSpecification);
  }

  isProductSpecificationForAverageCost(productSpecification: string): boolean {
    return productSpecification &&
      !!this.productSpecificationForAverageCostConfig.productSpecificationAverageCost.find((pSpec: string) => pSpec === productSpecification);
  }
}
