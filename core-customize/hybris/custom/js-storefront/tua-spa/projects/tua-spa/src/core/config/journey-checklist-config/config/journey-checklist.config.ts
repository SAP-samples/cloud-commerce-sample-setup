// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Config } from '@spartacus/core';

@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class JourneyChecklistConfig {
  journeyChecklist?: {
    journeyChecklistSteps?: string[];
    msisdn_reservation?: {
      msisdn_qty?: number;
      msisdn_capacity_amount_demand?: number;
      msisdn_applied_capacity_amount?: number;
      applied_capacity_amount_for_msisdn_reservation?: number;
    };
    appointment?: {
      requested_number_of_timeslots?: number;
      end_date_of_timeslots?: number;
    };
  };
}

declare module '@spartacus/core' {
  interface Config extends JourneyChecklistConfig {}
}
