// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { CmsComponentData } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { TmaCmsConsumptionComponent } from '../../../../core/model';

@Component({
  selector: 'cx-consumption',
  templateUrl: './tma-consumption.component.html',
  styleUrls: ['./tma-consumption.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaConsumptionComponent implements OnInit {

  data$: Observable<TmaCmsConsumptionComponent>;
  url$: Observable<UrlSegment[]>;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected componentData?: CmsComponentData<TmaCmsConsumptionComponent>
  ) {
  }

  ngOnInit(): void {
    this.url$ = this.activatedRoute.url;
    this.data$ = this.componentData.data$;
  }
}
