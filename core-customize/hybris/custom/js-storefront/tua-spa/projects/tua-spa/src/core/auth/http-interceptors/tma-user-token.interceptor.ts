// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthStorageService, ClientTokenService } from '@spartacus/core';
import { TmfEndpointsService } from '../../tmf/services/tmf-endpoints.service';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TmaUserTokenInterceptor implements HttpInterceptor {
  constructor(
    private authStorageService: AuthStorageService,
    private tmfEndpoints: TmfEndpointsService,
    protected clientTokenService: ClientTokenService
  ) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authStorageService.getToken().pipe(
      take(1),
      switchMap(token => {
        if (
          token && token.token_type && token.access_token &&
          (this.isTmfUrl(request.url)) &&
          !request.headers.get('Authorization')
        ) {
          request = request.clone({
            setHeaders: {
              Authorization: `${token.token_type} ${token.access_token}`,
            },
          });
        }

        return next.handle(request);
      })
    );
  }

  protected isTmfUrl(url: string): boolean {
    return this.tmfEndpoints
      .getBaseEndpointListWithDefaultVersion()
      .some((item) => url.includes(item));
  }
}
