// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { TmaProductOfferingTerm } from '../../../public-api';
import { SpiProduct, SpiProductPrice } from '../../model/spi-product.model';
import { TmaMoney, TmaPopBillingEventType } from '../../model/tma-product.model';
import { TmaPriceService } from '../../product/facade/tma-price-service';
import { LOCAL_STORAGE } from '../../util/constants';

const { PERCENTAGE_DIVISOR } = LOCAL_STORAGE.DECIMAL;

@Injectable({
  providedIn: 'root'
})
export class TmaSubscriptionPriceService {

  constructor(
    protected priceService: TmaPriceService
  ) { }

  /**
   * Returns the average price of a subscription depending on subscription duration,
   * recurring and one time prices and the alterations of the price
   *
   * @param tmaSubscription The current subscription
   * @returns An average subscription price/month
   */
  public getCostPerMonth(spiProduct: SpiProduct): string {
    const monthlyChargePriceList = this.getMonthlyPrices(spiProduct.productPrice);
    const payNowChargePriceList = this.getPayNowPrices(spiProduct.productPrice);
    const contractDuration = this.getContractTermDuration(spiProduct.productTerm);
    const priceAlterationsList: SpiProductPrice[] = this.getPriceAlterations(spiProduct.productPrice);

    const amount: TmaMoney = {
      value: '-',
      currencyIso: '-'
    };
    let averageCost = 0;
    let payNowChargeValue = 0;
    let recurringChargeValue = 0;

    payNowChargePriceList.forEach((priceItem: SpiProductPrice) => {
      const payNowValue = this.getSpiPayNowPriceAlteration(priceAlterationsList, +priceItem.price.taxIncludedAmount.value);
      payNowChargeValue += payNowValue;
    });

    monthlyChargePriceList.forEach((priceItem: SpiProductPrice) => {
      const monthlyValue = this.getSpiMonthlyPriceAlteration(priceAlterationsList, +priceItem.price.taxIncludedAmount.value, contractDuration);
      recurringChargeValue += monthlyValue;
    });

    averageCost = (payNowChargeValue / contractDuration) + (recurringChargeValue / contractDuration);
    amount.value = averageCost.toFixed(2).toString();

    return this.priceService.getFormattedPrice(amount);
  }

  /**
   * Returns all alterations for a product price
   *
   * @param prices A list of all all product prices alterations and details
   * @returns All alterations
   */
  protected getPriceAlterations(prices: SpiProductPrice[]): SpiProductPrice[] {
    if (!prices || prices.length === 0) {
      return [];
    }
    let priceAlterationList: SpiProductPrice[] = [];

    prices.forEach((productPrice: SpiProductPrice) => {
      if (productPrice.productPriceAlteration) {
        priceAlterationList = priceAlterationList.concat(productPrice.productPriceAlteration);
      }

    });

    return priceAlterationList;
  }

  /**
   * Returns the price after all alterations are made, these alterations include discounts
   * and allowances
   *
   * @param productAlteration An array of the alterations that will apply on a price
   * @param value The initial total price of the TmaSubscription
   * @param chargePeriod The charge period of the TmaSubscription
   * @returns Final price of the subscription
   */
  protected getSpiMonthlyPriceAlteration(productAlteration: SpiProductPrice[], value: number, contractDuration?: number): number {
    if (!productAlteration || productAlteration.length === 0) {
      return value * contractDuration;
    }

    const monthlyValue = value;
    let alterationDuration = 0;
    const discountedPeriodAlteratedPrices: number[] = [];

    productAlteration.forEach((productAlterationItem: SpiProductPrice) => {
      if (value <= 0) {
        return 0;
      }

      if (productAlterationItem.recurringChargePeriod === TmaPopBillingEventType.MONTHLY) {
        {
          const itemAlterationDuration = this.getAlterationDuration(productAlterationItem, contractDuration);
          if (productAlterationItem.price.percentage) {

            value -= value * (productAlterationItem.price.percentage / 100);

          }
          else {
            value -= +productAlterationItem.price.taxIncludedAmount.value;
          }
          discountedPeriodAlteratedPrices.push(value * itemAlterationDuration);
          alterationDuration += itemAlterationDuration;
        }
      }
    });

    let tempPrice = 0;
    discountedPeriodAlteratedPrices.forEach((alteredPriceItem: number) => {
      tempPrice += alteredPriceItem;
    });
    tempPrice += monthlyValue * (contractDuration - alterationDuration);

    return value > 0 ? tempPrice : 0;
  }

  /**
   * Returns the pay now price that will be used for the average price of the product
   *
   * @param productAlteration List of all product alterations
   * @param value Price of all pay now prices of the product
   * @returns Altered pay now price
   */
  protected getSpiPayNowPriceAlteration(productAlteration: SpiProductPrice[], value: number): number {
    if (!productAlteration || productAlteration.length === 0) {
      return value;
    }

    let alteredValue = value;
    productAlteration.forEach((productAlterationItem: SpiProductPrice) => {
      if (alteredValue <= 0) {
        return;
      }
      if (productAlterationItem.recurringChargePeriod === TmaPopBillingEventType.PAY_NOW) {
        if (productAlterationItem.price.percentage) {
          alteredValue -= alteredValue * (productAlterationItem.price.percentage / PERCENTAGE_DIVISOR);
        }
        else {
          alteredValue -= +productAlterationItem.price.taxIncludedAmount.value;
        }
      }
    });

    return alteredValue > 0 ? alteredValue : 0;
  }

  /**
   * Returns all pay-now charge period prices
   *
   * @param priceList List of all the prices of the product
   * @returns All pay-now prices
   */
  protected getPayNowPrices(priceList: SpiProductPrice[]): SpiProductPrice[] {
    return priceList && priceList.length !== 0 ?
      priceList.filter((onePrice: SpiProductPrice) => onePrice.recurringChargePeriod === TmaPopBillingEventType.PAY_NOW) : [];
  }

  /**
   * Returns all recurrent monthly charge period prices
   *
   * @param priceList  List of all the prices of the product
   * @returns All monthly prices
   */
  protected getMonthlyPrices(priceList: SpiProductPrice[]): SpiProductPrice[] {
    return priceList && priceList.length !== 0 ?
      priceList.filter((onePrice: SpiProductPrice) => onePrice.recurringChargePeriod === TmaPopBillingEventType.MONTHLY) : [];
  }

  /**
   * Returns contract's length in months
   *
   * @param term Offering terms of the product
   * @returns Contract length in months
   */
  protected getContractTermDuration(term: TmaProductOfferingTerm[]): number {
    if (!term) {
      return 1;
    }

    let duration = 1;

    term.forEach((singleTerm)=> {
      const currentDuration: number = +singleTerm.name.split('_')[0];
      if (currentDuration > duration)
      {
        duration = currentDuration;
      }
    });

    return duration;
  }

  /**
   * The duration in months of a specific alteration
   *
   * @param priceAlteration A single price alteration
   * @param contractDuration Number of months of the contract duration
   * @returns Period of the alteration
   */
  protected getAlterationDuration(priceAlteration: SpiProductPrice, contractDuration: number): number {
    if (!priceAlteration.applicationDuration) {
      return contractDuration;
    }
    return priceAlteration.applicationDuration;
  }

}
