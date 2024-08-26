// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CxDatePipe } from '@spartacus/core';
import { ChecklistInstallationAddressModule } from './checklist-installation-address';
import { JourneyChecklistAppointmentModule } from './tma-checklist-appointment';
import { TmaLogicalResourcePickerModule } from './journey-checklist-logical-resource';

@NgModule({
  imports: [
    ChecklistInstallationAddressModule,
    JourneyChecklistAppointmentModule,
    TmaLogicalResourcePickerModule
  ],
  providers: [CxDatePipe],
  declarations: [],
  exports: []
})
export class JourneyChecklistComponentModule {}
