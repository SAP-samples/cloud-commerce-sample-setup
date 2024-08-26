// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { HttpParams } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { TmaDynamicTemplate } from '../../config/utils/tma-dynamic-template';
import {
  QUERY_SERVICE_QUALIFICATION_DEFAULT_SCOPE,
  TmfQueryServiceQualificationEndpoint,
  TmfQueryServiceQualificationEndpointMap
} from '../tmf-query-service-qualification-models';
import { TmfQueryServiceQualificationConfig } from '../config';
import { LOCAL_STORAGE } from '../../util';

const { SLASH,QUESTION_MARK } = LOCAL_STORAGE.ENDPOINT;

@Injectable({
  providedIn: 'root'
})
export class TmfQueryServiceQualificationEndpointsService {

  constructor(private config: TmfQueryServiceQualificationConfig) {}

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
      !this.config.backend.tmf_query_service_qualification
    ) {
      return '';
    }

    if (
      !endpoint ||
      !this.config.backend.tmf_query_service_qualification.endpoints ||
      !this.config.backend.tmf_query_service_qualification.endpoints[endpoint]
    ) {
      return (
        (this.config.backend.tmf_query_service_qualification.baseUrl || '') +
        this.config.backend.tmf_query_service_qualification.prefix
      );
    }

    return (
      (this.config.backend.tmf_query_service_qualification.endpoints[endpoint]
        .baseUrl ||
        this.config.backend.tmf_query_service_qualification.baseUrl ||
        '') +
      (this.config.backend.tmf_query_service_qualification.endpoints[endpoint]
        .prefix || this.config.backend.tmf_query_service_qualification.prefix)
    );
  }

  /**
   * Returns an endpoint including baseUrl and baseSite
   *
   * @param endpoint - The endpoint
   * @return The endpoint including baseUrl and baseSite
   */
  getEndpoint(endpoint: string): string {
    const formattedEndpoint: string = !endpoint.startsWith(SLASH)
      ? SLASH + endpoint
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

    if (endpoint.includes(QUESTION_MARK)) {
      let queryParamsFromEndpoint;
      [endpoint, queryParamsFromEndpoint] = endpoint.split(QUESTION_MARK);

      httpParamsOptions = {
        ...httpParamsOptions,
        ...{ fromString: queryParamsFromEndpoint }
      };
    }

    let httpParams: HttpParams = new HttpParams(httpParamsOptions);
    httpParams = this.getHttpParams(queryParams, httpParams);

    const params: string = httpParams.toString();
    if (params.length) {
      endpoint += QUESTION_MARK + params;
    }

    return endpoint;
  }

  protected getEndpointForScope(endpoint: string, scope: string): string {
    const endpointsConfig: TmfQueryServiceQualificationEndpointMap = this.config
      .backend.tmf_query_service_qualification.endpoints;

    const endpointConfig: TmfQueryServiceQualificationEndpoint =
      endpointsConfig[endpoint];

    if (!scope) {
      if (!endpointsConfig || !endpointsConfig[endpoint]) {
        return endpoint;
      }
      return (
        (typeof endpointConfig.endpoint === 'string'
          ? endpointConfig.endpoint
          : endpointConfig.endpoint[QUERY_SERVICE_QUALIFICATION_DEFAULT_SCOPE]) ||
        endpoint
      );
    }
      if (endpointConfig.endpoint[scope]) {
        return endpointConfig.endpoint[scope];
      }
      if (
        scope === QUERY_SERVICE_QUALIFICATION_DEFAULT_SCOPE &&
        typeof endpointConfig === 'string'
      ) {
        return endpointConfig;
      }
      if (isDevMode()) {
        console.warn(
          `${endpoint} endpoint configuration missing for scope "${scope}"`
        );
      }
    return '';
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
