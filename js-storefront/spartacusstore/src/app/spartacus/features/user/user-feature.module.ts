import { NgModule } from '@angular/core';
import { provideConfig } from "@spartacus/core";
import { userAccountTranslationChunksConfig, userAccountTranslations } from "@spartacus/user/account/assets";
import { UserAccountRootModule } from "@spartacus/user/account/root";
import { userProfileTranslationChunksConfig, userProfileTranslations } from "@spartacus/user/profile/assets";
import { UserProfileRootModule } from "@spartacus/user/profile/root";

@NgModule({
  declarations: [],
  imports: [
    UserAccountRootModule,
    UserProfileRootModule
  ],
  providers: [provideConfig({
    featureModules: {
      userAccount: {
        module: () =>
          import('@spartacus/user/account').then((m) => m.UserAccountModule),
      },
    }
  }),
  provideConfig({
    i18n: {
      resources: userAccountTranslations,
      chunks: userAccountTranslationChunksConfig,
    },
  }),
  provideConfig({
    featureModules: {
      userProfile: {
        module: () =>
          import('@spartacus/user/profile').then((m) => m.UserProfileModule),
      },
    }
  }),
  provideConfig({
    i18n: {
      resources: userProfileTranslations,
      chunks: userProfileTranslationChunksConfig,
    },
  })
  ]
})
export class UserFeatureModule { }
