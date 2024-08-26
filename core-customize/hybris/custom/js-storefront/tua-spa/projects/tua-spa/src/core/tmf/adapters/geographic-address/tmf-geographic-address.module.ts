// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ConfigModule } from '@spartacus/core';
import { defaultTmfGeographicAddressConfig } from './default-tmf-geographic-address-config';
import { TmfGeographicAddressAdapter } from './tmf-geographic-address.adapter';
import { GEOGRAPHIC_ADDRESS_NORMALIZER } from '../../../geographic-address/connectors';
import { TmfGeographicAddressNormalizer } from './converters';
import { GeographicAddressAdapter } from '../../../geographic-address/store/adapters';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmfGeographicAddressConfig),
  ],
  providers: [
    {
      provide: GeographicAddressAdapter,
      useClass: TmfGeographicAddressAdapter,
    },
    {
      provide: GEOGRAPHIC_ADDRESS_NORMALIZER,
      useExisting: TmfGeographicAddressNormalizer,
      multi: true,
    },
  ],
})
export class TmfGeographicAddressModule {}
