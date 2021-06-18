import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot([], {
      anchorScrolling: 'enabled',
      relativeLinkResolution: 'corrected',
      initialNavigation: 'enabled',
    })
  ]
})
export class AppRoutingModule { }
