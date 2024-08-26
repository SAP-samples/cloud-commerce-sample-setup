// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule } from '@spartacus/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TmaCartItemConfigurablePscvDisplayComponent } from './tma-cart-item-configurable-pscv-display.component';

@NgModule({
  imports: [CommonModule, I18nModule, NgbModule],
  declarations: [TmaCartItemConfigurablePscvDisplayComponent],
  exports: [TmaCartItemConfigurablePscvDisplayComponent]
})
export class TmaCartItemConfigurablePscvDisplayModule {}
