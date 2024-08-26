// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaTechnicalResource } from '../../model';

/**
 * Converter constant for converting {@link any} into {@link TmaTechnicalResource}
 */
export const TMA_TECHNICAL_RESOURCE_NORMALIZER = new InjectionToken<Converter<any, TmaTechnicalResource>>('TmaTechnicalResourceNormalizer');
