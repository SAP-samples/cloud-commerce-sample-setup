// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OutletModule, PageLayoutModule, PageSlotModule } from '@spartacus/storefront';
import { TmaPageLayoutComponent } from './tma-page-layout.component';
import { TmaPageTemplateDirective } from './tma-page-template.directive';

@NgModule({
    imports: [CommonModule, OutletModule, PageSlotModule],
    declarations: [TmaPageLayoutComponent, TmaPageTemplateDirective],
    exports: [TmaPageLayoutComponent, TmaPageTemplateDirective],
  })
  export class TmaPageLayoutModule extends PageLayoutModule {}
