// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TmaProductOfferingQualification } from '../../model';
import { ProductOfferingQualificationAdapter } from '../store/adapters';

@Injectable({
  providedIn: 'root'
})
export class ProductOfferingQualificationConnector {
  constructor(protected adapter: ProductOfferingQualificationAdapter) {}

  public getProductOfferingQualification(
    productOfferingQualification: TmaProductOfferingQualification
  ): Observable<TmaProductOfferingQualification> {
    return this.adapter.getProductOfferingQualification(productOfferingQualification);
  }
}
