// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectorRef, Directive, ElementRef, OnInit, Optional, TemplateRef } from '@angular/core';
import { PageLayoutService, PageTemplateDirective } from '@spartacus/storefront';

@Directive({
    selector: '[cxPageTemplateStyle]',
})

export class TmaPageTemplateDirective extends PageTemplateDirective implements OnInit {

    constructor(
        protected pageLayoutService: PageLayoutService,
        protected elementRef: ElementRef,
        @Optional() protected templateRef: TemplateRef<HTMLElement>,
        protected cd: ChangeDetectorRef
      ) { super(pageLayoutService, elementRef, templateRef, cd); }

    ngOnInit() {
        this.cd.markForCheck();
    }
}
