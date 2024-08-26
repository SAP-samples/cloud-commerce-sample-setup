/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, OnDestroy } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  AuthRedirectStorageService,
  AuthStatePersistenceService,
  AuthStorageService,
  AuthToken,
  StatePersistenceService
} from '@spartacus/core';
import { TmaUserIdService } from '../../user/facade/tma-user-id.service';

/**
 * Auth state synced to browser storage.
 */
export interface SyncedAuthState {
  userId?: string;
  customerId?: string;
  token?: AuthToken;
  redirectUrl?: string;
}

/**
 * Responsible for saving the authorization data (userId, token, redirectUrl) in browser storage.
 */
@Injectable({
  providedIn: 'root',
})
export class TmaAuthStatePersistenceService extends AuthStatePersistenceService implements OnDestroy {
  protected subscription = new Subscription();

  constructor(
    protected statePersistenceService: StatePersistenceService,
    protected userIdService: TmaUserIdService,
    protected authStorageService: AuthStorageService,
    protected authRedirectStorageService: AuthRedirectStorageService
  ) {
    super(statePersistenceService, userIdService, authStorageService, authRedirectStorageService)
  }

  /**
   * Identifier used for storage key.
   */
  protected key = 'auth';


  /**
   * Gets and transforms state from different sources into the form that should
   * be saved in storage.
   */
  protected getAuthState(): Observable<SyncedAuthState> {
    return combineLatest([
      this.authStorageService.getToken().pipe(
        filter((state) => !!state),
        map((state) => {
          return {
            ...state,
          };
        })
      ),
      this.userIdService.getUserId(),
      this.userIdService.getCustomerId(),
      this.authRedirectStorageService.getRedirectUrl(),
    ]).pipe(
      map(([authToken, userId, customerId, redirectUrl]) => {
        let token = authToken;
        if (token) {
          token = { ...token };
          // To minimize risk of user account hijacking we don't persist user refresh_token
          delete token.refresh_token;
        }
        return { token, userId, customerId, redirectUrl };
      })
    );
  }

  /**
   * Function called on each browser storage read.
   * Used to update state from browser -> state.
   */
  protected onRead(state: SyncedAuthState | undefined) {
    if (state?.token) {
      this.authStorageService.setToken(state.token);
    }
    if (state?.redirectUrl) {
      this.authRedirectStorageService.setRedirectUrl(state.redirectUrl);
    }
    if (state?.userId) {
      this.userIdService.setUserId(state.userId);
    }
    if (state?.customerId) {
      this.userIdService.setCustomerId(state.customerId);
    } else {
      this.userIdService.clearUserId();
    }
  }
}
