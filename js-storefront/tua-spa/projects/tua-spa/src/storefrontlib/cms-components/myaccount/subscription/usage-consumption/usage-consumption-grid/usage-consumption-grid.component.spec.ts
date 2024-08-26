// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { I18nTestingModule } from '@spartacus/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UsageConsumptionService } from '../../../../../../core/subscription';
import { UsageConsumptionGridComponent } from './usage-consumption-grid.component';
import { RouterModule } from '@angular/router';
import { UsageConsumptionReport } from '../../../../../../core/model';

const mockUsageConsumption: UsageConsumptionReport = {
  bucket: [{
    bucketBalance: [{
      remainingValue: 20,
      remainingValueLabel: "it remains 20 minute",
      unit: "phone_minutes",
      validFor: {
        endDateTime: new Date("2016-01-01"),
        startDateTime: new Date("2016-01-01"),
      },
    }],
    bucketCounter: [{
      unit: "phone_minutes",
      validFor: {
        endDateTime: new Date("2016-01-01"),
        startDateTime: new Date("2016-01-01"),
      },
      value: 580,
      valueLabel: "580 minute used",
    }],
    id: "signature_Unlimited_Plan_voice_usage",
    name: "Usage for signatureUnlimitedPlan",
    product: {
      name: "signatureUnlimitedPlan",
    },
    usageType: "CURRENT",
  }],
};

class MockUsageConsumptionService {
  fetchUsageConsumption(): Observable<any> {
    return of(mockUsageConsumption);
  }
  clearUsageConsumptionDetails() {}
}

describe("UsageConsumptionGridComponent", () => {
  let component: UsageConsumptionGridComponent;
  let fixture: ComponentFixture<UsageConsumptionGridComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UsageConsumptionGridComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [I18nTestingModule, CommonModule, RouterModule.forRoot([])],
      providers: [
        {
          provide: UsageConsumptionService,
          useClass: MockUsageConsumptionService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageConsumptionGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    component.ngOnDestroy();
  });

  it("should be create", () => {
    expect(component).toBeTruthy();
  });
});
