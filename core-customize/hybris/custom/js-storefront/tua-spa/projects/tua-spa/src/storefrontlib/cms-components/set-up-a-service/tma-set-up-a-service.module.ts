import { NgModule } from '@angular/core';
import { I18nModule, provideConfig, UrlModule } from '@spartacus/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SetUpAServiceComponent } from './tma-set-up-a-service.component';
import { ChecklistInstallationAddressModule } from '../journey-checklist';
import { TmaPurchaseReasonModule } from '../purchase-reason';
import { TmaConsumptionModule } from '../consumption';
import { FormErrorsModule, SpinnerModule } from '@spartacus/storefront';
import { NgSelectModule } from '@ng-select/ng-select';
import { TmaAddressFormModule } from '../address-form';
import { TmaTechnicalIdFormModule } from '../technical-id-form';
import { TmaCommodityProductDetailsComponent, TmaProductListCarouselComponent } from '../product';
import { RouterModule } from '@angular/router';
import { TmaCommodityServiceGuard } from '../../cms-structure';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    FormsModule,
    FormErrorsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ChecklistInstallationAddressModule,
    TmaPurchaseReasonModule,
    TmaAddressFormModule,
    TmaTechnicalIdFormModule,
    TmaConsumptionModule,
    UrlModule,
    RouterModule,
    SpinnerModule
  ],
  declarations: [SetUpAServiceComponent],
  exports: [SetUpAServiceComponent],
  providers: [
    TmaCommodityServiceGuard,
    provideConfig({
      cmsComponents: {
        SetUpAServiceComponent: {
          component: SetUpAServiceComponent,
          childRoutes: {
            parent: {
              data: {
                cxPageMeta: {
                  breadcrumb: 'setUpAService.breadcrumbs.getStarted',
                },
              },
            },
            children: [
              {
                path: 'plp',
                component: TmaProductListCarouselComponent,
                canActivate: [TmaCommodityServiceGuard],
                data: {
                  cxPageMeta: {
                    breadcrumb: 'setUpAService.breadcrumbs.selectPlan'
                  }
                },
                children: [
                  {
                    path: ':productCode',
                    component: TmaCommodityProductDetailsComponent,
                    canActivate: [TmaCommodityServiceGuard]
                  }
                ]
              }
            ],
          },
        }
      }
    })
  ]
})

export class SetUpAServiceModule {}
