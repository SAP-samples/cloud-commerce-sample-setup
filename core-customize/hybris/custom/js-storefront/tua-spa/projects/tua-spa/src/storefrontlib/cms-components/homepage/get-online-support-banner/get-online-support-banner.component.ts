// Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved

import { Component, OnInit } from '@angular/core';
import { CmsService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { CmsBannerComponent } from '@spartacus/core/src/model/cms.model';
import { MediaService } from '@spartacus/storefront';

@Component({
  selector: 'cx-get-online-support-banner',
  templateUrl: './get-online-support-banner.component.html',
  styleUrls: ['./get-online-support-banner.component.scss']
})
export class GetOnlineSupportBannerComponent implements OnInit {

  data$: Observable<CmsBannerComponent>;

  constructor(protected cmsService: CmsService, protected mediaService: MediaService) {
  }

  ngOnInit() {
    this.data$ = this.cmsService.getComponentData('UtilitiesHompageGetOnlineSupportBannerComponent');
  }
}
