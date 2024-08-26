// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import {
  GlobalMessageService, GlobalMessageType,
  SemanticPathService,
} from '@spartacus/core';
import { TmaChecklistActionService } from '../../../core';
import { map, take } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

@Injectable()
export class TmaCommodityServiceGuard {
  constructor(
    protected globalMessageService: GlobalMessageService,
    protected semanticPathService: SemanticPathService,
    protected router: Router,
    protected tmaChecklistActionService: TmaChecklistActionService
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return combineLatest([
      this.tmaChecklistActionService.getAllChecklistActionsForCommodityService(),
      this.tmaChecklistActionService.getChecklistActionDetails()
    ]).pipe(
      take(1),
      map(([checklistActions, checklistListActionsFullFiled]) => {
        if (checklistActions !== undefined && checklistListActionsFullFiled?.length) {
          const completedChecklistActions = checklistActions?.checklistAction.filter(checklistAction => {
            return checklistListActionsFullFiled.find(completedChecklistAction => checklistAction.actionType === completedChecklistAction.type);
          });
          return completedChecklistActions.length === checklistActions.checklistAction.length ? true : this.router.parseUrl(
            this.semanticPathService.get('setUpAService') ?? ''
          );
        } else {
          this.globalMessageService.add(
            { key: 'setUpAService.errorMessage' },
            GlobalMessageType.MSG_TYPE_ERROR
          );
          return this.router.parseUrl(
            this.semanticPathService.get('setUpAService') ?? ''
          );
        }
      })
    )
  }
}
