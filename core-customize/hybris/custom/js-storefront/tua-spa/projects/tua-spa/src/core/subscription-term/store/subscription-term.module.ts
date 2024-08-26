// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { SubscriptionTermService } from '../facade/subscription-term.service';
import { subscriptionTermReducer } from './reducers/subscription-term.reducers';
import { SUBSCRIPTION_TERM_FEATURE } from './subscription-term.state';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(SUBSCRIPTION_TERM_FEATURE, subscriptionTermReducer)
  ],
  providers: [SubscriptionTermService]
})
export class SubscriptionTermModule {}
