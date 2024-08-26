// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { HttpParams } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { TmaDynamicTemplate } from '../../config/utils/tma-dynamic-template';
import { PremiseLookupConfig } from '../config';
import { PremiseLookupEndpoints } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PremiseLookupEndpointsService {

  protected readonly SCOPE_SUFFIX = '_scopes';

  constructor(
    private config: PremiseLookupConfig
  ) { }


  /**
   * Returns the base URL
   *
   * @returns URL string
   */
  getBaseEndpoint(): string {
    if (!this.config || !this.config.backend || !this.config.backend.premiseLookup) {
      return '';
    }

    return (
      (this.config.backend.premiseLookup.baseUrl || '') +
      this.config.backend.premiseLookup.prefix
    );
  }

  /**
   * Returns an PremiseLookup endpoint
   *
   * @param endpoint - Endpoint suffix
   * @return PremiseLookup endpoint string
   */
  getEndpoint(endpoint: string): string {
    return this.getBaseEndpoint() + endpoint;
  }

  /**
   * Returns a fully qualified PremiseLookup Url
   *
   * @param endpoint - Name of the PremiseLookup endpoint key config
   * @param urlParams -  URL parameters
   * @param queryParams - Query parameters
   * @param scope - The scope of the url
   * @return PremiseLookup URL string
   */
  getUrl(
    endpoint: string,
    urlParam?: object,
    queryParams?: object,
    scope = ''
  ): string {
    endpoint = this.getEndpointForScope(endpoint, scope);

    if (urlParam) {
      Object.keys(urlParam).forEach((key: string) =>
        urlParam[key] = encodeURIComponent(urlParam[key])
      );
      endpoint = TmaDynamicTemplate.resolve(endpoint, urlParam);
    }

    if (queryParams) {
      let httpParamsOptions: object;

      if (endpoint.includes('?')) {
        let queryParamsFromEndpoint: string;
        [endpoint, queryParamsFromEndpoint] = endpoint.split('?');

        httpParamsOptions = { fromString: queryParamsFromEndpoint };
      }

      let httpParams = new HttpParams(httpParamsOptions);
      Object.keys(queryParams).forEach((key: string) => {
        const value = queryParams[key];
        if (value !== undefined) {
          if (value === null) {
            httpParams = httpParams.delete(key);
          } else {
            httpParams = httpParams.set(key, value);
          }
        }
      });

      const params: string = httpParams.toString();
      if (params.length) {
        endpoint += '?' + params;
      }
    }

    return this.getEndpoint(endpoint);
  }

  private getEndpointForScope(endpoint: string, scope: string): string {
    const endpointsConfig: PremiseLookupEndpoints =
      this.config.backend &&
      this.config.backend.premiseLookup &&
      this.config.backend.premiseLookup.endpoints;

    if (scope) {
      const endpointConfig: object = endpointsConfig[`${endpoint}${this.SCOPE_SUFFIX}`];
      if (endpointConfig && endpointConfig[scope]) {
        return endpointConfig[scope];
      }
      if (isDevMode()) {
        console.warn(
          `${endpoint} endpoint configuration missing for scope "${scope}"`
        );
      }
    }

    return endpointsConfig[endpoint] || endpoint;
  }
}
