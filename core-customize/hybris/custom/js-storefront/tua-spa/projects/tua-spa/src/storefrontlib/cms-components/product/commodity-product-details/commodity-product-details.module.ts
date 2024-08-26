import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule, UrlModule } from '@spartacus/core';
import { 
  CarouselModule,
  IconModule,
  MediaModule,
  OutletModule,
  PageComponentModule,
  ProductCarouselModule,
  ProductImagesModule,
  ProductIntroModule,
  TabParagraphContainerModule
} from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { TmaCommodityProductDetailsComponent } from './commodity-product-details.component';
import { TmaProductSummaryModule } from '../product-summary/tma-product-summary.module';
import { TmaAddToCartModule } from '../../cart';
import { TmaPriceDisplayModule } from '../price/price-display/tma-price-display.module';

@NgModule({
  imports: [
    PageComponentModule,
    OutletModule,
    CommonModule,
    I18nModule,
    CarouselModule,
    MediaModule,
    RouterModule,
    UrlModule,
    IconModule,
    TabParagraphContainerModule,
    ProductCarouselModule,
    ProductImagesModule,
    TmaProductSummaryModule,
    ProductIntroModule,
    TmaPriceDisplayModule,
    TmaAddToCartModule,
    ProductCarouselModule
  ],
  declarations: [TmaCommodityProductDetailsComponent],
  exports: [TmaCommodityProductDetailsComponent],
})
export class TmaCommodityProductDetailsModule {}
