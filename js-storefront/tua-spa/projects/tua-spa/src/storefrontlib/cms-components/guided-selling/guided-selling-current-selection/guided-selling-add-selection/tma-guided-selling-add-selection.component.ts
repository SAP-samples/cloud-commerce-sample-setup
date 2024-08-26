// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TmaProduct, TmfProduct } from '../../../../../core/model';
import { TmaUserIdService } from '../../../../../core/user/facade/tma-user-id.service';
import { take } from 'rxjs/operators';
import { GlobalMessageService, GlobalMessageType, OCC_USER_ID_ANONYMOUS } from '@spartacus/core';

@Component({
  selector: 'cx-guided-selling-add-selection',
  templateUrl: './tma-guided-selling-add-selection.component.html'
})

export class TmaGuidedSellingAddSelectionComponent implements OnInit {

  @Input()
  product: TmaProduct;

  @Input()
  isSelected: boolean;

  @Input()
  tmfProducts: TmfProduct[];

  @Output()
  updateSelected = new EventEmitter<boolean>();

  isFromSubscription = false;

  constructor(protected userIdService: TmaUserIdService, protected globalMessageService: GlobalMessageService) {
  }

  ngOnInit() {
    if (this.tmfProducts) {
      this.isFromSubscription = !!this.tmfProducts.some((tmfProduct: TmfProduct) => tmfProduct.productOffering.id === this.product.code);
    }
  }

  /**
   * Selects a product.
   */
  selectProduct(): void {
    this.userIdService.getUserId().pipe(take(1)
    ).subscribe((user: string) => {
      if (user === OCC_USER_ID_ANONYMOUS) {
        this.globalMessageService.add({
            key: 'productDetails.loginNeeded'
          },
          GlobalMessageType.MSG_TYPE_ERROR);
        return;
      }
      this.updateSelected.emit(!this.isSelected);
    });
  }
}
