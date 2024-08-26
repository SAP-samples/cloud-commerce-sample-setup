// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { TmaPremiseDetail, TmaTechnicalResources } from '../../model';
import { TmaPremiseDetailState, TmaStateWithPremiseDetail } from '../store';
import * as TmaPremiseDetailAction from '../store/actions/tma-premise-detail.actions';
import * as TmaPremiseDetailSelector from '../store/selectors/tma-premise-detail.selector';

@Injectable({
  providedIn: 'root'
})
export class TmaPremiseDetailService implements OnDestroy {

  protected subscription = new Subscription();

  constructor(
    protected store: Store<TmaStateWithPremiseDetail>
  ) {
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Validates the provided premise details
   *
   * @param premiseDetail - The premise details
   * @return A {@link TmaTechnicalResource} as an {@link Observable}
   */
  validatePremiseDetails(premiseDetail: TmaPremiseDetail): Observable<TmaTechnicalResources> {
    this.subscription.add(
      this.store.select(TmaPremiseDetailSelector.getAllPremiseDetailStates)
        .pipe(
          tap((states: TmaPremiseDetailState[]) => {
              if (!states.find((state: TmaPremiseDetailState) => TmaPremiseDetail.equals(state.premiseDetail, premiseDetail))) {
                this.store.dispatch(new TmaPremiseDetailAction.ValidatePremiseDetail({
                  premiseDetail: premiseDetail
                }));
              }
            }
          ), filter((states: TmaPremiseDetailState[]) => states != null)
        ).subscribe()
    );

    return this.store.select(TmaPremiseDetailSelector.getTechnicalResources, { premiseDetail: premiseDetail });
  }
}
