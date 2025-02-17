import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from "@spartacus/core";
import { organizationUserRegistrationTranslationChunksConfig, organizationUserRegistrationTranslationsEn } from "@spartacus/organization/user-registration/assets";
import { ORGANIZATION_USER_REGISTRATION_FEATURE, OrganizationUserRegistrationRootModule } from "@spartacus/organization/user-registration/root";

@NgModule({
  declarations: [],
  imports: [
    OrganizationUserRegistrationRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [ORGANIZATION_USER_REGISTRATION_FEATURE]: {
        module: () =>
          import('@spartacus/organization/user-registration').then((m) => m.OrganizationUserRegistrationModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: { en: organizationUserRegistrationTranslationsEn },
      chunks: organizationUserRegistrationTranslationChunksConfig,
    },
  })
  ]
})
export class OrganizationUserRegistrationFeatureModule { }
