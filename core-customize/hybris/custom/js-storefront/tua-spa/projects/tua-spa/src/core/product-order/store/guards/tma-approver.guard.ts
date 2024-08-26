// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { B2BUserRole, GlobalMessageService, GlobalMessageType, RoutingService, User } from '@spartacus/core';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { Observable } from 'rxjs';
import { filter, map, pluck } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TmaApproverGuard implements CanActivate {
  constructor(
    protected userAccountFacade: UserAccountFacade,
    protected routingService: RoutingService,
    protected globalMessageService: GlobalMessageService
  ) {
  }

  /**
   * Controls the user role to be Approver or Admin and redirects to home page it is not
   */
  canActivate(): Observable<boolean> {
    return this.userAccountFacade.get().pipe(
      filter((user: User) => user && Object.keys(user).length > 0),
      pluck('roles'),
      map((roles: string[]) => {
        const hasRole =
          Array.isArray(roles) &&
          (roles.includes(B2BUserRole.APPROVER) ||
            roles.includes(B2BUserRole.ADMIN));

        if (!hasRole) {
          this.routingService.go({ cxRoute: 'home' });

          this.globalMessageService.add(
            {
              key: 'orderApprovalGlobal.notification.noSufficientPermissions'
            },
            GlobalMessageType.MSG_TYPE_WARNING
          );
        }

        return hasRole;
      })
    );
  }
}
