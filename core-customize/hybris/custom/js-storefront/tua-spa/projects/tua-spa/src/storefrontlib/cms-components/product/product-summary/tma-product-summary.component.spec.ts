// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CmsService, CurrencyService, I18nTestingModule } from '@spartacus/core';
import {
  CurrentProductService,
  IntersectionOptions,
  ItemCounterModule,
  ProductSummaryComponent,
  SpinnerModule
} from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import { TmaBillingFrequencyConfig } from '../../../../core/config/billing-frequency/config';
import { TmaConsumptionConfig } from '../../../../core/config/consumption/config';
import { TmaProduct } from '../../../../core/model';
import { TmaPriceService, TmaProductService } from '../../../../core/product/facade';
import { TmaPriceModule } from '../price';
import { TmaProductSummaryComponent } from './tma-product-summary.component';
import { TmaPriceDisplayModule } from '../price/price-display/tma-price-display.module';
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AddToCartModule } from '@spartacus/cart/base/components/add-to-cart';

class MockCurrentProductService {
  getProduct(): Observable<TmaProduct> {
    return of();
  }
}

class MockTmaPriceService {
}

class MockTmaProductSpecificationProductService {
}

class MockCmsService {
}

class MockModalService {
}

class MockCurrencyService {
}

class MockActivatedRoute {
}

@Directive({
  selector: '[cxOutlet]',
})
class MockOutletDirective {
 @Input() cxOutlet: string;
 @Input() cxOutletContext: any;
 @Input() cxOutletDefer: IntersectionOptions;
 @Output() loaded: EventEmitter<Boolean> = new EventEmitter<Boolean>(true);
}

describe('TmaProductSummaryComponent in product', () => {
  let productSummaryComponent: TmaProductSummaryComponent;
  let fixture: ComponentFixture<TmaProductSummaryComponent>;
  let mockConsumptionConfig: TmaConsumptionConfig;
  let mockBillingFrequencyConfig: TmaBillingFrequencyConfig;

  beforeEach(waitForAsync(() => {
    mockConsumptionConfig = {
      consumption: {
        defaultValues: [
          { productSpecification: 'electricity', usageUnit: 'kwh', value: '1000' },
          { productSpecification: 'gas', usageUnit: 'cubic_meter', value: '1200' }
        ],
        default: '1000'
      }
    };

    mockBillingFrequencyConfig = {
      billingFrequency: [
        {
          key: 'yearly',
          value: 12
        }
      ]
    };

    TestBed.configureTestingModule({
      imports: [SpinnerModule, AddToCartModule, ItemCounterModule, I18nTestingModule, TmaPriceModule, TmaPriceDisplayModule, RouterTestingModule ],
      declarations: [TmaProductSummaryComponent, ProductSummaryComponent, MockOutletDirective],
      providers: [
        {
          provide: CurrentProductService,
          useClass: MockCurrentProductService
        },
        {
          provide: TmaProductService,
          useClass: MockTmaProductSpecificationProductService
        },
        {
          provide: TmaPriceService,
          useClass: MockTmaPriceService
        },
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },
        {
          provide: CmsService,
          useClass: MockCmsService
        },
        {
          provide: TmaConsumptionConfig,
          useValue: mockConsumptionConfig
        },
        {
          provide: CurrencyService,
          useClass: MockCurrencyService
        },
        {
          provide: TmaBillingFrequencyConfig,
          useValue: mockBillingFrequencyConfig
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmaProductSummaryComponent);
    productSummaryComponent = fixture.componentInstance;
  });
});
