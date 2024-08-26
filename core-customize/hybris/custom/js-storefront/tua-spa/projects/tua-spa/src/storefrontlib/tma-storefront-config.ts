// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import {
  AnonymousConsentsConfig,
  AuthConfig,
  CmsConfig,
  ExternalRoutesConfig,
  GlobalMessageConfig,
  I18nConfig,
  OccConfig,
  RoutingConfig,
  SiteContextConfig,
  StateConfig
} from '@spartacus/core';
import { TmfConfig } from '../core/tmf/config/tmf-config';
import {
  DirectionConfig,
  IconConfig,
  LayoutConfig,
  MediaConfig,
  PaginationConfig,
  PWAModuleConfig,
  ViewConfig
} from '@spartacus/storefront';
import { TmfAppointmentConfig } from '../core/tmf-appointment';
import { TmfResourcePoolManagementConfig } from '../core/tmf-resource-pool-management';
import { SeoConfig } from '@spartacus/storefront/cms-structure/seo/config';
import { TmaBillingFrequencyConfig } from '../core/config/billing-frequency';
import { JourneyChecklistConfig } from '../core/config/journey-checklist-config';
import { TmfQueryServiceQualificationConfig } from '../core/tmf-service-qualification-management';
import { PersonalizationConfig } from '@spartacus/tracking/personalization/root';
import { QualtricsConfig } from '@spartacus/qualtrics/components';
import { CheckoutConfig } from '@spartacus/checkout/base/root';
import { CartConfig } from '@spartacus/cart/base/root';
import { AsmConfig } from '@spartacus/asm/root';

class SkipLinkConfig {}

export type TmaStorefrontConfig =
  | AnonymousConsentsConfig
  | AuthConfig
  | CmsConfig
  | OccConfig
  | TmfConfig
  | TmaBillingFrequencyConfig
  | QualtricsConfig
  | StateConfig
  | PWAModuleConfig
  | SiteContextConfig
  | LayoutConfig
  | RoutingConfig
  | I18nConfig
  | PersonalizationConfig
  | IconConfig
  | CheckoutConfig
  | GlobalMessageConfig
  | ExternalRoutesConfig
  | ViewConfig
  | AsmConfig
  | SkipLinkConfig
  | TmfAppointmentConfig
  | TmfResourcePoolManagementConfig
  | JourneyChecklistConfig
  | DirectionConfig
  | MediaConfig
  | PaginationConfig
  | CartConfig
  | SeoConfig
  | TmfQueryServiceQualificationConfig;
