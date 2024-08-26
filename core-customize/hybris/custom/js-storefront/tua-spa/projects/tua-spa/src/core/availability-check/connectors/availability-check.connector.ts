// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { AppliedCapacityAmount, ResourceCapacityDemand } from '../../model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AvailabilityCheckAdapter } from '../store';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityCheckConnector {
  constructor(protected adapter: AvailabilityCheckAdapter) {
  }

  /**
   * This method is used to get available logical resources
   *
   * @param resourceCapacityDemand
   *            The amount of capacity that is planned to be consumed or has been consumed
   * @return
   *           The logical resource values that would be consumed are bundled in applied capacity amount
   */
  public getLogicalResources(
    resourceCapacityDemand: ResourceCapacityDemand
  ): Observable<AppliedCapacityAmount> {
    return this.adapter.getLogicalResources(resourceCapacityDemand);
  }
}
