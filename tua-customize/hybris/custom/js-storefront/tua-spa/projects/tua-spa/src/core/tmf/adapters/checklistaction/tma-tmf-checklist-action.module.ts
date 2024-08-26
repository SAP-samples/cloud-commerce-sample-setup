// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ConfigModule } from '@spartacus/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { defaultTmaTmfChecklistActionConfig } from './default-tma-tmf-checklist-action-config';
import { TmaTmfChecklistActionAdapter } from './tma-tmf-checklist-action.adapter';
import { TmaChecklistActionAdapter } from '../../../checklistaction/store/adapters';
import { TmaTmfChecklistActionNormalizer } from './converters';
import { TMA_CHECKLIST_ACTION_NORMALIZER } from '../../../checklistaction/connectors';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmaTmfChecklistActionConfig),
  ],
  providers: [
    {
      provide: TmaChecklistActionAdapter,
      useClass: TmaTmfChecklistActionAdapter,
    },
    {
      provide: TMA_CHECKLIST_ACTION_NORMALIZER,
      useExisting: TmaTmfChecklistActionNormalizer,
      multi: true,
    },
  ],
})
export class TmaTmfChecklistActionModule {}
