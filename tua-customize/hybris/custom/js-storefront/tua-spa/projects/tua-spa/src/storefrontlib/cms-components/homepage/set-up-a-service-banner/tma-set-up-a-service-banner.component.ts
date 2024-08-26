import { Component } from '@angular/core';
import { CmsBannerComponent, RoutingService } from '@spartacus/core';
import { CmsComponentData, MediaService } from '@spartacus/storefront';

@Component({
  selector: 'cx-set-up-a-service-banner',
  templateUrl: './tma-set-up-a-service-banner.component.html',
  styleUrls: ['./tma-set-up-a-service-banner.component.scss'],
})
export class SetUpAServiceBannerComponent {

  public postalCode: string;

  constructor(
    public component: CmsComponentData<CmsBannerComponent>,
    public mediaService: MediaService,
    protected routingService: RoutingService
  ){}

  navigateTo () {
    this.routingService.go({ cxRoute: 'setUpAService' }, { queryParams: { postalCode: this.postalCode} });
  }
}
