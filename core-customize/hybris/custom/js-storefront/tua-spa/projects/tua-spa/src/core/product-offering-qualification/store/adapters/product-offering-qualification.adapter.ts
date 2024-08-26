// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved
import { Observable } from 'rxjs';
import { TmaProductOfferingQualification } from '../../../model';

export abstract class ProductOfferingQualificationAdapter {

  abstract getProductOfferingQualification(
    productOfferingQualification: TmaProductOfferingQualification
  ): Observable<TmaProductOfferingQualification>;
}
