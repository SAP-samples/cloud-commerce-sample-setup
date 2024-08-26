// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { CmsComponentData, LAUNCH_CALLER, LaunchDialogService, MediaService } from '@spartacus/storefront';
import { BaseSiteService, OccConfig } from '@spartacus/core';
import { QueryServiceQualificationService, TmaChecklistActionService, TmaCmsServiceabilityBannerComponent } from '../../../core';
import { Subscription } from 'rxjs';
import { first, take } from 'rxjs/operators';

@Component({
  selector: 'cx-serviceability-banner',
  templateUrl: './serviceability-banner.component.html',
  styleUrls: ['./serviceability-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceabilityBannerComponent implements OnDestroy {
  modalRef: any;
  baseUrl: string;
  protected baseSiteId: string;
  private subscription = new Subscription();
  @ViewChild('elements') element: ElementRef;

  constructor(
    public component: CmsComponentData<TmaCmsServiceabilityBannerComponent>,
    public mediaService: MediaService,
    protected config: OccConfig,
    protected queryServiceQualificationService: QueryServiceQualificationService,
    protected launchDialogService: LaunchDialogService,
    protected vcr: ViewContainerRef,
    protected tmaChecklistActionService: TmaChecklistActionService,
    protected baseSiteService: BaseSiteService,
  ) {
    this.subscription.add(
      this.baseSiteService
        .getActive()
        .pipe(
          first((baseSiteId: string) => !!baseSiteId)
        )
        .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId))
    );
  }

  ngOnDestroy() {
    this.queryServiceQualificationService.clearQueryServiceQualificationState();
    this.queryServiceQualificationService.clearQueryServiceSearchResultState();
    this.subscription?.unsubscribe();
  }

  checkServiceability(data: TmaCmsServiceabilityBannerComponent) {
    this.subscription.add(this.tmaChecklistActionService.getChecklistActionForProductCode(this.baseSiteId, data.simpleProductOffering.code)
      .subscribe());
    const modalInstanceData = {
      simpleProductOffering: data.simpleProductOffering,
    };
    if (data.bundledProductOffering !== undefined) {
      modalInstanceData['bundleProductOffering'] = data.bundledProductOffering;
    }
    const dialog = this.launchDialogService.openDialog(
      LAUNCH_CALLER.SERVICEABILITY_FORM,
      undefined,
      this.vcr,
      modalInstanceData
    );
    if (dialog) {
      this.subscription.add(dialog.pipe(take(1)).subscribe());
    }
  }
}
