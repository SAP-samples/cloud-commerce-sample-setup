// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { LaunchDialogService } from '@spartacus/storefront';
import { UntypedFormBuilder } from '@angular/forms';
import { Address, GlobalMessageService, TranslationService, UserAddressService, UserPaymentService } from '@spartacus/core';
import { CheckoutDeliveryAddressFacade, CheckoutPaymentFacade } from '@spartacus/checkout/base/root';
import { CheckoutPaymentFormComponent } from '@spartacus/checkout/base/components';
import { TmaTmfCheckoutAddressService } from '../../../../../core/checkout/facade/tma-tmf-checkout-address.service';
import { filter } from 'rxjs/operators';
import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'cx-billing-form',
  templateUrl: './tma-checkout-billing-form.component.html',
  styleUrls: ['./tma-checkout-billing-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaCheckoutBillingFormComponent extends CheckoutPaymentFormComponent implements OnInit, OnDestroy {

  protected subscription = new Subscription();
  billingAddressForm = this.tmaTmfCheckoutAddressService.checkoutBillingAddressForm;
  billingAddressOnCart;

  constructor(
    protected checkoutPaymentFacade: CheckoutPaymentFacade,
    protected checkoutDeliveryAddressFacade: CheckoutDeliveryAddressFacade,
    protected userPaymentService: UserPaymentService,
    protected globalMessageService: GlobalMessageService,
    protected fb: UntypedFormBuilder,
    protected userAddressService: UserAddressService,
    protected launchDialogService: LaunchDialogService,
    protected translationService: TranslationService,
    protected tmaTmfCheckoutAddressService: TmaTmfCheckoutAddressService,
    protected cd: ChangeDetectorRef
  ) {
    super(checkoutPaymentFacade, checkoutDeliveryAddressFacade,userPaymentService, globalMessageService, fb, userAddressService, launchDialogService, translationService)
  }

  ngOnInit() {
  super.ngOnInit();

  this.subscription.add(
    combineLatest([
      this.checkoutDeliveryAddressFacade.getDeliveryAddressState(),
      this.checkoutPaymentFacade.getPaymentDetailsState()
    ])
    .pipe(filter((state: any) => !state.loading))
    .subscribe(([deliveryAddress, paymentDetails]) => {
      if (deliveryAddress?.data === undefined || paymentDetails?.data === undefined) {
        return;
      }

      if (deliveryAddress?.data?.id && paymentDetails?.data?.billingAddress?.id)
      {
        this.tmaTmfCheckoutAddressService.sameAsDeliveryAddress = deliveryAddress?.data?.id === paymentDetails?.data?.billingAddress?.id;
      }

      this.billingAddressOnCart = paymentDetails?.data?.billingAddress;
      if (!this.tmaTmfCheckoutAddressService.sameAsDeliveryAddress) {
        this.preFillForm(this.billingAddressOnCart);
      }
      this.billingAddressForm = this.tmaTmfCheckoutAddressService.checkoutBillingAddressForm;
      this.cd.detectChanges();
      })
  );
  this.subscription.add(
    this.tmaTmfCheckoutAddressService.validateCheckoutBillingAddressForm$
      .pipe(filter((isValid => isValid !== false))
      ).subscribe(() => {
      this.tmaTmfCheckoutAddressService.validateCheckoutBillingAddressForm();
      this.cd.detectChanges();
    })
  );
  }

  preFillForm(address: Address) {
    this.tmaTmfCheckoutAddressService.autoFillForm(address);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  toggleSameAsDeliveryAddress(): void {
    this.tmaTmfCheckoutAddressService.sameAsDeliveryAddress = !this.tmaTmfCheckoutAddressService.sameAsDeliveryAddress;
    this.tmaTmfCheckoutAddressService.resetForm();
  }

}
