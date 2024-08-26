// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaConsumptionValue, TmaSliderOption } from '../../../model';

export abstract class TmaConsumptionConfig {
  consumption?: {
    defaultValues: TmaConsumptionValue[];
    default: TmaSliderOption;
  };
}

declare module '@spartacus/core' {
  interface Config extends TmaConsumptionConfig {}
}
