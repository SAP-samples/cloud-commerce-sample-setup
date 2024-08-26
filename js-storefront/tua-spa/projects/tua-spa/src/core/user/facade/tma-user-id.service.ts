/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { OCC_USER_ID_ANONYMOUS, UserIdService } from '@spartacus/core';

/**
 * This implementation is OCC specific.
 * Different backend might have completely different need regarding user id.
 * It might not need user id at all and work based on access_token.
 * To implement custom solution provide your own implementation and customize services that use UserIdService
 */
@Injectable({
  providedIn: 'root',
})
export class TmaUserIdService extends UserIdService {
  private _customerId: Observable<string> = new ReplaySubject<string>(1);

  /**
   * Sets current user id.
   *
   * @param userId
   */
  public setCustomerId(userId: string): void {
    (this._customerId as ReplaySubject<string>).next(userId);
  }

  /**
   * This function provides the userId the OCC calls should use, depending
   * on whether there is an active storefront session or not.
   *
   * It returns the userId of the current storefront user or 'anonymous'
   * in the case there are no signed in user in the storefront.
   *
   * The user id of a regular customer session is 'current'. In the case of an
   * asm customer emulation session, the userId will be the customerId.
   */
  public getCustomerId(): Observable<string> {
    return this._customerId;
  }


  /**
   * Sets user id to the default value for logged out user.
   */
  public clearUserId(): void {
    this.setUserId(OCC_USER_ID_ANONYMOUS);
    this.setCustomerId(OCC_USER_ID_ANONYMOUS);
  }

}
