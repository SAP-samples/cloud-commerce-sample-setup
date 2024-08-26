// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { HttpParams } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { TmfConfig } from '../config/tmf-config';
import { TmaDynamicTemplate } from '../../config/utils/tma-dynamic-template';
import { TMF_DEFAULT_SCOPE, TmfEndpoint, TmfEndpointMap } from '../tmf-models';
import { LOCAL_STORAGE } from '../../util';

const { SLASH, QUESTION_MARK } = LOCAL_STORAGE.COMMON;

@Injectable({
  providedIn: 'root',
})
export class TmfEndpointsService {

  constructor(private config: TmfConfig) {}

  /**
   * Gets base URL for provided endpoint.
   * For example: For a given endpoint key as " getUsageConsumptionReports"
   * so outpult will be retrieved as  "http://localhost:9002/occ/v2".
   *
   * @param endpointKey - The key to get endpoint
   * @return The base endpoint as a {@link string}
   */
  getBaseEndpoint(endpointKey?: string): string {
    if (!this.config || !this.config.backend || !this.config.backend.tmf) {
      return '';
    }
    if (
      this.config.backend.tmf.endpoints[endpointKey] &&
      this.config.backend.tmf.endpoints[endpointKey].baseUrl &&
      this.config.backend.tmf.endpoints[endpointKey].prefix &&
      this.config.backend.tmf.endpoints[endpointKey].version
    ) {
      return (
        this.config.backend.tmf.endpoints[endpointKey].baseUrl +
        this.config.backend.tmf.endpoints[endpointKey].prefix +
        this.config.backend.tmf.endpoints[endpointKey].version
      );
    }
    return (
      this.config.backend.tmf.baseUrl +
      this.config.backend.tmf.prefix +
      this.config.backend.tmf.version
    );
  }

  /**
   * Gets base URL for provided endpoint.
   *
   * @return The base endpoint with default version as a {@link string}
   */
  getBaseEndpointWithDefaultVersion(): string {
    return this.config.backend.tmf.baseUrl + this.config.backend.tmf.prefix;
  }

  /**
   * Gets base URL for provided endpoint.
   *
   * @return The base endpoint with default version as a {@link string}
   */
   getBaseEndpointListWithDefaultVersion(): string[] {
    const tmfEndPoints: string[] = Object.values(
      this.config.backend.tmf.endpoints
    )
      .filter((endPoint: TmfEndpoint) => endPoint.prefix !== undefined)
      .map((endPoint: TmfEndpoint) => endPoint.baseUrl + endPoint.prefix);
    return tmfEndPoints.concat(
      this.config.backend.tmf.baseUrl + this.config.backend.tmf.prefix
    );
  }


  /**
   * Gets an endpoint including baseUrl and baseSite
   *
   * @param endpoint - The endpoint
   * @param endpointKey - The key to get endpoint
   * @return The endpoint including baseUrl and baseSite
   */
  getEndpoint(endpoint: string, endpointKey?: string): string {
    const formattedEndpoint: string = !endpoint.startsWith(SLASH)
      ? SLASH + endpoint
      : endpoint;

    return this.getBaseEndpoint(endpointKey) + formattedEndpoint;
  }

  /**
   * Gets a fully qualified URL
   *
   * @param endpointKey - Name of the endpoint key config
   * @param urlParams - URL parameters
   * @param queryParams - Query parameters
   * @param scope - The scope of the url
   * @return The fully qualified URL as {@link string}
   */
  getUrl(
    endpointKey: string,
    urlParams?: object,
    queryParams?: object,
    scope = ''
  ): string {
    let endpoint = this.getEndpointForScope(endpointKey, scope);
    endpoint = this.enhanceWithUrlParams(urlParams, endpoint);
    endpoint = this.enhanceWithQueryParams(queryParams, endpoint);
    return this.getEndpoint(endpoint, endpointKey);
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
        ...{ fromString: queryParamsFromEndpoint },
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
    const endpointsConfig: TmfEndpointMap = this.config.backend.tmf.endpoints;
    const endpointConfig: TmfEndpoint = endpointsConfig[endpoint];

    if (scope) {
      if (endpointConfig.endpoint[scope]) {
        return endpointConfig.endpoint[scope];
      }
      if (scope === TMF_DEFAULT_SCOPE && typeof endpointConfig === 'string') {
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
        : endpointConfig.endpoint[TMF_DEFAULT_SCOPE]) || endpoint
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
