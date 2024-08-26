// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RoutingService } from '@spartacus/core';
import { LaunchDialogService } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { AppointmentService } from '../../../../core/appointment/facade';
import { LogicalResourceReservationService } from '../../../../core/reservation/facade';
import { CheckoutPlaceOrderComponent } from '@spartacus/checkout/base/components';
import { OrderFacade } from '@spartacus/order/root';

@Component({
  selector: 'cx-place-order',
  templateUrl: './tma-place-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaPlaceOrderComponent extends CheckoutPlaceOrderComponent implements OnInit {
  hasAppointmentError$: Observable<boolean>;
  hasCancelledAppointment$: Observable<boolean>;
  hasReservationError$: Observable<boolean>;
  hasCancelledReservations$: Observable<boolean>;

  constructor(
    protected orderFacade: OrderFacade,
    protected tmaRoutingService: RoutingService,
    protected fb: FormBuilder,
    protected launchDialogService: LaunchDialogService,
    protected vcr: ViewContainerRef,
    protected appointmentService: AppointmentService,
    protected logicalResourceReservationService?: LogicalResourceReservationService

  ) {
    super(orderFacade, tmaRoutingService, fb, launchDialogService, vcr);
  }

  ngOnInit() {
    this.hasAppointmentError$ = this.appointmentService.hasAppointmentError();
    this.hasCancelledAppointment$ = this.appointmentService.hasCancelledAppointment();
    this.hasReservationError$ = this.logicalResourceReservationService.hasReservationError();
    this.hasCancelledReservations$ = this.logicalResourceReservationService.hasCancelledReservations();
  }

  hasError(error: boolean): boolean {
    return error;
  }
}
