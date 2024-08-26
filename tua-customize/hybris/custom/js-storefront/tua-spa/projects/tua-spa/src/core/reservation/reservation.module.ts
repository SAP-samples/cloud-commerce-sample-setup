// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { LogicalResourceReservationService, MsisdnReservationService } from './facade';
import { ReservationStoreModule } from './store/reservation-store.module';

@NgModule({
  imports: [ReservationStoreModule]
})
export class ReservationModule {
  static forRoot(): ModuleWithProviders<ReservationModule> {
    return {
      ngModule: ReservationModule,
      providers: [LogicalResourceReservationService, MsisdnReservationService]
    };
  }
}
