// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import * as RecommendationActions from '../store/actions/recommendation.action';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as RecommendationSelectors from '../store/selectors/recommendation.selector';
import { StateWithRecommendation } from '../store';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  constructor(protected store: Store<StateWithRecommendation>) {}

  /**
   * Checks the recommendations based on process type and subscription base.
   *
   * @param baseSiteId
   *         The identifier of the base site as {@link string}
   * @param relatedPartyId
   *          The identifier of the customer as {@link string}
   * @param processTypeId
   *         The identifier of the processType as {@link string}
   * @param relatedProductOfferingId
   *          The identifier of the productOffering as {@link string}
   * @param subscriptionBaseId
   *         The identifier of the subscriptionBase as {@link string}
   * @return
   *       true if recommendations available as {@Link Observable} of {@Link boolean}
   */
  checkRecommendationsFor(
    baseSiteId: string,
    relatedPartyId: string,
    processTypeId: string,
    relatedProductOfferingId: string,
    subscriptionBaseId: string
  ): Observable<boolean> {
    return this.store.pipe(
      select(RecommendationSelectors.checkRecommendationsFor, {
        subscriptionBaseId,
        processTypeId
      }),
      tap((eligibleForProcessType: boolean) => {
        if (eligibleForProcessType === undefined) {
          this.store.dispatch(
            new RecommendationActions.LoadRecommendation({
              baseSiteId: baseSiteId,
              relatedPartyId: relatedPartyId,
              processTypeId: processTypeId,
              relatedProductOfferingId: relatedProductOfferingId,
              subscriptionBaseId: subscriptionBaseId
            })
          );
        }
      })
    );
  }

  /**
   * Clears the recommendation state.
   */
  clearRecommendationState(): void {
    this.store.dispatch(new RecommendationActions.ClearRecommendationState());
  }
}
