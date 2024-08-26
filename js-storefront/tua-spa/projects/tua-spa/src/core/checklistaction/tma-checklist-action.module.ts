// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { TmaChecklistActionStoreModule } from './store/tma-checklist-action-store.module';
import { TmaChecklistActionService } from './facade';
import { ChecklistActionBuilder } from './events/checklist-action.builder';
import { ChecklistActionEventModule } from './events/checklist-action-event.module';

@NgModule({
  imports: [ChecklistActionEventModule, TmaChecklistActionStoreModule],
  providers: [ChecklistActionBuilder]
})
export class TmaChecklistActionModule {
  static forRoot(): ModuleWithProviders<TmaChecklistActionModule> {
    return {
      ngModule: TmaChecklistActionModule,
      providers: [TmaChecklistActionService],
    };
  }
}
