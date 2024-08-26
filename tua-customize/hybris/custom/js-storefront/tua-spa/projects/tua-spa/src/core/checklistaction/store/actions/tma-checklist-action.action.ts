// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { StateUtils } from '@spartacus/core';
import { TMA_CHECKLIST_ACTION_DATA } from '../tma-checklist-action.state';
import { TmaCheckListActionDetails } from '../../../model';

export enum TmaChecklistActionTypes {
  LOAD_CHECKLIST_ACTIONS = '[Checklist-action] Load Checklist Actions',
  LOAD_CHECKLIST_ACTIONS_SUCCESS = '[Checklist-action] Load Checklist Actions Success',
  LOAD_CHECKLIST_ACTIONS_FAIL = '[Checklist-action] Load Checklist Actions Fail',
  CLEAR_ALL_CHECKLIST_ACTIONS = '[Checklist-action] Clear all Checklist Actions',
  CHECKLIST_ACTIONS_WITH_ADD_TO_CART_DETAILS = '[Checklist-action] Checklist Actions With Add To Cart Details',
  CLEAR_CHECKLIST_ACTIONS_WITH_ADD_TO_CART_DETAILS = '[Checklist-action] CLear Checklist Actions With Add To Cart Details',
  CLEAR_SELECTED_INSTALLATION_ADDRESS = '[Checklist-action] Clear Selected Installation Address',
}

export class LoadChecklistActions extends StateUtils.LoaderLoadAction {
  readonly type = TmaChecklistActionTypes.LOAD_CHECKLIST_ACTIONS;

  constructor(public payload: any) {
    super(TMA_CHECKLIST_ACTION_DATA);
  }
}

export class LoadChecklistActionsSuccess extends StateUtils.LoaderLoadAction {
  readonly type = TmaChecklistActionTypes.LOAD_CHECKLIST_ACTIONS_SUCCESS;

  constructor(public payload: any) {
    super(TMA_CHECKLIST_ACTION_DATA);
  }
}

export class LoadChecklistActionsFail extends StateUtils.LoaderLoadAction {
  readonly type = TmaChecklistActionTypes.LOAD_CHECKLIST_ACTIONS_FAIL;

  constructor(public payload: any) {
    super(TMA_CHECKLIST_ACTION_DATA);
  }
}

export class ClearAllChecklistActions extends StateUtils.LoaderResetAction {
  readonly type = TmaChecklistActionTypes.CLEAR_ALL_CHECKLIST_ACTIONS;

  constructor() {
    super(TMA_CHECKLIST_ACTION_DATA);
  }
}

export class ChecklistActionDetails extends StateUtils.LoaderLoadAction {
  readonly type = TmaChecklistActionTypes.CHECKLIST_ACTIONS_WITH_ADD_TO_CART_DETAILS;
  constructor(
    public payload: TmaCheckListActionDetails[]
  ) {
    super(TMA_CHECKLIST_ACTION_DATA);
  }
}

export class ClearChecklistActionDetails extends StateUtils.LoaderResetAction {
  readonly type = TmaChecklistActionTypes.CLEAR_CHECKLIST_ACTIONS_WITH_ADD_TO_CART_DETAILS;
  constructor() {
    super(TMA_CHECKLIST_ACTION_DATA);
  }
}

export class ClearSelectedInstallationAddress extends StateUtils.LoaderLoadAction {
  readonly type = TmaChecklistActionTypes.CLEAR_SELECTED_INSTALLATION_ADDRESS;
  constructor(public payload: any) {
    super(TMA_CHECKLIST_ACTION_DATA);
  }
}

export type TmaChecklistActionType =
  | LoadChecklistActions
  | LoadChecklistActionsSuccess
  | LoadChecklistActionsFail
  | ClearAllChecklistActions
  | ClearSelectedInstallationAddress
  | ChecklistActionDetails
  | ClearChecklistActionDetails;
