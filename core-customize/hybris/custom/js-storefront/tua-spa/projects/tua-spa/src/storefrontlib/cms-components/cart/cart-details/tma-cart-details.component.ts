// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService, RoutingService } from '@spartacus/core';
import { SelectiveCartFacade } from '@spartacus/cart/base/root';
import { CartConfigService } from '@spartacus/cart/base/core';
import { CartDetailsComponent } from '@spartacus/cart/base/components';
import { TmaActiveCartFacade } from '../../../../core';

@Component({
  selector: 'cx-cart-details',
  templateUrl: './tma-cart-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaCartDetailsComponent extends CartDetailsComponent implements OnInit {

  constructor(
    protected activeCartService: TmaActiveCartFacade,
    protected selectiveCartService: SelectiveCartFacade,
    protected authService: AuthService,
    protected routingService: RoutingService,
    protected cartConfig: CartConfigService
  ) {
    super(activeCartService, selectiveCartService, authService, routingService, cartConfig);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
