import { NgModule } from '@angular/core';
import { CmsConfig, provideConfig } from "@spartacus/core";
import { SmartEditConfig, SmartEditRootModule, SMART_EDIT_FEATURE } from "@spartacus/smartedit/root";

@NgModule({
  declarations: [],
  imports: [
    SmartEditRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [SMART_EDIT_FEATURE]: {
        module: () =>
          import('@spartacus/smartedit').then((m) => m.SmartEditModule),
      },
    }
  }),
  provideConfig(<SmartEditConfig>{
    smartEdit: {
      allowOrigin: 'localhost:9002, *.*.model-t.cc.commerce.ondemand.com:443',
    },
  })
  ]
})
export class SmartEditFeatureModule { }
