// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

export abstract class TmaProductSpecificationAverageCostConfig {
    productSpecificationAverageCost?: string[];
}
declare module '@spartacus/core' {
  interface Config extends TmaProductSpecificationAverageCostConfig {}
}
