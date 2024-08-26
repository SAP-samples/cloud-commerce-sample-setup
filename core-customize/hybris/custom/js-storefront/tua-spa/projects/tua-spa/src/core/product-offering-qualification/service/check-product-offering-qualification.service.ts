// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TmaOrderEntry, TmaProductOfferingQualification, TmaProductOfferingQualificationItem } from '../../model';
import { ProductOfferingQualificationService } from '../facade';

@Injectable({
  providedIn: 'root'
})
export class CheckProductOfferingQualificationService {
  protected entries: TmaOrderEntry[];

  constructor (
    protected productOfferingQualificationService: ProductOfferingQualificationService
  ) {}

  checkProductOfferingQualification(payload: any): Observable<TmaProductOfferingQualificationItem[]> {
    return this.productOfferingQualificationService.getProductOfferingQualification(payload)
      .pipe(
        map((productOfferingQualification: TmaProductOfferingQualification) => {
          if (productOfferingQualification) {
            return productOfferingQualification.productOfferingQualificationItem.filter((productOfferingQualificationItem) => productOfferingQualificationItem.eligibilityUnavailabilityReason);
          }
          return undefined;
        })
      );
  }
}
