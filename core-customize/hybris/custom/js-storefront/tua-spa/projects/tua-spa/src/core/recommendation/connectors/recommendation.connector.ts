// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Recommendation } from '../../model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecommendationAdapter } from '../store/adapters';

@Injectable({
  providedIn: 'root',
})
export class RecommendationConnector {
  constructor(protected adapter: RecommendationAdapter) {}

  /**
   * Retrieves the list of recommendations for the given product offering
   *
   * @param baseSiteId
   *         The identifier of the base site as {@link string}
   * @param relatedPartyId
   *          The identifier of the customer as {@link string}
   * @param processTypeId
   *         The identifier of the processType as {@link string}
   * @param relatedProductOfferingId
   *          The identifier of the productOffering to which recommendations has to retrieve as {@link string}
   * @param subscriptionBaseId
   *         The identifier of the subscriptionBase as {@link string}
   * @returns list of recommendations as {@link Observable} of {@link Recommendation}
   */
  public getRecommendations(
    baseSiteId: string,
    relatedPartyId: string,
    processTypeId: string,
    relatedProductOfferingId: string,
    subscriptionBaseId: string
  ): Observable<Recommendation[]> {
    return this.adapter.getRecommendations(
      baseSiteId,
      relatedPartyId,
      processTypeId,
      relatedProductOfferingId,
      subscriptionBaseId
    );
  }
}
