// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { HttpParams } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { TmaDynamicTemplate } from '../../config/utils/tma-dynamic-template';
import { DEFAULT_SCOPE, TmfAppointmentEndpoint, TmfAppointmentEndpointMap } from '../tmf-appointment-models';
import { TmfAppointmentConfig } from '../config';

@Injectable({
  providedIn: 'root',
})
export class TmfAppointmentEndpointsService {
  protected readonly SLASH: string = '/';
  protected readonly QUESTION_MARK: string = '?';

  constructor(private config: TmfAppointmentConfig) {}

  /**
   * Returns base URL for provided endpoint.
   *
   * @param endpoint - The endpoint
   * @return The base endpoint as a {@link string}
   */
  getBaseEndpoint(endpoint?: string): string {
    if (
      !this.config ||
      !this.config.backend ||
      !this.config.backend.tmf_appointment
    ) {
      return '';
    }

    if (
      !endpoint ||
      !this.config.backend.tmf_appointment.endpoints ||
      !this.config.backend.tmf_appointment.endpoints[endpoint]
    ) {
      return (
        (this.config.backend.tmf_appointment.baseUrl || '') +
        this.config.backend.tmf_appointment.prefix
      );
    }

    return (
      (this.config.backend.tmf_appointment.endpoints[endpoint].baseUrl ||
        this.config.backend.tmf_appointment.baseUrl ||
        '') +
      (this.config.backend.tmf_appointment.endpoints[endpoint].prefix ||
        this.config.backend.tmf_appointment.prefix)
    );
  }

  /**
   * Returns an endpoint including baseUrl and baseSite
   *
   * @param endpoint - The endpoint
   * @return The endpoint including baseUrl and baseSite
   */
  getEndpoint(endpoint: string): string {
    const formattedEndpoint: string = !endpoint.startsWith(this.SLASH)
      ? this.SLASH + endpoint
      : endpoint;

    return this.getBaseEndpoint(endpoint) + formattedEndpoint;
  }

  /**
   * Returns a fully qualified URL
   *
   * @param endpoint - Name of the mock endpoint key config
   * @param urlParams - URL parameters
   * @param queryParams - Query parameters
   * @param scope - The scope of the url
   * @return The fully qualified URL as {@link string}
   */
  getUrl(
    endpoint: string,
    urlParams?: object,
    queryParams?: object,
    scope = ''
  ): string {
    endpoint = this.getEndpointForScope(endpoint, scope);

    endpoint = this.enhanceWithUrlParams(urlParams, endpoint);
    endpoint = this.enhanceWithQueryParams(queryParams, endpoint);

    return this.getEndpoint(endpoint);
  }

  protected enhanceWithUrlParams(urlParams: object, endpoint: string): string {
    if (!urlParams) {
      return endpoint;
    }
    Object.keys(urlParams).forEach(
      (key: string) => (urlParams[key] = encodeURIComponent(urlParams[key]))
    );

    return TmaDynamicTemplate.resolve(endpoint, urlParams);
  }

  protected enhanceWithQueryParams(
    queryParams: object,
    endpoint: string
  ): string {
    if (!queryParams) {
      return endpoint;
    }

    let httpParamsOptions;

    if (endpoint.includes(this.QUESTION_MARK)) {
      let queryParamsFromEndpoint;
      [endpoint, queryParamsFromEndpoint] = endpoint.split(this.QUESTION_MARK);

      httpParamsOptions = {
        ...httpParamsOptions,
        ...{ fromString: queryParamsFromEndpoint },
      };
    }

    let httpParams: HttpParams = new HttpParams(httpParamsOptions);
    httpParams = this.getHttpParams(queryParams, httpParams);

    const params: string = httpParams.toString();
    if (params.length) {
      endpoint += this.QUESTION_MARK + params;
    }

    return endpoint;
  }

  protected getEndpointForScope(endpoint: string, scope: string): string {
    const endpointsConfig: TmfAppointmentEndpointMap = this.config.backend
      .tmf_appointment.endpoints;
    const endpointConfig: TmfAppointmentEndpoint = endpointsConfig[endpoint];

    if (scope) {
      if (endpointConfig.endpoint[scope]) {
        return endpointConfig.endpoint[scope];
      }
      if (scope === DEFAULT_SCOPE && typeof endpointConfig === 'string') {
        return endpointConfig;
      }
      if (isDevMode()) {
        console.warn(
          `${endpoint} endpoint configuration missing for scope "${scope}"`
        );
      }
    }

    if (!endpointsConfig || !endpointsConfig[endpoint]) {
      return endpoint;
    }

    return (
      (typeof endpointConfig.endpoint === 'string'
        ? endpointConfig.endpoint
        : endpointConfig.endpoint[DEFAULT_SCOPE]) || endpoint
    );
  }

  protected getHttpParams(
    queryParams: object,
    httpParams: HttpParams
  ): HttpParams {
    Object.keys(queryParams).forEach((key: string) => {
      const value: string = queryParams[key];
      if (value === undefined) {
        return;
      }

      if (value === null) {
        httpParams = httpParams.delete(key);
      } else {
        httpParams = httpParams.set(key, value);
      }
    });
    return httpParams;
  }
}
