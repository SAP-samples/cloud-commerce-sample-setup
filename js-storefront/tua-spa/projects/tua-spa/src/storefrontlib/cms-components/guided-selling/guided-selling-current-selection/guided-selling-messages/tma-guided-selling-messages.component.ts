// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved
import { Component, Input } from '@angular/core';
import { ICON_TYPE } from '@spartacus/storefront';
import { TmaQualificationMessage } from '../../../../../core';

@Component({
  selector: 'cx-guided-selling-messages',
  templateUrl: './tma-guided-selling-messages.component.html',
  styleUrls: ['./tma-guided-selling-messages.component.scss']
})

export class TmaGuidedSellingMessagesComponent {
  iconTypes = ICON_TYPE;
  @Input() qualificationErrorMessages: TmaQualificationMessage[];
  @Input() showQualificationErrorMessages: boolean;
  @Input() qualificationSuccessMessage: boolean;
}
