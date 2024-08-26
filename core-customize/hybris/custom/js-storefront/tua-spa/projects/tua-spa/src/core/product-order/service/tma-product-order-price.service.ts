// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import {
  TmaOrderItem,
  TmaOrderPrice,
  TmaPriceAlteration,
  TmaPriceType,
  TmaProductOrder,
  TmaRecurringChargePeriod
} from '../../model';

@Injectable({
  providedIn: 'root'
})
export class TmaProductOrderPriceService {

  /**
   * Calculates the total price for an Order Item while ignoring the discounts that might be applied
   * @param orderItem The Order Item for which the price is calculated
   */
  public getPayOnCheckoutBeforeDiscountsDutyFree(orderItem: TmaOrderItem): number {

    const result: number = orderItem.quantity *
      orderItem.itemPrice
        ?.map<number>((itemPrice: TmaOrderPrice) => this.calculatePayNowOrderPriceRecursivelyBeforeDiscountsDutyFree(itemPrice))
        .reduce((previousValue: number, currentValue: number) => previousValue + currentValue);

    return (result) ? result : 0;
  }

  /**
   * Calculates the total price for an Order Item while applying the discounts
   * @param orderItem The Order Item for which the price is calculated
   */
  public getPayOnCheckoutAfterDiscountsDutyFree(orderItem: TmaOrderItem): number {

    const result: number = orderItem.quantity *
      orderItem.itemPrice
        ?.map<number>((itemPrice: TmaOrderItem) => this.calculatePayNowOrderPriceRecursivelyAfterDiscountsDutyFree(itemPrice))
        .reduce((previousValue: number, currentValue: number) => previousValue + currentValue);

    return (result) ? result : 0;
  }

  /**
   * Calculates the total price after taxes for an Order Item while applying the discounts
   * @param orderItem The Order Item for which the price is calculated
   */
  public getPayOnCheckoutAfterDiscountsAfterTaxes(orderItem: TmaOrderItem): number {

    const result: number = orderItem.quantity *
      orderItem.itemPrice
        ?.map<number>((itemPrice: TmaOrderItem) => this.calculatePayNowOrderPriceRecursivelyAfterDiscountsAfterTaxes(itemPrice))
        .reduce((previousValue: number, currentValue: number) => previousValue + currentValue);

    return (result) ? result : 0;
  }

  /**
   * Calculates the total prices from all the Order Items while applying the discounts
   * @param productOrder The Product Order for which the price is calculated
   */
  public getSubtotalAfterDiscountsDutyFree(productOrder: TmaProductOrder): number {

    return (productOrder.orderItem)
      ? productOrder.orderItem
        .map<number>((orderItem: TmaOrderItem) => this.getPayOnCheckoutAfterDiscountsDutyFree(orderItem))
        .reduce((previousValue: number, currentValue: number) => previousValue + currentValue)
      : 0;
  }

  /**
   * Calculates the total prices after taxes from all the Order Items while applying the discounts
   * @param productOrder The Product Order for which the price is calculated
   */
  public getSubtotalAfterDiscountsAfterTaxes(productOrder: TmaProductOrder): number {

    return (productOrder.orderItem)
      ? productOrder.orderItem
        .map<number>((orderItem: TmaOrderItem) => this.getPayOnCheckoutAfterDiscountsAfterTaxes(orderItem))
        .reduce((previousValue: number, currentValue: number) => previousValue + currentValue)
      : 0;
  }

  /**
   * Calculates the shipping cost for a Product Order
   * @param productOrder The Product Order for which the price is calculated
   */
  public getShippingCostDutyFree(productOrder: TmaProductOrder): number {

    const result: number = (productOrder.orderCost)
      ? productOrder.orderCost
        .map<number>((orderCost: TmaOrderPrice) => (orderCost.orderPrice)
          ? orderCost.orderPrice.map<number>(
            (orderPrice: TmaOrderPrice) => this.calculateShippingCostRecursivelyAfterDiscountsDutyFree(orderPrice))
            .reduce((previousValue: number, currentValue: number) => previousValue + currentValue)
          : 0)
        .reduce((previousValue: number, currentValue: number) => previousValue + currentValue)
      : 0;

    return (result) ? result : 0;
  }

  /**
   * Calculates the shipping cost after taxes for a Product Order
   * @param productOrder The Product Order for which the price is calculated
   */
  public getShippingCostAfterTaxes(productOrder: TmaProductOrder): number {

    const result: number = (productOrder.orderCost)
      ? productOrder.orderCost
        .map<number>((orderCost: TmaOrderPrice) => (orderCost.orderPrice)
          ? orderCost.orderPrice.map<number>(
            (orderPrice: TmaOrderPrice) => this.calculateShippingCostRecursivelyAfterDiscountsAfterTaxes(orderPrice))
            .reduce((previousValue: number, currentValue: number) => previousValue + currentValue)
          : 0)
        .reduce((previousValue: number, currentValue: number) => previousValue + currentValue)
      : 0;

    return (result) ? result : 0;
  }

  protected calculatePayNowOrderPriceRecursivelyBeforeDiscountsDutyFree(orderPrice: TmaOrderPrice): number {
    const childrenPricesSum: number = orderPrice.orderPrice
      ?.map<number>((price: TmaOrderPrice) => this.calculatePayNowOrderPriceRecursivelyBeforeDiscountsDutyFree(price))
      .reduce((previousValue: number, currentValue: number) => previousValue + currentValue);

    return ((orderPrice?.recurringChargePeriod === TmaRecurringChargePeriod.PAY_NOW) ?
      parseFloat(orderPrice?.price?.dutyFreeAmount?.value) : 0) +
      ((childrenPricesSum) ? childrenPricesSum : 0);
  }

  protected calculatePayNowOrderPriceRecursivelyAfterDiscountsDutyFree(orderPrice: TmaOrderPrice): number {
    const childrenPricesSum: number = orderPrice.orderPrice
      ?.map<number>((price: TmaOrderPrice) => this.calculatePayNowOrderPriceRecursivelyAfterDiscountsDutyFree(price))
      .reduce((previousValue: number, currentValue: number) => previousValue + currentValue);

    let result: number = ((orderPrice?.recurringChargePeriod === TmaRecurringChargePeriod.PAY_NOW) ?
      parseFloat(orderPrice?.price?.dutyFreeAmount?.value) :
      0) +
      ((childrenPricesSum) ? childrenPricesSum : 0);

    if (orderPrice.priceAlteration) {

      orderPrice.priceAlteration.forEach((priceAlteration: TmaPriceAlteration) => {

        if (priceAlteration?.priceType === TmaPriceType.DISCOUNT_PRICE_ALTERATION) {

          if (priceAlteration.price && priceAlteration.price.dutyFreeAmount) {
            result -= parseFloat(priceAlteration.price.dutyFreeAmount.value);
          }

          if (priceAlteration.price && priceAlteration.price.percentage) {
            result -= (result * (priceAlteration.price.percentage / 100));
          }
        }
      });
    }

    return result;
  }

  protected calculatePayNowOrderPriceRecursivelyAfterDiscountsAfterTaxes(orderPrice: TmaOrderPrice): number {
    const childrenPricesSum: number = orderPrice.orderPrice
      ?.map<number>((price: TmaOrderPrice) => this.calculatePayNowOrderPriceRecursivelyAfterDiscountsAfterTaxes(price))
      .reduce((previousValue: number, currentValue: number) => previousValue + currentValue);

    let result: number = ((orderPrice?.recurringChargePeriod === TmaRecurringChargePeriod.PAY_NOW) ?
      parseFloat(orderPrice?.price?.taxIncludedAmount?.value) :
      0) +
      ((childrenPricesSum) ? childrenPricesSum : 0);

    if (orderPrice.priceAlteration) {

      orderPrice.priceAlteration.forEach((priceAlteration: TmaPriceAlteration) => {

        if (priceAlteration?.priceType === TmaPriceType.DISCOUNT_PRICE_ALTERATION) {

          if (priceAlteration.price && priceAlteration.price.taxIncludedAmount) {
            result -= parseFloat(priceAlteration.price.taxIncludedAmount.value);
          }

          if (priceAlteration.price && priceAlteration.price.percentage) {
            result -= (result * (priceAlteration.price.percentage / 100));
          }
        }
      });
    }

    return result;
  }

  protected calculateOrderPriceRecursivelyAfterDiscountsDutyFree(orderPrice: TmaOrderPrice): number {
    const childrenPricesSum: number = orderPrice.orderPrice
      ?.map<number>((price: TmaOrderPrice) => this.calculateOrderPriceRecursivelyAfterDiscountsDutyFree(price))
      .reduce((previousValue: number, currentValue: number) => previousValue + currentValue);

    const dutyFreeValue: number = (orderPrice.price && orderPrice.price.dutyFreeAmount)
      ? parseFloat(orderPrice?.price?.dutyFreeAmount?.value) : 0;

    let result: number = dutyFreeValue + ((childrenPricesSum) ? childrenPricesSum : 0);

    if (orderPrice.priceAlteration) {

      orderPrice.priceAlteration.forEach((priceAlteration: TmaPriceAlteration) => {

        if (priceAlteration?.priceType === TmaPriceType.DISCOUNT_PRICE_ALTERATION) {

          if (priceAlteration.price && priceAlteration.price.dutyFreeAmount) {
            result -= parseFloat(priceAlteration.price.dutyFreeAmount.value);
          }

          if (priceAlteration.price && priceAlteration.price.percentage) {
            result -= (result * (priceAlteration.price.percentage / 100));
          }
        }
      });
    }

    return result;
  }

  protected calculateShippingCostRecursivelyAfterDiscountsDutyFree(orderPrice: TmaOrderPrice): number {
    const childrenPricesSum: number = orderPrice.orderPrice
      ?.map<number>((price: TmaOrderPrice) => this.calculateShippingCostRecursivelyAfterDiscountsDutyFree(price))
      .reduce((previousValue: number, currentValue: number) => previousValue + currentValue);

    let result: number = ((orderPrice?.priceType === TmaPriceType.DELIVERY_COST)
      ? parseFloat(orderPrice?.price?.dutyFreeAmount?.value) : 0)
      + ((childrenPricesSum) ? childrenPricesSum : 0);

    if (orderPrice.priceAlteration) {

      orderPrice.priceAlteration
        .forEach((priceAlteration: TmaPriceAlteration) => {

          if (priceAlteration?.priceType === TmaPriceType.DISCOUNT_PRICE_ALTERATION) {

            if (priceAlteration.price && priceAlteration.price.dutyFreeAmount) {
              result -= parseFloat(priceAlteration.price.dutyFreeAmount.value);
            }

            if (priceAlteration.price && priceAlteration.price.percentage) {
              result -= (result * (priceAlteration.price.percentage / 100));
            }
          }
        });
    }

    return result;
  }

  protected calculateShippingCostRecursivelyAfterDiscountsAfterTaxes(orderPrice: TmaOrderPrice): number {
    const childrenPricesSum: number = orderPrice.orderPrice
      ?.map<number>((price: TmaOrderPrice) => this.calculateShippingCostRecursivelyAfterDiscountsAfterTaxes(price))
      .reduce((previousValue: number, currentValue: number) => previousValue + currentValue);

    let result: number = ((orderPrice?.priceType === TmaPriceType.DELIVERY_COST)
      ? parseFloat(orderPrice?.price?.taxIncludedAmount?.value) : 0)
      + ((childrenPricesSum) ? childrenPricesSum : 0);

    if (orderPrice.priceAlteration) {

      orderPrice.priceAlteration
        .forEach((priceAlteration: TmaPriceAlteration) => {

          if (priceAlteration?.priceType === TmaPriceType.DISCOUNT_PRICE_ALTERATION) {

            if (priceAlteration.price && priceAlteration.price.taxIncludedAmount) {
              result -= parseFloat(priceAlteration.price.taxIncludedAmount.value);
            }

            if (priceAlteration.price && priceAlteration.price.percentage) {
              result -= (result * (priceAlteration.price.percentage / 100));
            }
          }
        });
    }

    return result;
  }

}
