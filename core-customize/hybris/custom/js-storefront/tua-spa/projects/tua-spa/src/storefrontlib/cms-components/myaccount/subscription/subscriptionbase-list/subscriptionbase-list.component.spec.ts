// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, DebugElement, Input, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { SubscriptionBaseListComponent } from './subscriptionbase-list.component';
import { SubscriptionBaseService } from '../../../../../core/subscription/subscriptionbase/facade';
import { SubscriptionBase, SubscriptionBaseDetail } from '../../../../../core/model';
import { SubscriptionBaseDetailsService } from '../../../../../core/subscription/subscriptionbase-details/facade';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseSiteService, CmsConfig, I18nTestingModule, provideConfig, RoutingService } from '@spartacus/core';
import { USER_ACCOUNT_CORE_FEATURE, USER_ACCOUNT_FEATURE } from '@spartacus/user/account/root';

@Component({
  selector: 'cx-tmf-product',
  template: '',
})
class MockSubscribedProductComponent {
  @Input()
  subscriptionBaseId: string;
  @Input()
  baseSiteId: string;
  @Input()
  userId: string;
}
const baseSite = 'test-site';

const mockSubscriptionBases: SubscriptionBase[] = [
  {
    subscriberIdentity: 'tv_1',
    id: 'tv_1__IN',
  },
  {
    subscriberIdentity: 'internet_1',
    id: 'internet_1__IN',
  },
];

const mockSubscriptionBaseDetails: SubscriptionBaseDetail = {
  subscriptionBase: {
    id: '1040123444444',
  },
  user: {
    id: 'selfserviceuser4@hybris.com',
  },
};

class MockRoutingService {
  go() {}
}

class MockBaseSiteService {
  getActive(): Observable<string> {
    return of(baseSite);
  }
}

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

describe('SubscriptionBaseListComponent', () => {
  let component: SubscriptionBaseListComponent;
  let fixture: ComponentFixture<SubscriptionBaseListComponent>;
  let mockSubscriptionBaseService: SubscriptionBaseService;
  let mockSubscriptionBaseDetailService: SubscriptionBaseDetailsService;
  let el: DebugElement;

  beforeEach(waitForAsync(() => {
    mockSubscriptionBaseService = <SubscriptionBaseService>{
      getListOfSubscriptionBases(baseSiteId: string, userId: string) {
        return of(mockSubscriptionBases);
      },
      clearSubscriptionBaseList() {},
    };
    mockSubscriptionBaseDetailService = <SubscriptionBaseDetailsService>{
      getSubscriptionBaseDetails(subscriptionBaseId: string) {
        return of(mockSubscriptionBaseDetails);
      },
      clearSubscriptionBaseDetails() {},
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, I18nTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideConfig(<CmsConfig>{
          featureModules: {
            [USER_ACCOUNT_FEATURE]: {
              module: () =>
                import('@spartacus/user/account').then((m) => m.UserAccountModule),
            },
            [USER_ACCOUNT_CORE_FEATURE]: USER_ACCOUNT_FEATURE
          },
        }),
        {
          provide: SubscriptionBaseService,
          useValue: mockSubscriptionBaseService,
        },
        {
          provide: SubscriptionBaseDetailsService,
          useValue: mockSubscriptionBaseDetailService,
        },
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: BaseSiteService, useClass: MockBaseSiteService },
      ],
      declarations: [
        SubscriptionBaseListComponent,
        MockSubscribedProductComponent,
        MockUrlPipe,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionBaseListComponent);
    el = fixture.debugElement;

    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  afterEach(() => {
    fixture.destroy();
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
