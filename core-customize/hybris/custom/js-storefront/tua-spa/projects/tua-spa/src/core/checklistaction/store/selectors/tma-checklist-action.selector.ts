// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { LOCAL_STORAGE } from '../../../util';

const {
  ONLY_DEPENDENT_PRODUCT_IS_SET,
  DEPENDENT_PRODUCT_AND_INSTALLATION_ADDRESS_ARE_SET,
  NOTHING_IS_SET
} = LOCAL_STORAGE.DEPENDENT_PRODUCT;

import { createFeatureSelector, createSelector, MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';
import {
  TMA_CHECKLIST_ACTION_FEATURE,
  TmaChecklistActionMap,
  TmaChecklistActionsState,
  TmaStateWithChecklistAction
} from '../tma-checklist-action.state';
import { TmaChecklistAction, TmaCheckListActionDetails } from '../../../model';

export const getTmaChecklistActionsFeatureState: MemoizedSelector<TmaStateWithChecklistAction,
  TmaChecklistActionsState> = createFeatureSelector<TmaChecklistActionsState>(
  TMA_CHECKLIST_ACTION_FEATURE
);

export const getAllChecklistActions: MemoizedSelector<TmaStateWithChecklistAction,
  TmaChecklistActionMap[]> = createSelector(
  getTmaChecklistActionsFeatureState,
  (state: TmaChecklistActionsState) => state.checklistActionsMap
);

export const getAllChecklistActionsForCommodityService: MemoizedSelector<TmaStateWithChecklistAction,
  TmaChecklistActionMap> = createSelector(
  getAllChecklistActions,
  (state: TmaChecklistActionMap[]) => state.length ? state[0] : undefined
);

export const getAllChecklistActionsDetails: MemoizedSelector<TmaStateWithChecklistAction,
  TmaCheckListActionDetails[]> = createSelector(
  getTmaChecklistActionsFeatureState,
  (state: TmaChecklistActionsState) => state.checklistActionDetails
);

export const getChecklistActionForProductCode: MemoizedSelectorWithProps<TmaStateWithChecklistAction,
  any,
  TmaChecklistAction[]> = createSelector(
  getAllChecklistActions,
  (state: TmaChecklistActionMap[], props) => {
    if (props.isDependentProduct || props.isInstallationAddressSelected) {
      return undefined;
    }

    const checklistAction = state
      ? state.find(
        (ca: TmaChecklistActionMap) =>
          ca.productId === props.productCode &&
          ca.baseSiteId === props.baseSiteId &&
          ca.processType === props.processType
      )
      : undefined;

    return !!checklistAction ? checklistAction.checklistAction : undefined;
  }
);

export const getChecklistActionForPoCodes: MemoizedSelectorWithProps<TmaStateWithChecklistAction, any,
  TmaChecklistAction[]> = createSelector(
  getAllChecklistActions, (state: TmaChecklistActionMap[], props) => {
    if (!!props.productOfferingCodes) {
      const filteredChecklistActions: TmaChecklistActionMap[] = state
        ? state.filter(
          (checklist: TmaChecklistActionMap) =>
            props.productOfferingCodes.includes(checklist.productId) &&
            checklist.baseSiteId === props.baseSiteId &&
            checklist.processType === props.processType
        )
        : undefined;
      if (
        !!filteredChecklistActions &&
        filteredChecklistActions.length === props.productOfferingCodes.length
      ) {
        const checklistActions: TmaChecklistAction[] = [];
        filteredChecklistActions.forEach(
          (checklistActionMap: TmaChecklistActionMap) => {
            checklistActions.push(...checklistActionMap.checklistAction);
          }
        );
        return checklistActions;
      }
    }
    return undefined;
  }
);

export const getCurrentViewForDependentProduct: MemoizedSelectorWithProps<TmaStateWithChecklistAction,
  any,
  any> = createSelector(
  getAllChecklistActions,
  (state: TmaChecklistActionMap[], props) => {
    if (state.find(
      (ca: TmaChecklistActionMap) =>
        ca.productId === props.productCode
    )) {
      const foundState = state.find(
        (ca: TmaChecklistActionMap) =>
          ca.productId === props.productCode
      );
      if (foundState.isDependentProduct) {
        if (foundState.isInstallationAddressSelected) {
          return DEPENDENT_PRODUCT_AND_INSTALLATION_ADDRESS_ARE_SET;
        }
        return ONLY_DEPENDENT_PRODUCT_IS_SET;
      }
      return NOTHING_IS_SET;
    }
  }
);
