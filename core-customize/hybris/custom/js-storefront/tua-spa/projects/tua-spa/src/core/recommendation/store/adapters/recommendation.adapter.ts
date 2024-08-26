// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Recommendation } from '../../../model';
import { Observable } from 'rxjs';

export abstract class RecommendationAdapter {

/**
 * Retrieves the list of recommendations.
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
  abstract getRecommendations(
    baseSiteId: string,
    relatedPartyId: string,
    processTypeId: string,
    relatedProductOfferingId: string,
    subscriptionBaseId: string
  ): Observable<Recommendation[]>;
}
