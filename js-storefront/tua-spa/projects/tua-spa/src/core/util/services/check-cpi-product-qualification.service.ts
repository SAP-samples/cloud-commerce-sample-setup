// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved
import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { TmaSubscribedProductsInventory, TmaSubscriptions } from '../../model';
import { Observable } from 'rxjs';
import { SelfcareService } from '../../selfcare';

@Injectable()
export class CheckCpiProductQualificationService {

  constructor(
    protected selfCareService: SelfcareService,
  ) {
  }

  checkForProductSpecification(productSpecificationDependency: string): Observable<TmaSubscriptions[]> {
    return this.selfCareService.getSubscriptions()
      .pipe(filter((entries: TmaSubscribedProductsInventory) => entries !== undefined),
        map((res: TmaSubscribedProductsInventory) => {
          const eligibleSubscriptions: TmaSubscriptions[] = [];
          res.subscribedProducts.forEach((subscription: TmaSubscriptions) => {
            if (subscription?.productSpecification?.id === productSpecificationDependency) {
              eligibleSubscriptions.push(subscription);
            }
          });
          return eligibleSubscriptions;
        }
    ));
  }
}
