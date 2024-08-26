// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { ChecklistInstallationAddressComponent } from './checklist-installation-address.component';
import { TmaAddressFormModule } from '../../address-form';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TmaTechnicalIdFormModule } from '../../technical-id-form';

@NgModule({
    imports: [
        CommonModule,
        I18nModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        TmaAddressFormModule,
        TmaTechnicalIdFormModule
    ],
  declarations: [ChecklistInstallationAddressComponent],
  exports: [ChecklistInstallationAddressComponent]
})
export class ChecklistInstallationAddressModule {
}
