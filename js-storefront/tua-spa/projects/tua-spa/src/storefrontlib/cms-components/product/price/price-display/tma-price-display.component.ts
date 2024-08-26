// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyService } from '@spartacus/core';
import { TmaPopChargeType, TmaPopRelationship, TmaPopRelationshipType, TmaProductOfferingPrice } from '../../../../../core/model';
import { TmaPriceService } from '../../../../../core/product/facade';

@Component({
  selector: 'cx-price-display',
  templateUrl: './tma-price-display.component.html',
  styleUrls: ['./tma-price-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaPriceDisplayComponent implements OnInit, OnChanges {

  @Input()
  price: TmaProductOfferingPrice;

  @Input()
  discounts?: TmaProductOfferingPrice[];

  list: TmaProductOfferingPrice[] = [];

  currency$: Observable<string>;

  relationships: TmaPopRelationship[] = [];

  pops: TmaProductOfferingPrice[] = [];

  constructor(
    public priceService: TmaPriceService,
    protected currencyService: CurrencyService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnChanges() {
    this.list = [];
    if (this.price) {
      this.list.push(this.price);
    }
  }

  ngOnInit() {
    this.getAllPopRelationshipsFrom(this.price, this.relationships);
    this.changeDetectorRef.detectChanges();
    if (this.price) {
      this.list.push(this.price);
    }
  }

  getSortedList(list: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    const newList: TmaProductOfferingPrice[] = [];
    const bundledPops = list.filter((price: TmaProductOfferingPrice) => price.bundledPop);
    const oneTimeCharges = list.filter((price: TmaProductOfferingPrice) => price.chargeType === TmaPopChargeType.ONE_TIME);
    const recurringCharges = list.filter((price: TmaProductOfferingPrice) => price.chargeType === TmaPopChargeType.RECURRING);
    const usageCharges = list.filter((price: TmaProductOfferingPrice) => price.chargeType === TmaPopChargeType.USAGE);
    const discountCharges = list.filter((price: TmaProductOfferingPrice) => price.chargeType === TmaPopChargeType.DISCOUNT);

    bundledPops.forEach((bundlePop: TmaProductOfferingPrice) => newList.push(bundlePop));

    oneTimeCharges.forEach((bundlePop: TmaProductOfferingPrice) => newList.push(bundlePop));
    recurringCharges.sort((a, b) => (Number(a.cycle.cycleStart) > Number(b.cycle.cycleStart)) ? 1 : -1);

    recurringCharges.forEach((bundlePop: TmaProductOfferingPrice) => newList.push(bundlePop));

    usageCharges.sort((x, y) =>
      x.unitOfMeasure > y.unitOfMeasure ? 1 : (x.unitOfMeasure === y.unitOfMeasure ?
        (Number(x.tierStart) > Number(y.tierStart) || x.tierStart === undefined ? 1 : -1) : -1));

    usageCharges.forEach((bundlePop: TmaProductOfferingPrice) => newList.push(bundlePop));


    discountCharges.forEach((bundlePop: TmaProductOfferingPrice) => newList.push(bundlePop));

    return newList;
  }

  checkForDiscountPopRelationship(): boolean {
    return this.relationships && this.relationships.some((relationship: TmaPopRelationship) => relationship.relationshipType === TmaPopRelationshipType.DISCOUNTED_BY);
  }

  getApplicableDiscounts(): TmaProductOfferingPrice[] {
    const relationshipIds =
      this.relationships
        .filter((popRelationship: TmaPopRelationship) => popRelationship.relationshipType === TmaPopRelationshipType.DISCOUNTED_BY)
        .map((popRelationship: TmaPopRelationship) => popRelationship.id);
    return this.discounts?.filter((discount: TmaProductOfferingPrice) => relationshipIds.indexOf(discount.id) !== -1);
  }

  /**
   * Returns an array containing all the discounts attached on a price
   *
   * @param price - The price of type {@link TmaProductOfferingPrice} for which the applicable discounts will be retrieved
   * @return An array of {@link TmaProductOfferingPrice}
   */
  getApplicableDiscountsForChild(price: TmaProductOfferingPrice): TmaProductOfferingPrice[] {
    const relationships: TmaPopRelationship[] = [];
    const relationshipIds = this.getAllPopRelationshipsFrom(price, relationships)
      .filter((popRelationship: TmaPopRelationship) => popRelationship.relationshipType === TmaPopRelationshipType.DISCOUNTED_BY)
      .map((popRelationship: TmaPopRelationship) => popRelationship.id);
    return this.discounts?.filter((discount: TmaProductOfferingPrice) => relationshipIds.indexOf(discount.id) !== -1);
  }

  /**
   * Returns an array containing all the {@link TmaPopRelationship} attached on a price
   *
   * @param price - The price of type {@link TmaProductOfferingPrice} for which the pop relationships will be retrieved
   * @param relationships - An array of {@link TmaPopRelationship}
   * @return An array of {@link TmaPopRelationship}
   */
  getAllPopRelationshipsFrom(price: TmaProductOfferingPrice, relationships: TmaPopRelationship[]): TmaPopRelationship[] {
    if (price.popRelationships) {
      price.popRelationships.forEach((relationship: TmaPopRelationship) => {
        relationships.push(relationship);
      });
    }
    if (price.bundledPop) {
      price.bundledPop.forEach((poPrice: TmaProductOfferingPrice) => {
        this.getAllPopRelationshipsFrom(poPrice, relationships);
      });
    }
    return relationships;
  }
}
