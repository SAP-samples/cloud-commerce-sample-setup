// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { asmTranslationChunksConfig, asmTranslations } from '@spartacus/asm/assets';
import { ASM_FEATURE, AsmRootModule } from '@spartacus/asm/root';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';

@NgModule({
  imports: [AsmRootModule],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        [ASM_FEATURE]: {
          module: () => import('@spartacus/asm').then((m) => m.AsmModule),
        },
      },
    }),
    provideConfig(<I18nConfig>{
      i18n: {
        resources: asmTranslations,
        chunks: asmTranslationChunksConfig,
      },
    }),
  ],
})
export class TmaAsmFeatureModule {}
