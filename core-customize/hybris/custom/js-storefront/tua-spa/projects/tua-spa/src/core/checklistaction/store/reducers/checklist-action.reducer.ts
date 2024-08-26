// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaChecklistActionType, TmaChecklistActionTypes } from '../actions/tma-checklist-action.action';
import { TmaChecklistActionMap, TmaChecklistActionsState } from '../tma-checklist-action.state';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { InjectionToken, Provider } from '@angular/core';
import { TmaChecklistAction, TmaCheckListActionDetails, TmaTmfProductOffering } from '../../../model';

const initialState: TmaChecklistActionMap[] = [];

export function checklistActionReducer(
  state = initialState,
  action: TmaChecklistActionType
): TmaChecklistActionMap[] {
  if (action.type === TmaChecklistActionTypes.LOAD_CHECKLIST_ACTIONS_SUCCESS) {
    {
      if (action.payload.productCode) {
        if (
          !state.find(
            (checklistActionState: TmaChecklistActionMap) =>
              checklistActionState.productId === action.payload.productCode &&
              checklistActionState.baseSiteId === action.payload.baseSiteId &&
              checklistActionState.processType === action.payload.processType
          )
        ) {
          state = state.concat({
            checklistAction: action.payload.checklistActions,
            productId: action.payload.productCode,
            baseSiteId: action.payload.baseSiteId,
            processType: action.payload.processType,
            isDependentProduct: action.payload.isDependentProduct,
            isInstallationAddressSelected: action.payload.isInstallationAddressSelected
          });
        } else if (action.payload.isDependentProduct) {
          if (state.find((checklistActionState: TmaChecklistActionMap) => checklistActionState.productId === action.payload.productCode)) {
            state = state.filter(checklistAction => checklistAction.productId !== action.payload.productCode);
            state = state.concat({
              checklistAction: action.payload.checklistActions,
              productId: action.payload.productCode,
              baseSiteId: action.payload.baseSiteId,
              processType: action.payload.processType,
              isDependentProduct: action.payload.isDependentProduct,
              isInstallationAddressSelected: action.payload.isInstallationAddressSelected
            });
          }

          return state;
        } else if (action.payload.isInstallationAddressSelected) {
          if (state.find((checklistActionState: TmaChecklistActionMap) => checklistActionState.productId === action.payload.productCode)) {
            state = state.filter(checklistAction => checklistAction.productId !== action.payload.productCode);
            state = state.concat({
              checklistAction: action.payload.checklistActions,
              productId: action.payload.productCode,
              baseSiteId: action.payload.baseSiteId,
              processType: action.payload.processType,
              isDependentProduct: true,
              isInstallationAddressSelected: action.payload.isInstallationAddressSelected
            });
          }

          return state;
        }
        return state;
      }

      if (!action.payload.productOfferingCodes) {
        return state;
      }

      action.payload.productOfferingCodes.forEach(
        (payloadProductOffering: string) => {
          if (
            !state.find(
              (checklistActionState: TmaChecklistActionMap) =>
                checklistActionState.productId === payloadProductOffering &&
                checklistActionState.baseSiteId ===
                action.payload.baseSiteId &&
                checklistActionState.processType ===
                action.payload.processType
            )
          ) {
            const checklists: TmaChecklistAction[] = [];
            if (action.payload.checklistActions.length !== 0) {
              action.payload.checklistActions.forEach(
                (checklistAction: TmaChecklistAction) => {
                  checklistAction.productOffering.forEach(
                    (productOffering: TmaTmfProductOffering) => {
                      const productOfferings: TmaTmfProductOffering[] = [];
                      if (payloadProductOffering === productOffering.id) {
                        productOfferings.push(productOffering);
                        const checklist: TmaChecklistAction = {
                          actionType: checklistAction.actionType,
                          productOffering: productOfferings
                        };
                        checklists.push(checklist);
                      }
                    }
                  );
                }
              );
            }
            state = state.concat({
              checklistAction: checklists,
              productId: payloadProductOffering,
              baseSiteId: action.payload.baseSiteId,
              processType: action.payload.processType
            });
          }
        }
      );
    }
    return state;
  }

  if (action.type === TmaChecklistActionTypes.CLEAR_SELECTED_INSTALLATION_ADDRESS && action.payload.productCode
    && state.find((checklistActionState: TmaChecklistActionMap) => checklistActionState.productId === action.payload.productCode)) {
    let checkListAction: any = {};
    state.find(checklistAction => {
      if (checklistAction.productId === action.payload.productCode) {
        checkListAction = {
          'baseSiteId': checklistAction.baseSiteId,
          'checklistAction': checklistAction.checklistAction,
          'isDependentProduct': checklistAction.isDependentProduct,
          'processType': checklistAction.processType,
          'productId': checklistAction.productId
        };
      }
    });
    state = state.filter(checklistAction => checklistAction.productId !== action.payload.productCode);
    state = state.concat(checkListAction);
    return state;
  }

  if (action.type === TmaChecklistActionTypes.CLEAR_ALL_CHECKLIST_ACTIONS) {
    return initialState;
  }
  return state;
}

const initialCheckListActionDetailsState: any = [];

export function checklistActionDetailsReducer(
  state = initialCheckListActionDetailsState,
  action: TmaChecklistActionType
): TmaCheckListActionDetails[] {
  if (action.type === TmaChecklistActionTypes.CHECKLIST_ACTIONS_WITH_ADD_TO_CART_DETAILS) {
    if (action.payload) {
      action.payload.forEach((item) => {
        state = state.filter((stateItem) => item.type !== stateItem.type);
      });
      state = [...state, ...(action.payload)];
    }
  } else if (action.type === TmaChecklistActionTypes.CLEAR_CHECKLIST_ACTIONS_WITH_ADD_TO_CART_DETAILS) {
    return initialCheckListActionDetailsState;
  }
  return state;
}

export function getReducers(): ActionReducerMap<TmaChecklistActionsState> {
  return {
    checklistActionsMap: checklistActionReducer,
    checklistActionDetails: checklistActionDetailsReducer
  };
}

export const reducerToken: InjectionToken<ActionReducerMap<TmaChecklistActionsState>> = new InjectionToken<ActionReducerMap<TmaChecklistActionsState>>(
  'checklistActionReducer'
);

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers
};

export const metaReducers: MetaReducer<any>[] = [];
