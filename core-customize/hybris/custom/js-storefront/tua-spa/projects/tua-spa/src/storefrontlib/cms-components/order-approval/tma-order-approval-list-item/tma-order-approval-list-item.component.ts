// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TmaProductOrder, TmaStateType } from '../../../../core/model';
import { Subscription } from 'rxjs';
import { BaseSiteService } from '@spartacus/core';
import { TmaProductOrderService } from '../../../../core/product-order/facade';
import { first } from 'rxjs/operators';

@Component({
  selector: 'cx-order-approval-list-item',
  templateUrl: './tma-order-approval-list-item.component.html',
  styleUrls: ['./tma-order-approval-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaOrderApprovalListItemComponent implements OnInit, OnDestroy {

  @Input()
  productOrder: TmaProductOrder;

  showDetails: boolean;
  protected currentBaseSiteId: string;
  protected subscription = new Subscription();

  constructor(
    protected productOrderService: TmaProductOrderService,
    protected baseSiteService: BaseSiteService
  ) {}

  ngOnInit(): void {
    this.showDetails = false;

    this.subscription.add(
      this.baseSiteService
        .getActive()
        .pipe(
          first((baseSiteId: string) => baseSiteId != null)
        )
        .subscribe((baseSiteId: string) => (this.currentBaseSiteId = baseSiteId))
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Changes the visibility state of the Order Details dropdown component
   * @param flag Defines if the Order Details dropdown is visible (flag = true) or not (flag = false)
   */
  toggleDetails(flag: boolean): void {
    this.showDetails = flag;
  }

  /**
   * Updates the order status.
   * @param id - The unique identifier of the order
   * @param status - The status of the order
   * @param relatedParty - The related party of the order
   */
  updateOrder(id: string, status: TmaStateType, relatedParty: string): void {
    const order: TmaProductOrder = {
      state: status,
      relatedParty: [
        {
          id: relatedParty
        }
      ]
    };

    this.productOrderService.updateOrder(this.currentBaseSiteId, id, order);
  }

  get OrderStateType(): typeof TmaStateType {
    return TmaStateType;
  }

}
