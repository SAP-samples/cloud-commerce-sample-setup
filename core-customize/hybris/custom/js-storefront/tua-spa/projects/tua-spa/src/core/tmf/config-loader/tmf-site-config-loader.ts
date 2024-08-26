// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { TmfConfig } from '../config/tmf-config';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Tmf } from '../tmf-models/tmf.models';
import { map } from 'rxjs/operators';
import { BaseSite } from '@spartacus/core';

@Injectable({ providedIn: 'root' })
export class TmfSitesConfigLoader {
  constructor(protected config: TmfConfig, protected http: HttpClient) {
  }

  protected readonly endpoint = '';

  private get baseEndpoint(): string {
    return (
      (this.config.backend.tmf.baseUrl || '') + this.config.backend.tmf.prefix
    );
  }

  private get url(): string {
    return `${this.baseEndpoint}${this.endpoint}`;
  }

  load(): Observable<BaseSite[]> {
    if (!this.config || !this.config.backend || !this.config.backend.tmf) {
      return throwError(new Error(`Missing config for TMF backend!`));
    }

    return this.http
      .get<Tmf.BaseSites>(this.url)
      .pipe(map(({ baseSites }) => baseSites));
  }
}
