// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('app-root .content span')).getText() as Promise<string>;
  }
}
