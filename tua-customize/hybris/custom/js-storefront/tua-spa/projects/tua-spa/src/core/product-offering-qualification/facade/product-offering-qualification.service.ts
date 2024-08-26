// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved
import { Injectable } from '@angular/core';
import { Command, CommandService, CommandStrategy } from '@spartacus/core';
import { Observable } from 'rxjs';
import { TmaProductOfferingQualification } from '../../model';
import { ProductOfferingQualificationConnector } from '../connectors';

@Injectable()
export class ProductOfferingQualificationService {

  constructor(
    protected command: CommandService,
    protected productOfferingQualificationConnector: ProductOfferingQualificationConnector
  ) {
  }

  protected postProductOfferingQualification: Command<{ productOfferingQualification: TmaProductOfferingQualification }, TmaProductOfferingQualification> =
    this.command.create<{ productOfferingQualification: TmaProductOfferingQualification }>(
      (payload) =>
        this.productOfferingQualificationConnector.getProductOfferingQualification(payload.productOfferingQualification),
      {
        strategy: CommandStrategy.CancelPrevious,
      }
    );

  /**
   * Returns the product offering qualification result.
   *
   * @return {@link TmaProductOfferingQualification} as {@link Observable}
   */
  getProductOfferingQualification(productOfferingQualification: TmaProductOfferingQualification): Observable<TmaProductOfferingQualification> {
    return this.postProductOfferingQualification.execute({ productOfferingQualification });
  }
}
