// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActiveCartFacade } from '@spartacus/cart/base/root';
import { CheckoutPaymentMethodComponent, CheckoutStepService } from '@spartacus/checkout/base/components';
import { CheckoutDeliveryAddressFacade, CheckoutPaymentFacade, CheckoutQueryResetEvent } from '@spartacus/checkout/base/root';
import { ActivatedRoute } from '@angular/router';
import {
  Address,
  BaseSiteService,
  EventService,
  GlobalMessageService,
  GlobalMessageType,
  PaymentDetails,
  TranslationService,
  UserPaymentService
} from '@spartacus/core';
import {
  GeographicAddress,
  GeographicAddressService,
  LOCAL_STORAGE,
  TmaTmfCartService,
  TmaTmfShoppingCart,
  Tmf
} from '../../../../core';
import { filter, first, map, take } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { TmaUserIdService } from '../../../../core/user/facade/tma-user-id.service';
import { TmaTmfCheckoutAddressService } from '../../../../core/checkout/facade/tma-tmf-checkout-address.service';
import TmfPaymentDetails = Tmf.TmfPaymentDetails;

const { PAYMENT_SELECTED
} = LOCAL_STORAGE.PAYMENT_METHOD;

const { DIRECT_DEBIT
} = LOCAL_STORAGE.PAYMENT_METHOD_TYPE

const { DIRECT_DEBIT_FEATURE
} = LOCAL_STORAGE.TMA_FEATURE_FLAGS

const { BILLING_ADDRESS
} = LOCAL_STORAGE.PLACE;

const { ADDRESS_SELECTED,
} = LOCAL_STORAGE.ADDRESS;

@Component({
  selector: 'cx-payment-method',
  templateUrl: './tma-checkout-payment-method.component.html',
  styleUrls: ['./tma-checkout-payment-method.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaCheckoutPaymentMethodComponent extends CheckoutPaymentMethodComponent implements OnInit, OnDestroy {

  protected baseSiteId: string;
  protected subscription = new Subscription();
  protected currentUserId: string;
  protected currentBaseSiteId: string;
  protected readonly DIRECT_DEBIT = DIRECT_DEBIT;
  protected readonly DIRECT_DEBIT_FEATURE = DIRECT_DEBIT_FEATURE;

  deliveryAddress$: Observable<Address | undefined>;
  billingAddressForm = this.tmaTmfCheckoutAddressService.checkoutBillingAddressForm;

  constructor(
    protected userPaymentService: UserPaymentService,
    protected activeCartFacade: ActiveCartFacade,
    protected checkoutDeliveryAddressFacade: CheckoutDeliveryAddressFacade,
    protected checkoutPaymentFacade: CheckoutPaymentFacade,
    protected activatedRoute: ActivatedRoute,
    protected translation: TranslationService,
    protected checkoutStepService: CheckoutStepService,
    protected globalMessageService: GlobalMessageService,
    protected eventService: EventService,
    protected tmaTmfCheckoutAddressService: TmaTmfCheckoutAddressService,
    protected geographicAddressService: GeographicAddressService,
    protected userIdService?: TmaUserIdService,
    protected tmaTmfCartService?: TmaTmfCartService,
    protected baseSiteService?: BaseSiteService
  ) {
    super(userPaymentService, checkoutDeliveryAddressFacade, checkoutPaymentFacade, activatedRoute, translation, activeCartFacade, checkoutStepService, globalMessageService);

    this.deliveryAddress$ = this.checkoutDeliveryAddressFacade
      .getDeliveryAddressState()
      .pipe(
        filter((state) => !state.loading),
        map((state) => state.data)
      );

    this.subscription.add(
      this.userIdService
        .getCustomerId()
        .pipe(
          first((userId: string) => userId != null)
        )
        .subscribe((userId: string) => (this.currentUserId = userId))
    );

    this.subscription.add(
      this.baseSiteService
        .getActive()
        .pipe(
          first((baseSiteId: string) => baseSiteId != null)
        )
        .subscribe((baseSiteId: string) => (this.currentBaseSiteId = baseSiteId))
    );

  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.subscription?.unsubscribe();
  }

  selectDirectDebit() {
    const currentUserId: string = this.currentUserId;
    const type: Tmf.TmfPaymentType = Tmf.TmfPaymentType.DIRECTDEBIT;
    const shoppingCart: TmaTmfShoppingCart = {
      baseSiteId: this.currentBaseSiteId,
      relatedParty: [
        {
          id: currentUserId
        }
      ],
      paymentMethod:[
        {
          id: currentUserId ,
          type: type
        }
      ]
    };
    this.tmaTmfCartService.updateCart(shoppingCart);
    this.globalMessageService.add({
      key: PAYMENT_SELECTED,
    }, GlobalMessageType.MSG_TYPE_INFO);
    this.eventService.dispatch({}, CheckoutQueryResetEvent);
  }

  next(): void {
    this.subscription.add(
    this.selectedMethod$.subscribe((paymentDetails: PaymentDetails) => {
      if(paymentDetails.cardType?.code === DIRECT_DEBIT) {
        if (this.tmaTmfCheckoutAddressService.sameAsDeliveryAddress) {
          this.subscription.add(
            this.deliveryAddress$
              .pipe(
                first((address: Address) => address !== undefined)
              )
              .subscribe((address: Address) => {
                const updatedAddress: GeographicAddress = {
                  id: address.id,
                  isBillingAddress: true,
                  isInstallationAddress: true,
                  relatedParty: [
                    {
                      id: this.currentUserId
                    }
                  ]
                };
                this.geographicAddressService.updateGeographicAddress( this.currentBaseSiteId, address.id, updatedAddress);
                const shoppingCart: TmaTmfShoppingCart = {
                  baseSiteId: this.currentBaseSiteId,
                  relatedParty: [
                    {
                      id: this.currentUserId
                    }
                  ],
                  place: [
                    {
                      id: address.id,
                      role: BILLING_ADDRESS
                    }
                  ]
                };
                this.tmaTmfCartService.updateCart(shoppingCart);
                this.globalMessageService.add({
                  key: ADDRESS_SELECTED,
                }, GlobalMessageType.MSG_TYPE_INFO);
                this.checkoutStepService.next(this.activatedRoute);
                this.eventService.dispatch({}, CheckoutQueryResetEvent);
              })
          );
        } else {
          if (!this.billingAddressForm.valid) {
            this.tmaTmfCheckoutAddressService.validateCheckoutBillingAddressForm$.next(true);
            return;
          }
          const billingAddress: GeographicAddress = {
            firstName: this.billingAddressForm.controls['firstName'].value,
            lastName: this.billingAddressForm.controls['lastName'].value,
            streetName: this.billingAddressForm.controls['line1'].value,
            city: this.billingAddressForm.controls['town'].value,
            country: this.billingAddressForm.controls['country'].value.isocode,
            postcode: this.billingAddressForm.controls['postalCode'].value,
            isBillingAddress: true,
            isInstallationAddress: true,
            relatedParty: [
              {
                id: this.currentUserId
              }
            ]
          }
          this.geographicAddressService.clearCreatedGeographicAddressState();
          this.geographicAddressService.createGeographicAddress(this.currentBaseSiteId, billingAddress);
          this.subscription.add(
            this.geographicAddressService.getSelectedInstallationAddress().pipe(
              take(2),
              filter((result: GeographicAddress) => Object.keys(result).length !== 0)
            ).subscribe((address: GeographicAddress) => {
              const shoppingCart: TmaTmfShoppingCart = {
                baseSiteId: this.currentBaseSiteId,
                relatedParty: [
                  {
                    id: this.currentUserId
                  }
                ],
                place: [
                  {
                    id: address.id,
                    role: BILLING_ADDRESS
                  }
                ]
              };
              this.tmaTmfCartService.updateCart(shoppingCart);
              this.globalMessageService.add({
                key: ADDRESS_SELECTED,
              }, GlobalMessageType.MSG_TYPE_INFO);
              this.checkoutStepService.next(this.activatedRoute);
              this.eventService.dispatch({}, CheckoutQueryResetEvent);
            })
          );
        }
      } else {
        this.checkoutStepService.next(this.activatedRoute);
        this.eventService.dispatch({}, CheckoutQueryResetEvent);
      }
    })
    );
  }
}
