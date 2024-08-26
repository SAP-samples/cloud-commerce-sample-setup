// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { StateUtils } from '@spartacus/core';
import { SEARCH_TIME_SLOT_DATA } from '../search-time-slot.state';
import { Action } from '@ngrx/store';

export enum SearchTimeSlotActionTypes {
  LOAD_SEARCH_TIME_SLOT = '[Search-TimeSlot] Load SearchTimeSlot',
  LOAD_SEARCH_TIME_SLOT_SUCCESS = '[Search-TimeSlot Load SearchTimeSlot Success',
  LOAD_SEARCH_TIME_SLOT_FAIL = '[Search-TimeSlot] Load SearchTimeSlot Fail',
  SELECTED_TIME_SLOT_SUCCESS = '[Search-TimeSlot] Selected TimeSlot Success',
  CLEAR_SEARCH_TIME_SLOT_STATE = '[Search-TimeSlot] Clear SearchTimeSlot State',
  CLEAR_SEARCH_TIME_ERROR_STATE = '[Search-TimeSlot] Clear SearchTimeSlot Error State',
  CLEAR_SELECTED_SEARCH_TIME_SLOT_STATE = '[Search-TimeSlot] Clear Selected SearchTimeSlot State'
}

export class LoadSearchTimeSlot extends StateUtils.LoaderLoadAction {
  readonly type = SearchTimeSlotActionTypes.LOAD_SEARCH_TIME_SLOT;

  constructor(public payload: any) {
    super(SEARCH_TIME_SLOT_DATA);
  }
}

export class LoadSearchTimeSlotSuccess extends StateUtils.LoaderSuccessAction {
  readonly type = SearchTimeSlotActionTypes.LOAD_SEARCH_TIME_SLOT_SUCCESS;

  constructor(public payload: any) {
    super(SEARCH_TIME_SLOT_DATA);
  }
}

export class LoadSearchTimeSlotFail extends StateUtils.LoaderFailAction {
  readonly type = SearchTimeSlotActionTypes.LOAD_SEARCH_TIME_SLOT_FAIL;

  constructor(public payload: any) {
    super(SEARCH_TIME_SLOT_DATA);
  }
}

export class SelectedTimeSlotSucess {
  readonly type = SearchTimeSlotActionTypes.SELECTED_TIME_SLOT_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ClearSearchTimeSlotState implements Action {
  readonly type = SearchTimeSlotActionTypes.CLEAR_SEARCH_TIME_SLOT_STATE;

  constructor() {
  }
}

export class ClearSearchTimeSlotErrorState implements Action {
  readonly type = SearchTimeSlotActionTypes.CLEAR_SEARCH_TIME_ERROR_STATE;

  constructor() {
  }
}

export class ClearSelectedSearchTimeSlotState implements Action {
  readonly type =
    SearchTimeSlotActionTypes.CLEAR_SELECTED_SEARCH_TIME_SLOT_STATE;

  constructor() {
  }
}

export type SearchTimeSlotAction =
  | LoadSearchTimeSlot
  | LoadSearchTimeSlotSuccess
  | LoadSearchTimeSlotFail
  | SelectedTimeSlotSucess
  | ClearSearchTimeSlotState
  | ClearSearchTimeSlotErrorState
  | ClearSelectedSearchTimeSlotState;
