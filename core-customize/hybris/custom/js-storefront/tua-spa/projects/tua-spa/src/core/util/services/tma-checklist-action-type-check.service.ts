// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { TmaChecklistAction, TmaChecklistActionType } from '../../model';
import { JourneyChecklistConfig } from '../../config';

@Injectable({
    providedIn: 'root'
})
export class TmaChecklistActionTypeCheckService {

  checklistActions: TmaChecklistAction[];

  constructor(
    protected config?: JourneyChecklistConfig
    ){}

  /**
   * Checks the action type of checklist
   *
   * @param checklistActionList - list of checklist actions
   * @param type - checklist action type
   * @return True if the checklist type is found in the checklist actions list, otherwise false
   */
  hasChecklistActionOfType(checklistActionList: TmaChecklistAction[], type: TmaChecklistActionType): boolean {
    return !!checklistActionList.find((checklistAction: TmaChecklistAction) => checklistAction.actionType === type);
  }

  /**
   * Gets the checklist action type
   *
   * @return A {@link TmaChecklistActionType}
   */
  get checklistActionType(): typeof TmaChecklistActionType {
    return TmaChecklistActionType;
  }

   /**
    * Checks if the action type is provided in the journey checklist steps configuration
    *
    * @param checklistActionList - list of checklist actions
    * @param type - checklist action type
    * @return True if the checklist type is found in the journey checklist steps configuration
    */
  hasJourneyChecklistAction(
    checklistActionList: TmaChecklistAction[],
    type: TmaChecklistActionType
  ): boolean {
     if (checklistActionList && Object.keys(checklistActionList).length !== 0) {
       this.checklistActions = checklistActionList.filter(
         (checklist: TmaChecklistAction) =>
           this.config.journeyChecklist.journeyChecklistSteps.includes(
             checklist.actionType
           )
       );
       if (Object.keys(this.checklistActions).length !== 0) {
         return this.hasChecklistActionOfType(
           this.checklistActions,
           type
         );
       }
     }
     return false;
  }
}
