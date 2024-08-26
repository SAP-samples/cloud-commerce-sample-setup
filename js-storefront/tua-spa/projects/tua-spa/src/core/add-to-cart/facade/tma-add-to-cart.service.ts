// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TmaAddToCartActions, TmaAddToCartSelectors, TmaStateWithAddToCart } from '../store';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class TmaAddToCartService {

  dependentProductId$: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

  constructor(protected store: Store<TmaStateWithAddToCart>) {
  }

  setAddToCartPayloadState(shoppingCart: any) {
    this.store.dispatch(new TmaAddToCartActions.AddToCartPayload(shoppingCart));
  }

  getAddToCartPayloadState(): Observable<any> {
    return this.store.pipe(select(TmaAddToCartSelectors.getAddToCartPayload));
  }

  clearAddToCartPayloadState() {
    this.store.dispatch(new TmaAddToCartActions.ClearAddToCartPayload());
  }
}
