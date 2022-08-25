import { NgModule } from '@angular/core';
import { asmTranslationChunksConfig, asmTranslations } from "@pwa-toolset/asm/assets";
import { AsmRootModule, ASM_FEATURE } from "@pwa-toolset/asm/root";
import { CmsConfig, I18nConfig, provideConfig } from "@pwa-toolset/core";

@NgModule({
  declarations: [],
  imports: [
    AsmRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [ASM_FEATURE]: {
        module: () =>
          import('@pwa-toolset/asm').then((m) => m.AsmModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: asmTranslations,
      chunks: asmTranslationChunksConfig,
    },
  })
  ]
})
export class AsmFeatureModule { }
