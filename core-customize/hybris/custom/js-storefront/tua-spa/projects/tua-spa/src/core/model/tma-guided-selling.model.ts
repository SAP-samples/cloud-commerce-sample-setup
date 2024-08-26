// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfProductCharacteristic } from './tmf-product.model';

export interface TmaGuidedSellingStep {
  id: string;
  name: string;
  active: boolean;
  inProductGroup: boolean;
}

export enum TmaSelectionAction {
  ADD = 'add',
  REMOVE = 'remove',
  KEEP = 'keep'
}

export interface TmaGuidedSellingStepConfiguration {
  stepId: string;
  product: string;
  configSelections: TmfProductCharacteristic[];
}

export interface TmaConfigSelection {
  name: string;
  value: string;
}
