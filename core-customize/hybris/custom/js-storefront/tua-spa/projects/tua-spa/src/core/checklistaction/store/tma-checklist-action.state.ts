// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaChecklistAction, TmaCheckListActionDetails, TmaProcessTypeEnum } from '../../model';

export const TMA_CHECKLIST_ACTION_FEATURE = 'checklist-action';
export const TMA_CHECKLIST_ACTION_DATA =
  '[Checklist-action] Checklist Action Data';

export interface TmaStateWithChecklistAction {
  [TMA_CHECKLIST_ACTION_FEATURE]: TmaChecklistActionsState;
}

export class TmaChecklistActionMap {
  productId: string;
  baseSiteId: string;
  processType?: TmaProcessTypeEnum;
  checklistAction: TmaChecklistAction[];
  isDependentProduct?: boolean;
  isInstallationAddressSelected?: boolean;
}

export interface TmaChecklistActionsState {
  checklistActionsMap: TmaChecklistActionMap[];
  checklistActionDetails: TmaCheckListActionDetails[];
}
