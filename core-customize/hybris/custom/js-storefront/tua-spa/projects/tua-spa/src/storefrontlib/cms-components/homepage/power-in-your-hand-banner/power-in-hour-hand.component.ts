// Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved

import { Component, OnInit } from '@angular/core';
import { CmsService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { CmsBannerComponent } from '@spartacus/core/src/model/cms.model';

@Component({
  selector: 'cx-power-in-your-hand-banner',
  templateUrl: './power-in-hour-hand.component.html',
  styleUrls: ['./power-in-your-hand.component.scss']
})
export class PowerInHourHandComponent implements OnInit {

  data$: Observable<CmsBannerComponent>;

  constructor(protected cmsService: CmsService) {
  }

  ngOnInit() {
    this.data$ = this.cmsService.getComponentData('UtilitiesHompagePutThePowerOfEnergyBannerComponent');
  }
}
