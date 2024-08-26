// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Address } from '@spartacus/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TmaTmfCheckoutAddressService {
  validateCheckoutBillingAddressForm$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  checkoutBillingAddressForm: UntypedFormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    line1: ['', Validators.required],
    line2: [''],
    town: ['', Validators.required],
    region: this.fb.group({
      isocodeShort: [null, Validators.required],
    }),
    country: this.fb.group({
      isocode: [null, Validators.required],
    }),
    postalCode: ['', Validators.required],
  });
  sameAsDeliveryAddress = true;

  constructor(protected fb: UntypedFormBuilder) {
  }

  autoFillForm(address: Address) {
    this.checkoutBillingAddressForm.patchValue({
      firstName: address.firstName,
      lastName: address.lastName,
      line1: address.line1,
      line2: '',
      town: address.town,
      region: this.fb.group({
        isocodeShort: address.region?.isocodeShort,
      }),
      country: this.fb.group({
        isocode: address.country?.isocode,
      }),
      postalCode: address.postalCode,
    });
  }

  resetForm() {
    this.checkoutBillingAddressForm.reset();
  }

  validateCheckoutBillingAddressForm() {
    this.checkoutBillingAddressForm.markAllAsTouched();
  }
}
