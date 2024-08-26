// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { JourneyChecklistConfig } from './journey-checklist.config';

export const defaultJourneyChecklistConfig: JourneyChecklistConfig = {
  journeyChecklist: {
    journeyChecklistSteps: ['APPOINTMENT', 'MSISDN', 'INSTALLATION_ADDRESS'],
    msisdn_reservation: {
      msisdn_qty: 1,
      msisdn_capacity_amount_demand: 1,
      msisdn_applied_capacity_amount: 5,
      applied_capacity_amount_for_msisdn_reservation: 1,
    },
    appointment: {
      requested_number_of_timeslots: 5,
      end_date_of_timeslots: 3,
    },
  },
};
