// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from '@spartacus/core';
import { GeographicAddressService, TmaPriceService, TmaProduct } from '../../../../core';
import { LaunchDialogService } from '@spartacus/storefront';

@Component({
  selector: 'cx-product-details-dialog',
  templateUrl: './product-details-dialog.component.html',
  styleUrls: ['./product-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsDialogComponent implements OnInit, OnDestroy {
  @Input()
  simpleProductOffering: TmaProduct;

  @Input()
  bundleProductOffering?: TmaProduct;

  childProductCodes: string[] = [];

  protected subscription = new Subscription();

  constructor(
    public productService: ProductService,
    public priceService: TmaPriceService,
    protected launchDialogService: LaunchDialogService,
    protected spinner?: NgxSpinnerService,
    protected geographicAddressService?: GeographicAddressService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.launchDialogService.data$.subscribe((data) => {
        if (data !== undefined) {
          this.simpleProductOffering = data.simpleProductOffering;
          this.bundleProductOffering = data.bundleProductOffering;
          if (this.bundleProductOffering) {
            this.getProductHierarchy(
              this.bundleProductOffering.code,
              this.simpleProductOffering.code
            );
          }
        }
      })
    );
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  closeModal(reason?: any) {
    this.launchDialogService.closeDialog(reason);
  }

  /**
   * Populate the product hierarchy in the ordered string array i.e rootProductCode has quadPlay
   * targetProductCode is fiber_internet the list is populated with [quadPlay, homeDeal, broadband,fiber_internet]
   *
   * @param rootProductCode Root product code
   *
   * @param targetProductCode Target product code
   */
  protected getProductHierarchy(
    rootProductCode: string,
    targetProductCode: string
  ): void {
    this.subscription.add(
      this.productService
        .get(rootProductCode)
        .pipe(
          take(2),
          filter((result: TmaProduct) => !!result)
        )
        .subscribe((result: TmaProduct) => {
          if (result) {
            const childCodes: string[] = result.children.map(child => child.code);
            if (!childCodes.includes(targetProductCode)) {
              this.childProductCodes.push(result.code);
              const childBundles: TmaProduct[] = result.children.filter(
                (child: TmaProduct) => child.isBundle
              );
              if (childBundles.length > 0) {
                result.children
                  .filter((child: TmaProduct) => child.isBundle)
                  .forEach((child: TmaProduct) => {
                    this.getProductHierarchy(child.code, targetProductCode);
                  });
              } else {
                this.childProductCodes.pop();
              }
            } else if (childCodes.includes(targetProductCode)) {
              this.childProductCodes.push(result.code);
              this.childProductCodes.push(targetProductCode);
            }
          }
        })
    );
  }
}
