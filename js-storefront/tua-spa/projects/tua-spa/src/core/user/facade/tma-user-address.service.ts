// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Address,
  CommandService,
  OCC_USER_ID_CURRENT,
  StateWithUser,
  UserActions,
  UserAddressConnector,
  UserAddressService,
  UserIdService
} from '@spartacus/core';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TmaUserAddressService extends UserAddressService implements OnDestroy {

  protected subscription = new Subscription();

  constructor(
    protected store: Store<StateWithUser>,
    protected userIdService: UserIdService,
    protected userAddressConnector: UserAddressConnector,
    protected commandService: CommandService
  ) {
    super(store, userIdService, userAddressConnector, commandService);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Adds the provided address to the list of the user's addresses.
   *
   * @param address - The address which will be added
   */
  addUserAddress(address: Address): void {
    this.getUserId(userId =>
      this.store.dispatch(
        new UserActions.AddUserAddress({
          userId,
          address
        })
      )
    );
  }

  protected getUserId(callback: (userId: string) => void): void {
    if (this.userIdService) {
      this.subscription.add(
        this.userIdService
          .getUserId()
          .pipe(
            take(1)
            )
          .subscribe(userId => callback(userId))
      );
    }
    else {
      callback(OCC_USER_ID_CURRENT);
    }
  }

  protected isAddressEqual(a1: Address, a2: Address): boolean {
    return a1.town === a2.town &&
      a1.country.isocode === a2.country.isocode &&
      a1.line1 === a2.line1 &&
      a1.line2 === a2.line2 &&
      a1.postalCode === a2.postalCode &&
      (a1.region ? a1.region.isocode === a2.region.isocode : !a1.region);
  }
}
