// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BaseSiteService, OCC_USER_ID_ANONYMOUS, User } from '@spartacus/core';
import {
  AvailabilityCheckService,
  JourneyChecklistConfig,
  LOCAL_STORAGE,
  LogicalResource,
  LogicalResourceReservationService,
  LogicalResourceType,
  MsisdnReservationService,
  Reservation,
  ReservationStateType,
  ResourceRef,
  TmaChecklistActionAction,
  TmaChecklistActionService,
  TmaChecklistActionsState,
  TmaChecklistActionType,
  TmaOrderEntry,
  TmaProduct,
  TmaTmfCartService,
  TmaTmfShoppingCart
} from '../../../../../core';
import { Observable, Subscription } from 'rxjs';
import { filter, first, take } from 'rxjs/operators';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const { MSISDN_TYPE } = LOCAL_STORAGE.MSISDN_RESERVATION;

@Component({
  selector: 'tma-logical-resource-picker',
  templateUrl: './tma-logical-resource-picker.component.html',
  styleUrls: ['./tma-logical-resource-picker.component.scss']
})
export class TmaLogicalResourcePickerComponent implements OnInit {

  @Input()
  tmaProduct?: TmaProduct;
  @Input()
  item: TmaOrderEntry;
  @Input()
  logicalResources: LogicalResource[];
  @Input()
  showEdit?: boolean;

  logicalResources$: Observable<ResourceRef[]>;
  reservationError$: Observable<boolean>;
  enableEditView: boolean = false;
  errPatch: any;
  error$: Observable<string>;
  currentMsisdn: ResourceRef;
  selectedMsisdn: string;
  defaultMsisdn: string;
  reservationId: string;

  msisdnForm: FormGroup = this.fb.group({
    msisdn: ['', Validators.required]
  });

  protected baseSiteId: string;
  protected subscription = new Subscription();
  protected currentUser: User;
  protected currentBaseSiteId: string;
  protected logicalResourceValue: Reservation;
  protected cartEntryMsisdn: string;


  constructor(
    public availabilityCheckService: AvailabilityCheckService,
    public logicalResourceReservationService: LogicalResourceReservationService,
    protected baseSiteService: BaseSiteService,
    protected tmaChecklistActionService: TmaChecklistActionService,
    protected resourceCheckAvailabilityService: AvailabilityCheckService,
    protected tmaTmfCartService: TmaTmfCartService,
    protected cd: ChangeDetectorRef,
    protected msisdnReservationService: MsisdnReservationService,
    protected fb: FormBuilder,
    protected store: Store<TmaChecklistActionsState>,
    protected config?: JourneyChecklistConfig,
    protected userAccountFacade?: UserAccountFacade,
  ) {
    this.subscription.add(
      this.userAccountFacade
        .get()
        .pipe(
          first((user: User) => user != null)
        )
        .subscribe((user: User) => (this.currentUser = user))
    );
    this.reservationError$ = this.logicalResourceReservationService.hasReservationError();
  }

  ngOnInit(): void {
    this.logicalResources?.forEach((resource: LogicalResource) => {
      if (resource.type === LogicalResourceType.MSISDN) {
        this.cartEntryMsisdn = resource.value;
        this.defaultMsisdn = resource.value;
      }
    });
    this.error$ = this.availabilityCheckService.getAvailabilityCheckError();
    this.logicalResources$ = this.availabilityCheckService.getResourceCheckAvailability(
      this.config.journeyChecklist.msisdn_reservation
        .msisdn_applied_capacity_amount,
      MSISDN_TYPE
    );
    if (!this.cartEntryMsisdn) {
      this.subscription.add(
        this.logicalResourceReservationService
          .getCreatedReservation()
          .pipe(
            filter((result: Reservation) => Object.keys(result).length !== 0)
          ).subscribe((result: Reservation) => {
          if (result.id) {
            this.reservationId = result.id;
            if (
              (result.reservationState.toUpperCase() !==
              ReservationStateType.REJECTED.toUpperCase() ||
                result.reservationState.toUpperCase() !==
                ReservationStateType.CANCELLED.toUpperCase())
            ) {
              this.store.dispatch(new TmaChecklistActionAction.ChecklistActionDetails([{
                type: TmaChecklistActionType.MSISDN,
                value: result
              }]));
            }
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.msisdnReservationService.clearCreatedReservationState();
    this.msisdnReservationService.clearReservationError();
    this.msisdnReservationService.clearCreatedReservationState();
    this.msisdnReservationService.clearUpdateReservationError();
    this.subscription?.unsubscribe();
  }

  selectedLogicalResource(resource: any): void {
    this.resourceCheckAvailabilityService.setSelectedLogicalResource(resource);
    this.currentMsisdn = resource;
  }

  updateReservation(): void {
    if (!this.msisdnForm.valid) {
      this.msisdnForm.markAllAsTouched();
      return;
    }
    this.logicalResources?.forEach((resource: LogicalResource) => {
      if (resource.type === LogicalResourceType.MSISDN) {
        this.cartEntryMsisdn = resource.value;
        this.defaultMsisdn = resource.value;
      }
    });
    this.subscription.add(
      this.logicalResourceReservationService
        .getReservationByLogicalResourceValue(this.cartEntryMsisdn)
        .pipe(
          filter((result: Reservation) => !!result)
        )
        .subscribe((result: Reservation) => {
          if (result) {
            this.logicalResourceValue = result;
          }
        })
    );
    this.selectedMsisdn = this.currentMsisdn.value;
    if (this.cartEntryMsisdn && this.logicalResourceValue) {
      this.logicalResourceReservationService.updateReservationFor(
        this.currentMsisdn,
        this.logicalResourceValue.id
      );

      this.subscription.add(
      this.logicalResourceReservationService
        .getUpdateReservationError(this.cartEntryMsisdn)
        .pipe(
          take(2),
          filter((result: string) => !!result)
        )
        .subscribe((result: string) => {
          this.errPatch = result;
        })
      );

      this.subscription.add(
        this.logicalResourceReservationService
          .getReservationByLogicalResourceValue(this.currentMsisdn.value)
          .pipe(
            take(2),
            filter((result: Reservation) => !!result)
          )
          .subscribe((updatedReservation: Reservation) => {
            if (
              updatedReservation.reservationState ===
              (ReservationStateType.REJECTED || ReservationStateType.CANCELLED)
            ) {
              this.errPatch = updatedReservation.reservationState;
              return;
            }
            this.updateCartEntryIfNoError(this.currentMsisdn.value);
          })
      );
    } else {
      if (this.reservationId) {
        this.logicalResourceReservationService.updateReservationFor(this.currentMsisdn, this.reservationId);
      } else {
        if (this.item) {
          this.msisdnReservationService.createReservationFor(
            this.item.product
          );
          this.updateCartWithMsisdnNewReservation();
          return;
        }
        this.msisdnReservationService.createReservationFor(
          this.tmaProduct
        );
      }
    }
    this.switchEditButton();
    this.switchShowFinalPhoneNumber();
  }

  cancelReservation(): void {
    this.showEdit = !this.showEdit;
    this.enableEditView = false;
  }

  switchEditButton() {
    this.showEdit = !this.showEdit;
    this.enableEditView = true;
  }

  switchShowFinalPhoneNumber() {
    this.enableEditView = !this.enableEditView;
  }

  protected updateCartEntry(msisdnNumber: string): void {
    const currentUserId: string =
      this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
    const shoppingCart: TmaTmfShoppingCart = {
      baseSiteId: this.currentBaseSiteId,
      cartItem: [
        {
          id: this.item.entryNumber.toString(),
          product: {
            characteristic: [
              {
                name: LogicalResourceType.MSISDN,
                value: msisdnNumber
              }
            ]
          }
        }
      ],
      relatedParty: [
        {
          id: currentUserId
        }
      ]
    };
    this.tmaTmfCartService.updateCart(shoppingCart);
  }

  protected updateCartWithMsisdnNewReservation(): void {
    this.subscription.add(
      this.logicalResourceReservationService
        .getCreatedReservation()
        .pipe(
          take(2),
          filter((result: Reservation) => Object.keys(result).length !== 0)
        )
        .subscribe((result: Reservation) => {
          if (
            result.reservationState.toUpperCase() ===
            (ReservationStateType.REJECTED.toUpperCase() ||
              ReservationStateType.CANCELLED.toUpperCase())
          ) {
            return;
          }
          if (
            !!result.reservationItem[0] &&
            !!result.reservationItem[0].appliedCapacityAmount[0].resource[0].value
          ) {
            const msisdnValueSelected =
              result.reservationItem[0].appliedCapacityAmount[0].resource[0]
                .value;
            this.updateCartEntryIfNoError(msisdnValueSelected);
          }
        })
    );
  }

  private updateCartEntryIfNoError(msisdn: string) {
    if (!this.errPatch && this.item) {
      this.updateCartEntry(msisdn);
    }
  }
}
