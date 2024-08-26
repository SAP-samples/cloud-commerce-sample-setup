// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ProductOfferingQualificationService } from './facade';

@NgModule({
  imports: []
})
export class ProductOfferingQualificationModule {
  static forRoot(): ModuleWithProviders<ProductOfferingQualificationModule> {
    return {
      ngModule: ProductOfferingQualificationModule,
      providers: [ProductOfferingQualificationService]
    };
  }
}
