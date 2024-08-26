// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CmsOrderDetailOverviewComponent, TranslationService } from '@spartacus/core';
import { TmaOrder, TmaOrderEntry, TmaPaymentDetails } from '../../../../core';
import { OrderDetailsService, OrderOverviewComponent } from '@spartacus/order/components';
import { Card, CmsComponentData } from '@spartacus/storefront';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UserAccountFacade } from '@spartacus/user/account/root';

@Component({
  selector: 'cx-order-overview',
  templateUrl: './tma-order-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaOrderOverviewComponent extends OrderOverviewComponent {
  constructor(protected translation: TranslationService,
              protected orderDetailsService: OrderDetailsService,
              protected component: CmsComponentData<CmsOrderDetailOverviewComponent>,
              protected userAccountFacade: UserAccountFacade
  ) {
    super(translation, orderDetailsService, component);
  }

  /**
   * Checks for product present inside the entries of an order.
   *
   * @param order as an {@link Order}
   *
   * @return true if there is entry having product otherwise false {@link boolean}
   */
  checkOrderFor(order: TmaOrder): boolean {
    let entry: TmaOrderEntry;
    if (order.entries) {
      entry = order.entries.find(
        (item: TmaOrderEntry) => Object.keys(item.product).length === 0
      );
    }
    return entry === undefined ? true : false;
  }

  getPaymentInfoCardContent(payment: TmaPaymentDetails): Observable<Card> {
    return combineLatest([
      this.translation.translate('paymentForm.payment'),
      this.translation.translate('paymentCard.expires', {
        month: Boolean(payment) ? payment.expiryMonth : '',
        year: Boolean(payment) ? payment.expiryYear : '',
      }),
      this.translation.translate('paymentMethods.paymentMethod', { data: payment.name }),
      this.translation.translate('paymentMethods.note'),
      this.userAccountFacade.get()
    ]).pipe(
      filter(() => Boolean(payment)),
      map(
        ([textTitle, textExpires, paymentName, paymentNote, user]) => {
          if (payment.expiryMonth && payment.expiryYear && payment.accountHolderName) {
            return ({
              title: textTitle,
              textBold: payment.accountHolderName,
              text: [payment.cardNumber, textExpires],
            } as Card)
          } else {
            return ({
              title: textTitle,
              textBold: user?.name,
              text: [paymentName],
              paragraphs: [{
                text: [paymentNote]
              }]
            } as Card)
          }
        }
      )
    );
  }
}
