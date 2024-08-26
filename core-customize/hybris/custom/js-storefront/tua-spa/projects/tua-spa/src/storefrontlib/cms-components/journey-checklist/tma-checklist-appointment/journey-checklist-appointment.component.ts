// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {
  BaseSiteService,
  GlobalMessageService,
  GlobalMessageType,
  OCC_USER_ID_ANONYMOUS,
  TranslationService,
  User
} from '@spartacus/core';
import {
  Appointment,
  AppointmentService,
  JourneyChecklistConfig,
  SearchTimeSlot,
  SearchTimeSlotService,
  TimeSlot,
  TmaChecklistAction,
  TmaChecklistActionAction,
  TmaChecklistActionService,
  TmaChecklistActionsState,
  TmaChecklistActionType,
  TmaOrderEntry,
  TmaTmfCartItem,
  TmaTmfCartService,
  TmaTmfShoppingCart
} from '../../../../core';
import { Observable, Subscription } from 'rxjs';
import { filter, first, take, tap } from 'rxjs/operators';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { Store } from '@ngrx/store';
import { TmaAddToCartService } from '../../../../core/add-to-cart';

@Component({
  selector: 'cx-journey-checklist-appointment',
  templateUrl: './journey-checklist-appointment.component.html',
  styleUrls: ['./journey-checklist-appointment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JourneyChecklistAppointmentComponent implements OnInit {

  @Input()
  enableChecklistActions?: boolean = true;
  @Input()
  productCode: string;
  @Input()
  showEdit?: boolean;
  @Input()
  item?: TmaOrderEntry;

  appointment$: Observable<Appointment>;
  checklistAction$: Observable<TmaChecklistAction[]>;
  searchTimeSlot$: Observable<SearchTimeSlot>;

  minDate: Date;
  maxDate: Date;
  startDate: FormControl<Date> = new FormControl(null, Validators.required);
  timeSlotForm: FormControl<TimeSlot> = new FormControl(null, Validators.required);
  requestedDate = this.startDate.valueChanges;

  searchTimeSlotError$: Observable<string>;

  updateAppointmentError$: Observable<string>;
  createAppointmentError$: Observable<string>;
  dependentProductId$: Observable<string> = this.tmaAddToCartService.dependentProductId$;

  currentAppointmentId: string;
  showEditView: boolean = false;
  showSelect: boolean = true;

  protected baseSiteId: string;
  protected subscription = new Subscription();
  selectedTimeSlot: TimeSlot;
  protected currentUser: User;

  constructor(
    protected baseSiteService: BaseSiteService,
    protected tmaChecklistActionService: TmaChecklistActionService,
    protected tmaSearchTimeSlotService: SearchTimeSlotService,
    protected tmaTmfCartService: TmaTmfCartService,
    protected config?: JourneyChecklistConfig,
    protected fb?: FormBuilder,
    protected tmfAppointmentService?: AppointmentService,
    protected userAccountFacade?: UserAccountFacade,
    protected translationService?: TranslationService,
    protected globalMessageService?: GlobalMessageService,
    protected store?: Store<TmaChecklistActionsState>,
    protected tmaAddToCartService?: TmaAddToCartService
  ) {
    this.subscription.add(
      this.userAccountFacade
        .get()
        .pipe(
          first((user: User) => user != null)
        )
        .subscribe((user: User) => (this.currentUser = user))
    );

    this.searchTimeSlotError$ = this.tmaSearchTimeSlotService.getSearchTimeSlotError();
  }

  ngOnInit(): void {
    if (this.item && this.item.appointment) {
      this.currentAppointmentId = this.item.appointment.id;
      this.showSelect = false;
    }
    this.appointment$ = this.currentAppointmentId ? this.tmfAppointmentService.getAppointmentById(this.currentAppointmentId)
      : this.tmfAppointmentService.getCreatedAppointment();
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 1000);
    if (this.enableChecklistActions) {
      this.checklistAction$ = this.tmaChecklistActionService
        .getChecklistActionForProductCode(
          this.baseSiteId,
          this.productCode
        );
    }
    else {
      this.checklistAction$ = undefined;
    }

    this.subscription.add(
      this.requestedDate.subscribe(() => this.newSearch())
    );
  }

  ngOnDestroy(): void {
    this.tmaSearchTimeSlotService.clearSearchTimeSlotErrorState();
    this.tmaSearchTimeSlotService.clearSearchTimeSlotState();
    this.tmfAppointmentService.clearAppointmentState();
    this.tmfAppointmentService.clearCreatedAppointmentState();
    this.tmfAppointmentService.clearAppointmentError();
    this.subscription?.unsubscribe();
  }


  protected getSearchTimeSlot(startDate?: Date): void {
    this.searchTimeSlot$ = this.tmaSearchTimeSlotService.getAvailableSearchTimeSlot(
      startDate
    );
  }

  /**
   * Sets the selected search time slot in state
   *
   * @param  timeSlot of {@link TimeSlot}
   */
  selectTimeSlot(timeSlot: TimeSlot): void {
    if (this.selectedTimeSlot !== timeSlot) {
      this.selectedTimeSlot = timeSlot;
      this.tmaSearchTimeSlotService.setSelectedTimeSlot(timeSlot);
    }
  }

  newSearch(): void {
    this.startDate.markAllAsTouched();
    if (this.startDate.touched) {
      this.getSearchTimeSlot(this.startDate.value);
    }
  }

  cancelAppointment(): void {
    this.switchEditButton();
  }

  /**
   * Checks if the customer is logged in, if not displays a global message
   * If the customer is logged in and there is already an appointment created, this appointment gets updated,
   * otherwise, a new appointment is created
   */
  updateAppointment(): void {
    this.subscription.add(
      this.dependentProductId$.subscribe(dependentProductId => {
        if (dependentProductId !== undefined) {
          this.store.dispatch(new TmaChecklistActionAction.ChecklistActionDetails([{
            type: TmaChecklistActionType.RELIES_ON,
            value: dependentProductId
          }]));
        }
      })
    );

    if (!(this.currentUser && this.currentUser.uid)) {
      this.translationService
        .translate('checkList.appointment.loginNeeded')
        .pipe(
          tap((translatedMessage: string) =>
            this.globalMessageService.add(
              translatedMessage,
              GlobalMessageType.MSG_TYPE_ERROR
            )
          )
        )
        .subscribe()
        .unsubscribe();
    }

    if (this.currentAppointmentId) {
      this.tmfAppointmentService.updateAppointment(this.currentAppointmentId);
      this.appointment$ = this.tmfAppointmentService.getAppointmentById(this.currentAppointmentId);
      this.updateAppointmentError$ = this.tmfAppointmentService.getUpdateAppointmentError(this.currentAppointmentId);
      this.switchEditButton();
    }
    else {
      this.tmfAppointmentService.createAppointmentForTimeSlot();
      this.createAppointment();
      this.switchEditButton();
    }
  }

  protected createAppointment() {
    this.subscription.add(
      this.tmfAppointmentService
        .getCreatedAppointment()
        .pipe(
          take(2),
          filter(result => Object.keys(result).length !== 0)
        )
        .subscribe((result: Appointment) => {
          this.currentAppointmentId = result.id;
          if (!this.item) {
            this.store.dispatch(new TmaChecklistActionAction.ChecklistActionDetails([{
              type: TmaChecklistActionType.APPOINTMENT,
              value: this.currentAppointmentId
            }]));
          } else {
            this.updateCart(this.currentAppointmentId);
          }
        })
    );
    this.createAppointmentError$ = this.tmfAppointmentService.getCreateAppointmentError();
  }

  protected updateCart(appointmentId: string): void {
    const currentUserId: string =
      this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
    const shoppingCart: TmaTmfShoppingCart = {
      baseSiteId: this.baseSiteId,
      cartItem: this.updateCartItems(appointmentId),
      relatedParty: [
        {
          id: currentUserId
        }
      ]
    };
    this.tmaTmfCartService.updateCart(shoppingCart);
  }

  protected updateCartItems(appointmentId: string): TmaTmfCartItem[] {
    const cartItemList: TmaTmfCartItem[] = [];
    cartItemList.push({
      id: this.item.entryNumber.toString(),
      appointment: {
        id: appointmentId
      }
    });
    return cartItemList;
  }

  switchEditButton() {
    if (this.showSelect === true) {
      this.showEdit = false;
    }
    else {
      this.showEdit = !this.showEdit;
    }
    this.showEditView = !this.showEditView;
    this.showSelect = false;
  }
}
