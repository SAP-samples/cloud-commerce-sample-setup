// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  CmsBannerComponent,
  CmsService,
  SemanticPathService
} from '@spartacus/core';
import { combineLatest, Observable } from 'rxjs';
import { BannerComponent, CmsComponentData } from '@spartacus/storefront';

@Component({
  selector: 'cx-navigation-banner',
  templateUrl: './navigation-banner.component.html',
  styleUrls: ['./navigation-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBannerComponent extends BannerComponent implements OnInit {
  navigationBanners$: Observable<[CmsBannerComponent, CmsBannerComponent, CmsBannerComponent, CmsBannerComponent]>;

  constructor(
    protected component: CmsComponentData<CmsBannerComponent>,
    protected urlService: SemanticPathService,
    protected cmsService: CmsService
  ) {
    super(component, urlService, cmsService)
  }

  ngOnInit() {
    this.navigationBanners$ = combineLatest([
      this.cmsService.getComponentData('PayMyBill_HomepageResponsiveBanner'),
      this.cmsService.getComponentData('MovingHouses_HomepageResponsiveBanner'),
      this.cmsService.getComponentData('DiscoverPlans_HomepageResponsiveBanner'),
      this.cmsService.getComponentData('SwitchProviders_HomepageResponsiveBanner')])
  }
}
