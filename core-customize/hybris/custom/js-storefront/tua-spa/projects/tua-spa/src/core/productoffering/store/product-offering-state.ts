// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaProduct } from '../../model';

export const PRODUCT_OFFERING_FEATURE = 'Product Offering';

export interface StateWithProductOffering {
  [PRODUCT_OFFERING_FEATURE]: ProductOfferingState;
}

export interface ProductOfferingMap {
  processType?: string;
  productOffering: TmaProduct;
  error?: ProductOfferingError;
}

export interface ProductOfferingError {
  productOfferingId?: string;
  productOfferingIdError?: string;
}

export interface ProductOfferingState {
  productOfferingMap: ProductOfferingMap[];
}
