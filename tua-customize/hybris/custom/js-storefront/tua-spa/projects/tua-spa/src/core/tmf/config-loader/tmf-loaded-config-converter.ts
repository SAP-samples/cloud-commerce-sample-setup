// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import {
  BASE_SITE_CONTEXT_ID,
  BaseSite,
  CURRENCY_CONTEXT_ID,
  I18nConfig,
  JavaRegExpConverter,
  LANGUAGE_CONTEXT_ID,
  SiteContextConfig
} from '@spartacus/core';
import { TmfLoadedConfig } from './tmf-loaded-config';
import { Tmf } from '../tmf-models/tmf.models';

@Injectable({ providedIn: 'root' })
export class TmfLoadedConfigConverter {
  constructor(private javaRegExpConverter: JavaRegExpConverter) {
  }

  fromTmfBaseSites(baseSites: BaseSite[], currentUrl: string): TmfLoadedConfig {
    const baseSite = baseSites.find(site =>
      this.isCurrentBaseSite(site, currentUrl)
    );
    if (!baseSite) {
      throw this.getError(
        `Current url (${currentUrl}) doesn't match with any of url patterns of any base site.`
      );
    }

    // Although `stores` property is an array, typically there is only one store. So we return the first store from the list.
    const baseStore = baseSite.stores && baseSite.stores[0];
    if (!baseStore) {
      throw this.getError(
        `Current base site (${baseSite.uid}) doesn't have any base store.`
      );
    }

    return {
      baseSite: baseSite.uid,
      languages: this.getIsoCodes(
        baseStore.languages,
        baseSite.defaultLanguage || baseStore.defaultLanguage
      ),
      currencies: this.getIsoCodes(
        baseStore.currencies,
        baseStore.defaultCurrency
      ),
      urlParameters: this.getUrlParams(baseSite.urlEncodingAttributes),
    };
  }

  toSiteContextConfig(
    {
      baseSite,
      languages,
      currencies,
      urlParameters: urlEncodingAttributes,
    }: TmfLoadedConfig): SiteContextConfig {
    return {
      context: {
        urlParameters: urlEncodingAttributes,
        [BASE_SITE_CONTEXT_ID]: [baseSite],
        [LANGUAGE_CONTEXT_ID]: languages,
        [CURRENCY_CONTEXT_ID]: currencies,
      },
    };
  }

  toI18nConfig({ languages }: TmfLoadedConfig): I18nConfig {
    return { i18n: { fallbackLang: languages[0] } };
  }

  private isCurrentBaseSite(site: Tmf.BaseSite, currentUrl: string): boolean {
    const index = (site.urlPatterns || []).findIndex(javaRegexp => {
      const jsRegexp = this.javaRegExpConverter.toJsRegExp(javaRegexp);
      if (jsRegexp) {
        return jsRegexp.test(currentUrl);
      }
      return false;
    });

    return index !== -1;
  }

  /**
   * Returns an array of url encoded site context parameters.
   *
   * It maps the string "storefront" (used in Tmf) to the "baseSite" (used in Spartacus)
   */
  private getUrlParams(params: string[]): string[] {
    const STOREFRONT_PARAM = 'storefront';

    return (params || []).map(param =>
      param === STOREFRONT_PARAM ? BASE_SITE_CONTEXT_ID : param
    );
  }

  /**
   * Returns iso codes in a array, where the first element is the default iso code.
   */
  private getIsoCodes(
    elements: { isocode?: string }[],
    defaultElement: { isocode?: string }
  ) {
    return this.moveToFirst(
      elements,
      el => el.isocode === defaultElement.isocode
    ).map(el => el.isocode);
  }

  /**
   * Moves to the start of the array the first element that satisfies the given predicate.
   *
   * @param array array to modify
   * @param predicate function called on elements
   */
  private moveToFirst(array: any[], predicate: (el: any) => boolean): any[] {
    array = [...array];
    const index = array.findIndex(predicate);
    if (index !== -1) {
      const [el] = array.splice(index, 1);
      array.unshift(el);
    }
    return array;
  }

  private getError(message: string): Error {
    return new Error(`Error: Cannot get base site config! ${message}`);
  }
}
