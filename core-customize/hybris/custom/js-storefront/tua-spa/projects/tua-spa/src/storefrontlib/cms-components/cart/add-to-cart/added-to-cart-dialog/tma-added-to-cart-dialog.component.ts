// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { LaunchDialogService } from '@spartacus/storefront';
import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { TmaActiveCartFacade, TmaCartPriceService, TmaProcessTypeEnum } from '../../../../../core';
import { CurrencyService, RoutingService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { AddedToCartDialogComponent } from '@spartacus/cart/base/components';

@Component({
  selector: 'cx-added-to-cart-dialog',
  templateUrl: './tma-added-to-cart-dialog.component.html',
  styleUrls: ['./tma-added-to-cart-dialog.component.scss']
})
export class TmaAddedToCartDialogComponent
  extends AddedToCartDialogComponent
  implements OnInit, OnDestroy {
  @Input()
  hasPremise: boolean;

  currency$: Observable<string>;

  constructor(
    public cartPriceService: TmaCartPriceService,
    protected currencyService: CurrencyService,
    protected activeCartFacade: TmaActiveCartFacade,
    protected launchDialogService: LaunchDialogService,
    protected routingService: RoutingService,
    protected el: ElementRef,
  ) {
    super(activeCartFacade, launchDialogService, routingService, el);
  }

  ngOnInit() {
    super.ngOnInit();
    this.currency$ = this.currencyService.getActive();
  }
   ngOnDestroy() {
     super.ngOnDestroy();
   }

  /**
   * Get the retention process type.
   *
   *  @return Retention process type as a {@link string}
   *  @deprecated since tua-spa 3.2
   */
  getRetentionProcessType(): string {
    return TmaProcessTypeEnum.RETENTION;
  }

  /**
   * Get the renewal process type.
   *
   *  @return Renewal process type as a {@link string}
   */
  getRenewalProcessType(): string {
    return TmaProcessTypeEnum.RENEWAL;
  }
}
