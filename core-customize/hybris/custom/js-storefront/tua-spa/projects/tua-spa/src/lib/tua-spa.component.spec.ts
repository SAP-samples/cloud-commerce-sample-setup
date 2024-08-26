// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TuaSpaComponent } from './tua-spa.component';

describe('TuaSpaComponent', () => {
  let component: TuaSpaComponent;
  let fixture: ComponentFixture<TuaSpaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TuaSpaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TuaSpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
