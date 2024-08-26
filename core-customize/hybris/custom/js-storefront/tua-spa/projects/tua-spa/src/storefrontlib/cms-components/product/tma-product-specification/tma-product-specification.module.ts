// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmaBooleanConfigurablePscvuComponent } from './tma-boolean-configurable-pscvu/tma-boolean-configurable-pscvu.component';
import { TmaDateConfigurablePscvuComponent } from './tma-date-configurable-pscvu/tma-date-configurable-pscvu.component';
import { TmaTextConfigurablePscvuComponent } from './tma-text-configurable-pscvu/tma-text-configurable-pscvu.component';
import {
  TmaSelectionConfigurablePscvuComponent
} from './tma-selection-configurable-pscvu/tma-selection-configurable-pscvu.component';
import {
  TmaMultipleSelectionConfigurablePscvuComponent
} from './tma-multiple-selection-configurable-pscvu/tma-multiple-selection-configurable-pscvu.component';
import { TmaConfigurablePscvuComponent } from './tma-configurable-pscvu/tma-configurable-pscvu.component';
import { TmaNumberConfigurablePscvuComponent } from './tma-number-configurable-pscvu/tma-number-configurable-pscvu.component';
import { I18nModule } from '@spartacus/core';


@NgModule({
  declarations: [
    TmaBooleanConfigurablePscvuComponent,
    TmaDateConfigurablePscvuComponent,
    TmaTextConfigurablePscvuComponent,
    TmaSelectionConfigurablePscvuComponent,
    TmaMultipleSelectionConfigurablePscvuComponent,
    TmaConfigurablePscvuComponent,
    TmaNumberConfigurablePscvuComponent
  ],
  exports: [
    TmaBooleanConfigurablePscvuComponent,
    TmaDateConfigurablePscvuComponent,
    TmaTextConfigurablePscvuComponent,
    TmaSelectionConfigurablePscvuComponent,
    TmaMultipleSelectionConfigurablePscvuComponent,
    TmaConfigurablePscvuComponent,
    TmaNumberConfigurablePscvuComponent
  ],
  imports: [
    CommonModule,
    I18nModule
  ]
})
export class TmaProductSpecificationModule {
}
