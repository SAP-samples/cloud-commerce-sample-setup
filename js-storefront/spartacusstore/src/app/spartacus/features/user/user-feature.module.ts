import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from "@pwa-toolset/core";
import { userAccountTranslationChunksConfig, userAccountTranslations } from "@pwa-toolset/user/account/assets";
import { UserAccountRootModule, USER_ACCOUNT_FEATURE } from "@pwa-toolset/user/account/root";
import { userProfileTranslationChunksConfig, userProfileTranslations } from "@pwa-toolset/user/profile/assets";
import { UserProfileRootModule, USER_PROFILE_FEATURE } from "@pwa-toolset/user/profile/root";

@NgModule({
  declarations: [],
  imports: [
    UserAccountRootModule,
    UserProfileRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [USER_ACCOUNT_FEATURE]: {
        module: () =>
          import('@pwa-toolset/user/account').then((m) => m.UserAccountModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: userAccountTranslations,
      chunks: userAccountTranslationChunksConfig,
    },
  }),
  provideConfig(<CmsConfig>{
    featureModules: {
      [USER_PROFILE_FEATURE]: {
        module: () =>
          import('@pwa-toolset/user/profile').then((m) => m.UserProfileModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: userProfileTranslations,
      chunks: userProfileTranslationChunksConfig,
    },
  })
  ]
})
export class UserFeatureModule { }
