// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved
import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaProductOfferingQualification } from '../../model';

export const PRODUCT_OFFERING_QUALIFICATION_NORMALIZER = new InjectionToken<
  Converter<any, TmaProductOfferingQualification>
  >('ProductOfferingQualificationNormalizer');
