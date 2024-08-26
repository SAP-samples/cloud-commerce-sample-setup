// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { HttpParams } from '@angular/common/http';
import { Injectable, isDevMode, Optional } from '@angular/core';
import { BaseSiteService } from '@spartacus/core';
import { TmaDynamicTemplate } from '../../config/utils/tma-dynamic-template';
import { TmfResourcePoolManagementConfig } from '../config';
import {
  RESOURCE_POOL_MANAGEMENT_DEFAULT_SCOPE,
  TmfResourcePoolManagementEndpoint,
  TmfResourcePoolManagementEndpointMap
} from '../tmf-resource-pool-management-models';

@Injectable({
  providedIn: 'root'
})
export class TmfResourcePoolManagementEndpointsService {
  protected readonly SLASH: string = '/';
  protected readonly QUESTION_MARK: string = '?';

  constructor(
    private config: TmfResourcePoolManagementConfig,
    @Optional() private baseSiteService: BaseSiteService
  ) {
  }

  /**
   * Returns base URL for provided endpoint.
   *
   * @param endpoint - The endpoint
   * @return The base endpoint as {@link string}
   */
  getBaseEndpoint(endpoint?: string): string {
    if (
      !this.config ||
      !this.config.backend ||
      !this.config.backend.tmf_resource_pool_management
    ) {
      return '';
    }

    if (
      !endpoint ||
      !this.config.backend.tmf_resource_pool_management.endpoints ||
      !this.config.backend.tmf_resource_pool_management.endpoints[endpoint]
    ) {
      return (
        (this.config.backend.tmf_resource_pool_management.baseUrl || '') +
        this.config.backend.tmf_resource_pool_management.prefix
      );
    }

    return (
      (this.config.backend.tmf_resource_pool_management.endpoints[endpoint]
          .baseUrl ||
        this.config.backend.tmf_resource_pool_management.baseUrl ||
        '') +
      (this.config.backend.tmf_resource_pool_management.endpoints[endpoint]
        .prefix || this.config.backend.tmf_resource_pool_management.prefix)
    );
  }

  /**
   * Returns an endpoint including baseUrl and baseSite
   *
   * @param endpoint - The endpoint
   * @return The endpoint including baseUrl and baseSite as {@link string}
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
   * @param endpoint - Name of the tmf_resource_pool_management endpoint key config
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

  /**
   * To enhance the URL with url params
   *
   * @param endpoint - Name of the tmf_resource_pool_management endpoint key config
   * @param urlParams - URL parameters
   * @return The fully qualified URL as {@link string}
   */
  protected enhanceWithUrlParams(urlParams: object, endpoint: string): string {
    if (!urlParams) {
      return endpoint;
    }
    Object.keys(urlParams).forEach(
      (key: string) => (urlParams[key] = encodeURIComponent(urlParams[key]))
    );
    return TmaDynamicTemplate.resolve(endpoint, urlParams);
  }

  /**
   * To enhance the URL with query params
   *
   * @param endpoint - Name of the tmf_resource_pool_management endpoint key config
   * @param queryParams - Query parameters
   * @return The fully qualified URL as  {@link string}
   */
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
        ...{ fromString: queryParamsFromEndpoint }
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

  /**
   * To enhance given endpoint with scope
   *
   * @param endpoint - Name of the tmf_resource_pool_management endpoint key config
   * @param scope - The scope of the url
   * @return The fully qualified URL as {@link string}
   */
  protected getEndpointForScope(endpoint: string, scope: string): string {
    const endpointsConfig: TmfResourcePoolManagementEndpointMap = this.config
      .backend.tmf_resource_pool_management.endpoints;
    const endpointConfig: TmfResourcePoolManagementEndpoint =
      endpointsConfig[endpoint];

    if (scope) {
      if (endpointConfig.endpoint[scope]) {
        return endpointConfig.endpoint[scope];
      }
      if (
        scope === RESOURCE_POOL_MANAGEMENT_DEFAULT_SCOPE &&
        typeof endpointConfig === 'string'
      ) {
        return endpointConfig;
      }
      if (isDevMode()) {
        console.warn(
          `${ endpoint } endpoint configuration missing for scope "${ scope }"`
        );
      }
    }

    if (!endpointsConfig || !endpointsConfig[endpoint]) {
      return endpoint;
    }
    return (
      (typeof endpointConfig.endpoint === 'string'
        ? endpointConfig.endpoint
        : endpointConfig.endpoint[RESOURCE_POOL_MANAGEMENT_DEFAULT_SCOPE]) ||
      endpoint
    );
  }

  /**
   * To enhance the http parameters with a given query parameters
   *
   * @param queryParams - Query parameters to be updated in the end point Url
   * @param httpParams -  Http parameters already associated with end point Url
   * @return Updated http params as {@link HttpParams}
   */
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
      }
      else {
        httpParams = httpParams.set(key, value);
      }
    });
    return httpParams;
  }
}
