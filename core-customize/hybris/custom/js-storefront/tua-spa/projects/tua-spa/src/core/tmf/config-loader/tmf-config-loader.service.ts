// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Inject, Injectable, isDevMode, Optional, PLATFORM_ID } from '@angular/core';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Config, I18nConfig, SERVER_REQUEST_URL, SiteContextConfig } from '@spartacus/core';
import { TmfSitesConfigLoader } from './tmf-site-config-loader';
import { TmfLoadedConfigConverter } from './tmf-loaded-config-converter';
import { map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TmfLoadedConfig } from './tmf-loaded-config';
import { tmaDeepMerge } from '../../config/utils/tma-deep-merge';

export const EXTERNAL_CONFIG_TRANSFER_ID: StateKey<string> = makeStateKey<string>('cx-external-config');

@Injectable({ providedIn: 'root' })
export class TmfConfigLoaderService {
  constructor(
    @Inject(PLATFORM_ID) protected platform: any,
    @Inject(DOCUMENT) protected document: any,
    @Inject(Config) protected config: any,
    protected sitesConfigLoader: TmfSitesConfigLoader,
    protected converter: TmfLoadedConfigConverter,
    @Optional() protected transferState: TransferState,
    @Optional()
    @Inject(SERVER_REQUEST_URL)
    protected serverRequestUrl?: string
  ) {
  }

  private get currentUrl(): string {
    if (isPlatformBrowser(this.platform)) {
      return this.document.location.href;
    }
    if (this.serverRequestUrl) {
      return this.serverRequestUrl;
    }
    if (isDevMode()) {
      console.error(
        `Please provide token 'SERVER_REQUEST_URL' with the requested URL for SSR`
      );
    }
    return '';
  }

  /**
   * Initializes the Spartacus config asynchronously basing on the external config
   */
  loadConfig(): Promise<I18nConfig | SiteContextConfig> {
    return this.get()
      .pipe(
        tap(externalConfig => this.transfer(externalConfig)),
        map(externalConfig =>
          tmaDeepMerge({}, ...this.getConfigChunks(externalConfig))
        )
      )
      .toPromise();
  }

  /**
   * Returns the external config
   */
  protected get(): Observable<TmfLoadedConfig> {
    const rehydratedExternalConfig = this.rehydrate();

    return rehydratedExternalConfig
      ? of(rehydratedExternalConfig)
      : this.load();
  }

  /**
   * Loads the external config from backend
   */
  protected load(): Observable<TmfLoadedConfig> {
    return this.sitesConfigLoader
      .load()
      .pipe(
        map(baseSites =>
          this.converter.fromTmfBaseSites(baseSites, this.currentUrl)
        )
      );
  }

  /**
   * Tries to rehydrate external config in the browser from SSR
   */
  protected rehydrate(): TmfLoadedConfig {
    if (this.transferState && isPlatformBrowser(this.platform)) {
      return this.transferState.get(EXTERNAL_CONFIG_TRANSFER_ID, undefined as any);
    }
    return undefined as any;
  }

  /**
   * Transfers the given external config in SSR to the browser
   */
  protected transfer(externalConfig: TmfLoadedConfig) {
    if (
      this.transferState &&
      isPlatformServer(this.platform) &&
      externalConfig
    ) {
      this.transferState.set(EXTERNAL_CONFIG_TRANSFER_ID, externalConfig as any);
    }
  }

  protected getConfigChunks(
    externalConfig: TmfLoadedConfig
  ): (I18nConfig | SiteContextConfig)[] {
    const chunks: any[] = [this.converter.toSiteContextConfig(externalConfig)];

    if (this.shouldReturnI18nChunk()) {
      chunks.push(this.converter.toI18nConfig(externalConfig));
    }

    return chunks;
  }

  private shouldReturnI18nChunk(): boolean {
    const fallbackLangExists =
      typeof (
        this.config &&
        this.config.i18n &&
        this.config.i18n.fallbackLang
      ) !== 'undefined';
    if (fallbackLangExists && isDevMode()) {
      console.warn(
        `There is an already provided static config for 'i18n.fallbackLang', so the value from TMF loaded config is ignored.`
      );
    }
    return !fallbackLangExists;
  }
}
