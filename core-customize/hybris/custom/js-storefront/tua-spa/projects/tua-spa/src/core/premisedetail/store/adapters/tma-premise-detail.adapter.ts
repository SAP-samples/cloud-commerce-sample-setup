// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Observable } from 'rxjs';
import { TmaPremiseDetail, TmaTechnicalResource } from '../../../model';

export abstract class TmaPremiseDetailAdapter {

  /**
   * Abstract method used to get the premise details validation
   *
   * @param premiseDetail - The details about the premise
   * @return List of {@link TmaTechnicalResource} as an {@link Observable}
   */
  abstract validatePremiseDetail(
    premiseDetail: TmaPremiseDetail
  ): Observable<TmaTechnicalResource[]>;

}
