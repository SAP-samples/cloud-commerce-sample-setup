// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot([], {
    anchorScrolling: 'enabled',
    initialNavigation: 'enabledBlocking'
}),
  ],
})
export class AppRoutingModule {}
