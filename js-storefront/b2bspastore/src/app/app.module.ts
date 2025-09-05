import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay, withNoHttpTransferCache } from '@angular/platform-browser';

import { provideHttpClient, withFetch, withInterceptorsFromDi } from "@angular/common/http";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { AppRoutingModule } from "@spartacus/storefront";
import { AppComponent } from './app.component';
import { SpartacusModule } from './spartacus/spartacus.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({}),
    AppRoutingModule,
    EffectsModule.forRoot([]),
    SpartacusModule
  ],
  providers: [provideHttpClient(withFetch(), withInterceptorsFromDi()), provideClientHydration(withEventReplay(), withNoHttpTransferCache())],
  bootstrap: [AppComponent]
})
export class AppModule { }
