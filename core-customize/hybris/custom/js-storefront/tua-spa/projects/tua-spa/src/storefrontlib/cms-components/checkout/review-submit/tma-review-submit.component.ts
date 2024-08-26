// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslationService } from '@spartacus/core';
import { CheckoutDeliveryAddressFacade, CheckoutDeliveryModesFacade, CheckoutPaymentFacade } from '@spartacus/checkout/base/root';
import { CheckoutReviewSubmitComponent, CheckoutStepService } from '@spartacus/checkout/base/components';
import { TmaActiveCartFacade, TmaPaymentDetails } from '../../../../core';
import { combineLatest, Observable } from 'rxjs';
import { Card } from '@spartacus/storefront';
import { map } from 'rxjs/operators';
import { UserAccountFacade } from '@spartacus/user/account/root';

@Component({
  selector: 'cx-review-submit',
  templateUrl: './tma-review-submit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaReviewSubmitComponent extends CheckoutReviewSubmitComponent {

  constructor(
    protected checkoutPaymentFacade: CheckoutPaymentFacade,
    protected translation: TranslationService,
    protected userAccountFacade: UserAccountFacade,
    protected checkoutStepService: CheckoutStepService,
    checkoutDeliveryAddressFacade: CheckoutDeliveryAddressFacade, activeCartFacade: TmaActiveCartFacade, checkoutDeliveryModesFacade: CheckoutDeliveryModesFacade
  ) {
    super(checkoutDeliveryAddressFacade, checkoutPaymentFacade, activeCartFacade, translation, checkoutStepService, checkoutDeliveryModesFacade);
  }

  getPaymentMethodCard(paymentDetails: TmaPaymentDetails): Observable<Card> {
    return combineLatest([
      this.translationService.translate('paymentForm.payment'),
      this.translationService.translate('paymentCard.expires', {
        month: paymentDetails.expiryMonth,
        year: paymentDetails.expiryYear,
      }),
      this.translationService.translate('paymentForm.billingAddress'),
      this.translation.translate('paymentMethods.paymentMethod', { data: paymentDetails.name }),
      this.translation.translate('paymentMethods.note'),
      this.userAccountFacade.get()
    ]).pipe(
      map(([textTitle, textExpires, billingAddress, paymentName, paymentNote, user]) => {
        const region = paymentDetails.billingAddress?.region?.isocode
          ? paymentDetails.billingAddress?.region?.isocode + ', '
          : '';
        const billing = {
          title: billingAddress + ':',
          text: [
            paymentDetails.billingAddress?.firstName +
            ' ' +
            paymentDetails.billingAddress?.lastName,
            paymentDetails.billingAddress?.line1,
            paymentDetails.billingAddress?.town +
            ', ' +
            region +
            paymentDetails.billingAddress?.country?.isocode,
            paymentDetails.billingAddress?.postalCode
          ]
        };
        if (paymentDetails.expiryMonth && paymentDetails.expiryYear && paymentDetails.accountHolderName) {
          return ({
            title: textTitle,
            textBold: paymentDetails.accountHolderName,
            text: [paymentDetails.cardNumber, textExpires],
            paragraphs: [billing]
          } as Card);
        } else {
          return ({
            title: textTitle,
            textBold: user?.name,
            text: [paymentName],
            paragraphs: [{ text: [paymentNote] }, billing]
          } as Card)
        }
      })
    );
  }
}
