// Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved

import { Component, OnInit } from '@angular/core';
import { CmsService } from '@spartacus/core';
import { combineLatest, Observable } from 'rxjs';
import { CmsBannerComponent } from '@spartacus/core/src/model/cms.model';

@Component({
  selector: 'cx-informational-banner',
  templateUrl: './informational-banner.component.html',
  styleUrls: ['./informational-banner.component.scss']
})
export class InformationalBannerComponent implements OnInit {

  data$: Observable<CmsBannerComponent[]>;

  constructor(protected cmsService: CmsService) {
  }

  ngOnInit() {
    this.data$ = combineLatest([
      this.cmsService.getComponentData('UtilitiesHompageInfo-NaturalGasBannerComponent'),
      this.cmsService.getComponentData('UtilitiesHompageInfo-LowerYourBillBannerComponent'),
      this.cmsService.getComponentData('UtilitiesHompageInfo-GoGreenBannerComponent'),
      this.cmsService.getComponentData('UtilitiesHompageInfo-SaveEnergyBannerComponent')
    ]);
  }
}
