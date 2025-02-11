import { NgModule } from '@angular/core';
import { provideConfig } from "@spartacus/core";
import { AepModule } from "@spartacus/tracking/tms/aep";
import { BaseTmsModule, TmsConfig } from "@spartacus/tracking/tms/core";
import { GtmModule } from "@spartacus/tracking/tms/gtm";

@NgModule({
  declarations: [],
  imports: [
    BaseTmsModule.forRoot(),
    GtmModule,
    AepModule
  ],
  providers: [provideConfig(<TmsConfig>{
    tagManager: {
      gtm: {
        events: [],
      },
    },
  }),
  provideConfig(<TmsConfig>{
    tagManager: {
      aep: {
        events: [],
      },
    },
  })
  ]
})
export class TagManagementFeatureModule { }
