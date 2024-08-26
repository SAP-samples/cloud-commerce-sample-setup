// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { LayoutConfig } from '@spartacus/storefront';

export const tmaB2cLayoutConfig: LayoutConfig = {
  layoutSlots: {
    LandingPage2Template: {
      pageFold: 'Section2B',
      slots: [
        'Section1',
        'Section2',
        'Section2A',
        'Section2B',
        'Section2C',
        'Section3',
        'Section4',
        'Section5',
      ],
    },
    GuidedSellingPageTemplate: {
      slots: ['GuidedSellingContentSlot']
    },
    ProductListCarouselPageTemplate: {
      slots: ['ProductListCarouselContentSlot']
    },
    SelfcarePageTemplate: {
      slots: ['BodyContent', 'SideContent']
    },
    SetUpAServicePageTemplate: {
      slots: ['SetUpAServiceContentSlot']
    },
    SwitchProviderPageTemplate: {
      slots: ['SwitchProviderContentSlot']
    },
    CartPageTemplate: {
      slots: [
        'TopContent',
        'CenterRightContentSlot',
        'EmptyCartMiddleContent',
        'BottomContentSlot'
      ]
    }
  }
};
