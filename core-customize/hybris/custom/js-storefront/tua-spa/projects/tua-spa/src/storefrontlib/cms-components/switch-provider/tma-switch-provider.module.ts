import { NgModule } from '@angular/core';
import { I18nModule, provideConfig, UrlModule } from '@spartacus/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChecklistInstallationAddressModule } from '../journey-checklist';
import { TmaPurchaseReasonModule } from '../purchase-reason';
import { TmaConsumptionModule } from '../consumption';
import { FormErrorsModule } from '@spartacus/storefront';
import { NgSelectModule } from '@ng-select/ng-select';
import { TmaAddressFormModule } from '../address-form';
import { TmaTechnicalIdFormModule } from '../technical-id-form';
import { TmaCommodityProductDetailsComponent, TmaProductListCarouselComponent } from '../product';
import { RouterModule } from '@angular/router';
import { TmaCommodityServiceGuard } from '../../cms-structure';
import { SetUpAServiceComponent } from '../set-up-a-service';

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
  ],
  providers: [
    TmaCommodityServiceGuard,
    provideConfig({
      cmsComponents: {
        SwitchProviderComponent: {
          component: SetUpAServiceComponent,
          childRoutes: {
            parent: {
              data: {
                cxPageMeta: {
                  breadcrumb: 'switchProvider.breadcrumbs.switchProvider',
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
                    breadcrumb: 'switchProvider.breadcrumbs.selectPlan'
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

export class SwitchProviderModule {}
