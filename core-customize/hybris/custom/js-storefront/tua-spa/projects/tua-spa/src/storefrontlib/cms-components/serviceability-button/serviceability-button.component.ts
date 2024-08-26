// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { CmsComponentData, LAUNCH_CALLER, LaunchDialogService } from '@spartacus/storefront';
import { Country, OccConfig, Region } from '@spartacus/core';
import {
  GeographicAddress,
  GeographicAddressService,
  QueryServiceQualification,
  QueryServiceQualificationService,
  TmaCmsServiceabilityBannerComponent,
  TmaProductSearchService
} from '../../../core';
import { Observable } from 'rxjs';
import { ServiceabilityCategoryFormComponent } from './serviceability-category-form';
import { take } from 'rxjs/operators';

@Component({
  selector: 'cx-serviceability-button',
  templateUrl: './serviceability-button.component.html',
  styleUrls: ['./serviceability-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceabilityButtonComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  baseUrl: string;
  buttonSwitch: boolean;
  country: Country;
  region: Region;
  systemNotAvailable: boolean = false;

  @ViewChild('elements') element: ElementRef;

  constructor(
    public component: CmsComponentData<TmaCmsServiceabilityBannerComponent>,
    public tmaProductSearchService: TmaProductSearchService,
    protected launchDialogService: LaunchDialogService,
    protected vcr: ViewContainerRef,
    public geographicAddressService?: GeographicAddressService,
    protected config?: OccConfig,
    protected changeDetectorRef?: ChangeDetectorRef,
    protected queryServiceQualificationService?: QueryServiceQualificationService
  ) {}

  ngOnInit() {
    this.buttonSwitch = false;
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.tmaProductSearchService.addToCart = false;
  }

  /**
   * Opens {@link ServiceabilityCategoryFormComponent}
   *
   */
  displayAddressForm(): void {
    const dialog = this.launchDialogService.openDialog(
      LAUNCH_CALLER.SERVICEABILITY_CATEGORY_FORM,
      this.element,
      this.vcr
    );
    if (dialog) {
      dialog.pipe(take(1)).subscribe();
    }
  }

  /**
   * Gets the address from queryServiceQualificationState
   *
   * @returns of {@link GeographicAddress}
   */
  getAddressFromState(): Observable<QueryServiceQualification> {
    return this.queryServiceQualificationService.getQueryServiceQualificationInCategoryPage();
  }
}
