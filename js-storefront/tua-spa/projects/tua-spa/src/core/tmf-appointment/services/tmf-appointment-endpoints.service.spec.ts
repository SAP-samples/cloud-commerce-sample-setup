// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TestBed } from '@angular/core/testing';
import { TmfAppointmentEndpointsService } from '.';
import { Type } from '@angular/core';
import { TmfAppointmentConfig } from '../config';
import { LOCAL_STORAGE } from '../../../../../../core/util/constants';

const { TEST_VALUE } = LOCAL_STORAGE.TEST_VALUES;

describe('TmfAppointmentEndpointsService', () => {
  let appointmentConfig: TmfAppointmentConfig;
  const baseEndpoint = 'test-baseUrl/test-occPrefix';
  const baseEndpoint1 = 'test-baseUrl1/test-occPrefix1';

  let service: TmfAppointmentEndpointsService;

  beforeEach(() => {
    appointmentConfig = {
      backend: {
        tmf_appointment: {
          baseUrl: 'test-baseUrl',
          prefix: '/test-occPrefix',
          endpoints: {
            testEndpoint1: {
              baseUrl: 'test-baseUrl1',
              prefix: '/test-occPrefix1',
              endpoint: 'testEndpoint1',
            },
            testEndpoint2: {
              baseUrl: 'test-baseUrl2',
              prefix: '/test-occPrefix2',
              endpoint: 'testEndpoint2',
            },
            testEndpoint3: {
              endpoint: {
                default: 'configured-endpoint1/${test}?fields=abc',
                test: 'configured-endpoint1/${test}?fields=test',
              },
            },
          },
        },
      },
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: TmfAppointmentConfig, useValue: appointmentConfig },
      ],
    });
    service = TestBed.inject(
      TmfAppointmentEndpointsService as Type<TmfAppointmentEndpointsService>
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return base endpoint', () => {
    expect(service.getBaseEndpoint()).toEqual(baseEndpoint);
  });

  it('defined endpoint - should return base endpoint 1 + added endpoint', () => {
    expect(service.getEndpoint('testEndpoint1')).toEqual(
      baseEndpoint1 + '/testEndpoint1'
    );
  });

  it('not defined endpoint - should return base endpoint + added endpoint', () => {
    expect(service.getEndpoint('testEndpoint')).toEqual(
      baseEndpoint + '/testEndpoint'
    );
  });

  it('should return base endpoint + added endpoint', () => {
    expect(service.getEndpoint('testEndpoint1')).toEqual(
      baseEndpoint1 + '/testEndpoint1'
    );
  });

  describe('getUrl', () => {
    it('should return endpoint from config', () => {
      const url = service.getUrl('testEndpoint3');

      expect(url).toEqual(
        baseEndpoint + '/configured-endpoint1/${test}?fields=abc'
      );
    });

    describe('using scope', () => {
      it('should return endpoint from config', () => {
        const url = service.getUrl(
          'testEndpoint3',
          undefined,
          undefined,
          'test'
        );

        expect(url).toEqual(
          baseEndpoint + '/configured-endpoint1/${test}?fields=test'
        );
      });

      it('should fallback to default scope', () => {
        const url = service.getUrl(
          'testEndpoint3',
          undefined,
          undefined,
          'test-non-existing'
        );

        expect(url).toEqual(
          baseEndpoint + '/configured-endpoint1/${test}?fields=abc'
        );
      });

      it('should apply parameters to configured endpoint', () => {
        const url = service.getUrl('testEndpoint3', { test: [TEST_VALUE] });
        expect(url).toEqual(
          baseEndpoint + '/configured-endpoint1/test-value?fields=abc'
        );
      });

      it('should add query parameters to configured endpoint', () => {
        const url = service.getUrl(
          'testEndpoint3',
          { test: [TEST_VALUE] },
          { param: 'test-param' }
        );

        expect(url).toEqual(
          baseEndpoint +
            '/configured-endpoint1/test-value?fields=abc&param=test-param'
        );
      });

      it('should allow to redefine preconfigured query parameters', () => {
        const url = service.getUrl(
          'testEndpoint3',
          { test: [TEST_VALUE] },
          { fields: 'xyz' }
        );

        expect(url).toEqual(
          baseEndpoint + '/configured-endpoint1/test-value?fields=xyz'
        );
      });

      it('should allow to remove preconfigured query parameters', () => {
        const url = service.getUrl(
          'testEndpoint3',
          { test: [TEST_VALUE] },
          { fields: null }
        );

        expect(url).toEqual(baseEndpoint + '/configured-endpoint1/test-value');
      });

      it('should escape special characters passed in url params', () => {
        const url = service.getUrl(
          'testEndpoint3',
          { test: 'ąćę$%' },
          { fields: null }
        );

        expect(url).toEqual(
          baseEndpoint + '/configured-endpoint1/%C4%85%C4%87%C4%99%24%25'
        );
      });

      it('should escape query parameters', () => {
        const url = service.getUrl(
          'testEndpoint3',
          { test: [TEST_VALUE] },
          { fields: '+./.\\.,.?' }
        );

        expect(url).toEqual(
          baseEndpoint + '/configured-endpoint1/test-value?fields=%2B./.%5C.,.?'
        );
      });
    });
  });
});
