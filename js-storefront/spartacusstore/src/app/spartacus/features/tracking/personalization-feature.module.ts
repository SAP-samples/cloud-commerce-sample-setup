import { NgModule } from '@angular/core';
import { CmsConfig, provideConfig } from "@pwa-toolset/core";
import { PersonalizationRootModule, PERSONALIZATION_FEATURE } from "@pwa-toolset/tracking/personalization/root";

@NgModule({
  declarations: [],
  imports: [
    PersonalizationRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [PERSONALIZATION_FEATURE]: {
        module: () =>
          import('@pwa-toolset/tracking/personalization').then((m) => m.PersonalizationModule),
      },
    }
  })]
})
export class PersonalizationFeatureModule { }
