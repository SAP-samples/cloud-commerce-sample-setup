// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { DOCUMENT, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { Config, SERVER_REQUEST_URL } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { EXTERNAL_CONFIG_TRANSFER_ID } from '../../../tmf/config-loader';
import { tmaDeepMerge } from '../../utils/tma-deep-merge';
import { TmaConsumptionLoadedConfig } from './tma-consumption-loaded-config';
import { TmaConsumptionLoadedConfigConverter } from './tma-consumption-loaded-config-converter';
import { TmaConsumptionValuesConfigLoader } from './tma-consumption-values-config-loader';

@Injectable({ providedIn: 'root' })
export class TmaConsumptionConfigLoaderService {

  constructor(
    @Inject(PLATFORM_ID) protected platform: any,
    @Inject(DOCUMENT) protected document: any,
    @Inject(Config) protected config: any,
    protected consumptionValuesConfigLoader: TmaConsumptionValuesConfigLoader,
    protected converter: TmaConsumptionLoadedConfigConverter,
    @Optional() protected transferState: TransferState,
    @Optional()
    @Inject(SERVER_REQUEST_URL)
    protected serverRequestUrl?: string
  ) {
  }

  loadConfig(): Promise<TmaConsumptionLoadedConfig> {
    return this.get()
      .pipe(
        tap(externalConfig => this.transfer(externalConfig)),
        map(externalConfig =>
          tmaDeepMerge({}, ...this.getConfigChunks(externalConfig))
        )
      ).toPromise();
  }

  /**
   * Returns the external config
   */
  protected get(): Observable<TmaConsumptionLoadedConfig> {
    const rehydratedExternalConfig = this.rehydrate();

    return rehydratedExternalConfig
      ? of(rehydratedExternalConfig)
      : this.load();
  }

  /**
   * Tries to rehydrate external config in the browser from SSR
   */
  protected rehydrate(): TmaConsumptionLoadedConfig {
    return (this.transferState && isPlatformBrowser(this.platform)) ? this.transferState.get(EXTERNAL_CONFIG_TRANSFER_ID, undefined as any) : undefined;
  }

  /**
   * Loads the external config from backend
   */
  protected load(): Observable<TmaConsumptionLoadedConfig> {
    return this.consumptionValuesConfigLoader
      .load()
      .pipe(
        map(consumptionConfig =>
          this.converter.fromConsumptionConfig(consumptionConfig)
        )
      );
  }

  /**
   * Transfers the given external config in SSR to the browser
   *
   * @param externalConfig - The external configuration
   */
  protected transfer(externalConfig: TmaConsumptionLoadedConfig) {
    if (
      this.transferState &&
      isPlatformServer(this.platform) &&
      externalConfig
    ) {
      this.transferState.set(EXTERNAL_CONFIG_TRANSFER_ID, externalConfig as any);
    }
  }

  protected getConfigChunks(
    externalConfig: TmaConsumptionLoadedConfig
  ): (TmaConsumptionLoadedConfig)[] {
    return [this.converter.fromConsumptionConfig(externalConfig)];
  }
}
