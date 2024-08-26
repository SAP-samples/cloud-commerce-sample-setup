// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { ProductOfferingService } from './facade/product-offering.service';
import { ProductOfferingStoreModule } from './store/product-offering-store.module';

@NgModule({
  imports: [ProductOfferingStoreModule]
})
export class ProductOfferingModule {
  static forRoot(): ModuleWithProviders<ProductOfferingModule> {
    return {
      ngModule: ProductOfferingModule,
      providers: [ProductOfferingService]
    };
  }
}
