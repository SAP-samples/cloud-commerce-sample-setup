// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TmfProduct } from '../../../model';
import { TmfProductAdapter } from '../store/adapters';

@Injectable({
  providedIn: 'root',
})
export class TmfProductConnector {
  constructor(protected adapter: TmfProductAdapter) {}

  public getTmfProductDetails(
    baseSiteId: string,
    tmfProductId: string
  ): Observable<TmfProduct> {
    return this.adapter.getTmfProductDetails(baseSiteId, tmfProductId);
  }
}
