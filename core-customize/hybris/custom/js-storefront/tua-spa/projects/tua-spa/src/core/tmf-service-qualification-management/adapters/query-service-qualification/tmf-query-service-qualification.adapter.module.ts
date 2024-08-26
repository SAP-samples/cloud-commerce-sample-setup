// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ConfigModule } from '@spartacus/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TmfQueryServiceQualificationAdapter } from './tmf-query-service-qualification.adapter';
import { QueryServiceQualificationAdapter } from '../../../queryServiceQualification';
import { defaultTmfQueryServiceQualificationAdapterConfig } from './default-tmf-query-service-qualification-adapter-config';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmfQueryServiceQualificationAdapterConfig)
  ],
  providers: [
    {
      provide: QueryServiceQualificationAdapter,
      useClass: TmfQueryServiceQualificationAdapter
    }
  ]
})
export class TmfQueryServiceQualificationAdapterModule {}
