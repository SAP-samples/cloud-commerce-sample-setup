// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { TmaOrderDetailsModule } from './order-details';
import { TmaOrderConfirmationModule } from '../../order-confirmation';

@NgModule({
  imports: [
    TmaOrderConfirmationModule,
    TmaOrderDetailsModule,
  ]
})
export class TmaOrderModule { }
