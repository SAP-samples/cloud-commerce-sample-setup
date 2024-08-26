// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TestBed } from '@angular/core/testing';

import { TuaSpaService } from './tua-spa.service';

describe('TuaSpaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TuaSpaService = TestBed.inject(TuaSpaService);
    expect(service).toBeTruthy();
  });
});
