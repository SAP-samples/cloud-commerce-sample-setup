// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfProduct } from '../../../model';

export const TMF_PRODUCT_FEATURE = 'tmf-product';

export interface TmaStateWithTmfProduct {
  [TMF_PRODUCT_FEATURE]: TmfProductState;
}

export class TmfProductMap {
  tmfProduct?: TmfProduct;
  id?: string;
  baseSiteId?: string;
  tmfProducts?: TmfProduct[];
}

export interface TmfProductState {
  tmfProductMap?: TmfProductMap[];
}
