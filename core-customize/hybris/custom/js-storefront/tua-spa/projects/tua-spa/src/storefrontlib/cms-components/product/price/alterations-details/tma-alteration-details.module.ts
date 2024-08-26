// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmaAlterationDetailsComponent } from './tma-alteration-details.component';
import { I18nModule } from '@spartacus/core';

@NgModule({
  imports: [CommonModule, I18nModule],
  declarations: [TmaAlterationDetailsComponent],
  exports: [TmaAlterationDetailsComponent],
})
export class TmaAlterationDetailsModule {}
