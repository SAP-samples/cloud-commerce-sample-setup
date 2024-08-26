// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Observable } from 'rxjs';
import { AppliedCapacityAmount, ResourceCapacityDemand } from '../../../model';

export abstract class AvailabilityCheckAdapter {

  /**
   * Abstract method used to get the logical resources
   *
   * @param resourceCapacityDemand
   *           The resourceCapacityDemand to retrieve logical resources
   * @return
   *       applied capacity amount
   */
  abstract getLogicalResources(
    resourceCapacityDemand: ResourceCapacityDemand
  ): Observable<AppliedCapacityAmount>;
}
