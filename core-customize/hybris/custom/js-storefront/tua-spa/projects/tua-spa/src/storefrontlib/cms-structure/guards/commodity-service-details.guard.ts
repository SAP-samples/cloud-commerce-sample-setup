// Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import {
  BaseSiteService,
  GlobalMessageService, GlobalMessageType, isNotUndefined, RoutingService,
  SemanticPathService,
} from '@spartacus/core';
import { LOCAL_STORAGE, TmaChecklistAction, TmaChecklistActionService } from '../../../core';
import { distinctUntilChanged, filter, map, switchMap, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

const { BASE_SITES } = LOCAL_STORAGE;

@Injectable()
export class TmaCommodityServiceDetailsGuard {

  private _activeBaseSite: string;

  constructor(
    protected globalMessageService: GlobalMessageService,
    protected semanticPathService: SemanticPathService,
    protected router: Router,
    protected tmaChecklistActionService: TmaChecklistActionService,
    protected baseSiteService: BaseSiteService,
    private routingService: RoutingService
  ) {
    this.baseSiteService
      .getActive().pipe(take(1))
      .subscribe((value) => (this._activeBaseSite = value));
  }

  canActivate(): Observable<any | UrlTree> {
    if (this._activeBaseSite === BASE_SITES.utilities) {
      return this.getCode().pipe(
        distinctUntilChanged(),
        switchMap((productCode: string) => {
          return this.tmaChecklistActionService.getChecklistActionForProductCode(this._activeBaseSite, productCode).pipe(take(2),
            filter((checklistActions) => checklistActions !== undefined),
            map((checklistActions: TmaChecklistAction[]) => {
              if (checklistActions.length) {
                this.globalMessageService.add(
                  { key: 'setUpAService.errorMessage' },
                  GlobalMessageType.MSG_TYPE_ERROR
                );
                return this.router.parseUrl(
                  this.semanticPathService.get('setUpAService') ?? ''
                );
              }
              return checklistActions.length === 0
            }),
            switchMap((checklistActions) => of(checklistActions))
          );
        }),
        filter(isNotUndefined)
      );
    } else {
     of(true)
    }
  }

  protected getCode(): Observable<string> {
    return this.routingService
      .getRouterState()
      .pipe(map((state) => state?.nextState?.params['productCode']));
  }
}
