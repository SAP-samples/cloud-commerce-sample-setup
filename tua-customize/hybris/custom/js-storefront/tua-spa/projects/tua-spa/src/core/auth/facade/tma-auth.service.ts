/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AuthActions,
  AuthMultisiteIsolationService,
  AuthRedirectService,
  AuthService,
  AuthStorageService,
  OAuthLibWrapperService,
  OCC_USER_ID_CURRENT,
  RoutingService,
  StateWithClientAuth
} from '@spartacus/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { TmaUserIdService } from '../../user/facade/tma-user-id.service';

/**
 * Auth service for normal user authentication.
 * Use to check auth status, login/logout with different OAuth flows.
 */
@Injectable({
  providedIn: 'root',
})
export class TmaAuthService extends AuthService {
  /**
   * Indicates whether the access token is being refreshed
   */
  refreshInProgress$: Observable<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Indicates whether the logout is being performed
   */
  logoutInProgress$: Observable<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    protected store: Store<StateWithClientAuth>,
    protected userIdService: TmaUserIdService,
    protected oAuthLibWrapperService: OAuthLibWrapperService,
    protected authStorageService: AuthStorageService,
    protected authRedirectService: AuthRedirectService,
    protected routingService: RoutingService,
    protected userAccountFacade: UserAccountFacade,
    protected authMultisiteIsolationService?: AuthMultisiteIsolationService,

  ) {
    super(store, userIdService, oAuthLibWrapperService, authStorageService, authRedirectService, routingService)
  }

  /**
   * Loads a new user token with Resource Owner Password Flow.
   * @param userId
   * @param password
   */
  async loginWithCredentials(userId: string, password: string): Promise<void> {
    let uid = userId;

    if (this.authMultisiteIsolationService) {
      uid = await this.authMultisiteIsolationService
        .decorateUserId(uid)
        .toPromise();
    }

    try {
      await this.oAuthLibWrapperService.authorizeWithPasswordFlow(
        uid,
        password
      );

      // OCC specific user id handling. Customize when implementing different backend
      this.userIdService.setUserId(OCC_USER_ID_CURRENT);
      this.userIdService.setCustomerId(userId);

      this.store.dispatch(new AuthActions.Login());
      localStorage.removeItem('active_guid');

      this.authRedirectService.redirect();
    } catch {}
  }
}
