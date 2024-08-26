// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule, provideConfig } from '@spartacus/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TerminationConfirmComponent } from './termination-confirm.component';
import { defaultTerminationConfirmDialogLayoutConfig } from './termination-confirm-dialog-layout.config';
import { KeyboardFocusModule, SpinnerModule } from '@spartacus/storefront';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    NgxSpinnerModule,
    SpinnerModule,
    KeyboardFocusModule
  ],
  declarations: [TerminationConfirmComponent],
  providers: [provideConfig(defaultTerminationConfirmDialogLayoutConfig)],
  exports: [TerminationConfirmComponent]
})
export class TerminationConfirmModule {
}
