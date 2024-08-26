// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable, OnDestroy } from '@angular/core';
import {
  TmaBillingTimeType,
  TmaCart,
  TmaCartItemPrice,
  TmaCartPrice,
  TmaCartTotalPrice,
  TmaChargeType,
  TmaOrder,
  TmaOrderEntry,
  TmaPriceType,
  TmaRecurringChargePeriod
} from '../../model';
import { Price, TranslationService } from '@spartacus/core';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { LOCAL_STORAGE } from '../../util';
import { Tmf } from '../../tmf';

const {
  RANGE
} = LOCAL_STORAGE.DECIMAL;

@Injectable({
  providedIn: 'root'
})
export class TmaCartPriceService implements OnDestroy {

  protected cartItemPrice: TmaCartItemPrice = {} as TmaCartItemPrice;
  protected cartTotalPrice: TmaCartTotalPrice = {} as TmaCartTotalPrice;
  protected price: Price = {} as Price;
  protected allPrices: TmaCartPrice[] = [];
  protected subscription = new Subscription();

  private payOnCheckoutPrice: number;
  private payOnCheckoutDiscount: number;
  private discountedPayOnCheckoutPrice: number;

  constructor(
    protected translationService: TranslationService
  ) {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Returns an object that contains the prices (pay on checkout, recurring, usage charges, one time charges which are not pay now) of a cart entry.
   *
   * @param item - the cart entry
   * @return A {@link TmaCartItemPrice} containing the prices for the entry
   */
  computeEntryPrice(item: TmaOrderEntry): TmaCartItemPrice {
    const PARENT_ID = 'parentId';
    this.cartItemPrice.recurringPrices = [];
    this.cartItemPrice.usageChargePrices = [];
    this.cartItemPrice.oneTimeChargePrices = [];
    this.payOnCheckoutPrice = 0;
    this.payOnCheckoutDiscount = 0;
    this.discountedPayOnCheckoutPrice = 0;
    this.allPrices = [];
    if (item.cartPrice && item.cartPrice.cartPrice) {
      this.flattenPriceTreeWithDiscount(item.cartPrice, null, []);
    }
    this.computeEntryPriceTypes(this.allPrices, '');
    this.cartItemPrice.recurringPrices.sort((a, b) => (Number(a.cycle.cycleStart) > Number(b.cycle.cycleStart)) ? 1 : -1);
    this.cartItemPrice.oneTimeChargePrices.sort((a, b) => (a.recurringChargePeriod < b.recurringChargePeriod) ? 1 : -1);
    const sortedUsageChargePrices = this.cartItemPrice.usageChargePrices;
    sortedUsageChargePrices.sort((x, y) => {
      const isUnitMeasureEqual = x.unitOfMeasure === y.unitOfMeasure;
      let unitMeasureComparison: number;
      if (isUnitMeasureEqual) {
        unitMeasureComparison = x.unitOfMeasure > y.unitOfMeasure ? 1 : 0;
      }
      else {
        unitMeasureComparison = x.unitOfMeasure > y.unitOfMeasure ? 1 : -1;
      }
      const tierStartComparison = Number(x.tierStart) > Number(y.tierStart) || x.tierStart === undefined ? 1 : -1;
      return unitMeasureComparison === 0 ? tierStartComparison : unitMeasureComparison;
    });

    this.cartItemPrice.usageChargePrices = this.groupBy(sortedUsageChargePrices, PARENT_ID);


    this.cartItemPrice.payOnCheckoutPrice = Number((this.payOnCheckoutPrice * item.quantity + this.discountedPayOnCheckoutPrice).toFixed(RANGE));
    this.cartItemPrice.payOnCheckoutDiscount = this.payOnCheckoutDiscount * item.quantity;
    return this.cartItemPrice;
  }

  /**
   * Returns the cart/order subtotal price.
   *
   * @param cart - the cart or order object
   * @return The subtotal price of the cart
   */
  computeSubTotalCartPrice(cart: TmaCart | TmaOrder): number {
    let payOnCheckoutSubTotal = 0;

    if (!cart.entries) {
      return Number(payOnCheckoutSubTotal.toFixed(RANGE));
    }

    cart.entries.forEach((entry: TmaOrderEntry) =>
      payOnCheckoutSubTotal += this.computeCartEntryPrice(entry.cartPrice.cartPrice, entry.quantity)
    );

    return Number(payOnCheckoutSubTotal.toFixed(RANGE));
  }

  /**
   * Returns an object that contains the cart/order price (subtotal, total, delivery cost).
   *
   * @param cart - the cart or order object
   * @return A {@link TmaCartTotalPrice} containing the subtotal and total price of the cart
   */
  computeCartTotalPrice(cart: TmaCart | TmaOrder): TmaCartTotalPrice {
    this.cartTotalPrice.deliveryCost = 0;
    this.cartTotalPrice.payOnCheckoutSubTotal = this.computeSubTotalCartPrice(cart);

    this.computeTotalCartPrice(cart);
    this.cartTotalPrice.payOnCheckoutTotal = Number(this.cartTotalPrice.payOnCheckoutTotal.toFixed(RANGE));

    return this.cartTotalPrice;
  }

  /**
   * Returns the formatted form of the price provided (as $ 15.00)
   *
   * @param price The price to be formatted
   * @return formatted price
   */
  getFormattedPrice(price: Price): string {
    let currencySymbol: string = null;

    if (!price || !price.currencyIso || !price.value) {
      return '-';
    }

    this.subscription.add(
      this.translationService
        .translate('common.currencies.currency', { context: price.currencyIso })
        .pipe(
          first((currency: string) => currency !== null)
        )
        .subscribe((currency: string) => (currencySymbol = currency))
      );

    return currencySymbol + ' ' + Number(price.value).toFixed(RANGE);
  }

  /**
   * Returns the final price after applying alterations
   * (TmaPrice has one time $10, and has alterations of $2 , so final price is $8)
   *
   * @param cartItemPrice
   *            TmaCartPrice - cart price
   * @return The actual calculated price as {@link Price}
   */
  calculatePrice(cartItemPrice: TmaCartPrice): Price {
    let calculatedPrice: number = cartItemPrice.taxIncludedAmount ? cartItemPrice.taxIncludedAmount?.value : 0;
    if (cartItemPrice.priceAlteration !== undefined && cartItemPrice.priceAlteration.find((alteration: TmaCartPrice) => alteration.cycle) === undefined) {
      cartItemPrice.priceAlteration.forEach((discount: TmaCartPrice) => {
        if (discount.price.percentage) {
          calculatedPrice =
            Number(calculatedPrice) *
            (1 - Number(discount.price.percentage) / 100);
        } else {
          calculatedPrice =
            Number(calculatedPrice) -
            Number(discount.price.taxIncludedAmount.value);
        }
      });
      return {
        value: calculatedPrice,
        currencyIso: cartItemPrice.taxIncludedAmount ? cartItemPrice.taxIncludedAmount?.currencyIso : ''
      };
    }
    return {
      value: calculatedPrice,
      currencyIso: cartItemPrice.taxIncludedAmount ? cartItemPrice.taxIncludedAmount?.currencyIso : ''
    };
  }

  /**
   * Return the total discount applied on a price
   * (OriginalPrice is 10, and has discountedPrice is 8, so total discount available is 2)
   *
   * @param originalPrice
   *                Original Price of an offering
   * @param discountedPrice
   *                Discounted Price of an offering
   * @return Total applied discount on the original price
   */
  calculateTotalDiscount(originalPrice: number, discountedPrice: number): number {
    return (originalPrice - discountedPrice);
  }

  /**
   * Returns the list of all alternations for a charge , if any alternation has cycle attached.
   *
   * @param charge
   *              Charge for which alterations are to be listed
   * @return Price Alternation list applicable for charge
   */
  getCycledPriceAlterations(charge: TmaCartPrice): TmaCartPrice[] {
    return charge.priceAlteration.find((alteration: TmaCartPrice) => alteration.cycle) ?
      charge.priceAlteration : [];
  }


  /**
   * Returns the maximum tier ending for the provided prices.
   *
   * @param priceList - the list of usage prices
   * @return The maximum tier ending
   */
  getMaximumTierEnd(priceList: TmaCartPrice[]): number {
    const priceWithMaxTierEnd =
      priceList && priceList.length !== 0 ?
        priceList.reduce((prev, current) => {
          if (!current.tierEnd) {
            return prev;
          }
          if (Number(prev.tierEnd) > Number(current.tierEnd)) {
              return prev;
          }
          return current;
        }) : null;

    if (!priceWithMaxTierEnd || !priceWithMaxTierEnd.tierEnd) {
      return 0;
    }

    return Number(priceWithMaxTierEnd.tierEnd);
  }

  /**
   * Returns the final price of the cart after applying alterations, global discounts and total tax
   *
   * @param cart
   *            TmaCart - cart
   * @return The actual calculated price as {@link Price}
   */
  calculateCartPriceWithDiscountAndTax(cart: TmaCart): Price {
    let finalPrice: number = 0;
    const list = this.getAllCartEntriesPrices(cart, []);
    const entriesList = [];

    cart?.cartCosts?.forEach((price: TmaCartPrice) => {
      this.flattenPrice(price, list);
    });

    entriesList.forEach((entry: TmaOrderEntry) => {
      if(entry.cartPrice!=null)
      {
        this.flattenPrice(entry.cartPrice, list);
      }
    });

    list?.forEach((price: TmaCartPrice) => {
      if (price.recurringChargePeriod === TmaRecurringChargePeriod.PAY_NOW) {
        finalPrice = +finalPrice + +this.calculatePrice(price).value;
      }
      if (price.recurringChargePeriod === undefined && price.priceAlteration !== undefined) {
        finalPrice = +finalPrice + +this.calculatePrice(price).value;
      }
    });
    this.price.value = +finalPrice + +cart?.totalTax?.value;
    this.price.currencyIso = cart.totalPrice?.currencyIso;

    return this.price;
  }

  /**
   * This method will iterate cart entries to find cart price for each entry, returns simplified array of prices
   *
   * @param cart TmaCart - cart
   * @param list The array containing all the prices attached on a price
   *
   */
  getAllCartEntriesPrices(cart: TmaCart, list: TmaCartPrice[]): TmaCartPrice[] {
    if (cart.entries === undefined)
    {
      return
    }

    cart.entries.forEach((entry: TmaOrderEntry) => {
      if(entry.cartPrice !== undefined) {
        this.flattenPrice(entry.cartPrice, list);
      } else {
        this.getAllCartEntriesPrices(entry, list);
      }
    });
    return list;
  }

  /**
   * Returns the total global discount value
   *
   * @param entries
   *            TmaOrderEntry[] - cart entries list
   * @return  the total global discount value as number
   */
  retrieveTotalGlobalDiscount(entries: TmaOrderEntry[]): number {
    const list: TmaCartPrice[] = [];
    entries.forEach(entry => {
      if (entry.cartPrice !== undefined && entry.cartPrice.cartPrice !== undefined) {
        this.flattenCartPrice(entry.cartPrice.cartPrice, list)
      }
    })

    let payOnCheckoutDiscount = 0
    list.forEach(cartPrice => {
      if (cartPrice.priceAlteration !== undefined) {
        payOnCheckoutDiscount = payOnCheckoutDiscount + this.computePayOnCheckoutGlobalDiscountsFor(cartPrice)
      }
    })
    return payOnCheckoutDiscount
  }

  /**
   * This method computes the pay on checkout discount for a list of priceAlterations
   *
   * @param priceAlteration
   *              The TmfPriceAlteration[] list for which payOnCheckout discounts are be to calculated
   *
   * @returns pay on checkout discount value as number
   */
  determinePayOnCheckoutDiscount(priceAlteration: Tmf.TmfCartPrice[]): number {
    let payOnCheckoutDiscount = 0;
    if (priceAlteration !== undefined) {
      priceAlteration.forEach((discount: Tmf.TmfCartPrice) => {
        payOnCheckoutDiscount += Number(discount.price.taxIncludedAmount.value);
      });
    }
    return payOnCheckoutDiscount;
  }

  /**
   * This method transforms the price or a composite price structure to a simplified array of prices
   *
   * @param price
   *              The parent price
   * @param list
   *              The array containing all the prices attached on a price
   */
  protected flattenPrice(price: TmaCartPrice, list: TmaCartPrice[]): TmaCartPrice[] {
    list.push(price);
    if (price?.cartPrice !== undefined) {
      price.cartPrice.forEach((subPrice: TmaCartPrice) => {
        this.flattenPrice(subPrice, list);
      });
    }
    return list;
  }

  protected flattenEntries(entry: TmaOrderEntry, list: TmaOrderEntry[]): TmaOrderEntry[] {
    list.push(entry);
    if (entry.entries !== undefined) {
      entry.entries.forEach((entry2: TmaOrderEntry) => {
        this.flattenEntries(entry2, list);
      });
    }
    return list;
  }

  /**
   * This method transforms the price and price alteration composite structure to a simplified array of prices with alterations
   *
   * @param price
   *              Charge for which alterations are to be listed
   * @param parent
   *              root price
   * @param priceAlterations
   *              price alternations
   */
  protected flattenPriceTreeWithDiscount(price: TmaCartPrice, parent: TmaCartPrice, priceAlterations: TmaCartPrice[]): void {
    if (price === null) {
      return;
    }

    if (!price.cartPrice) {
      price.priceAlteration = price.priceAlteration.filter((alteration: TmaCartPrice) => !!alteration && alteration.recurringChargePeriod === price.recurringChargePeriod)
        .reverse();
      this.allPrices.push(price);
      return;
    }
    const cartPrices = price.cartPrice.filter((cartPrice: TmaCartPrice) => cartPrice.priceType === undefined || cartPrice.priceType !== 'DISCOUNT_PRICE_ALTERATION');
    cartPrices.forEach((pop: TmaCartPrice) => {
      const popCopy = Object.assign({}, parent ? { ...pop, ...parent } : pop);
      popCopy.priceAlteration = priceAlterations.concat(pop.priceAlteration);
      const popParent = pop.cartPrice && pop.cartPrice.length !== 0 ? Object.assign({}, pop) : null;
      if (pop.cartPrice) {
        popCopy.cartPrice = pop.cartPrice;
      }
      if (popParent) {
        popParent.cartPrice = null;
      }
      if (pop.priceType !== 'DISCOUNT_PRICE_ALTERATION') {
        this.flattenPriceTreeWithDiscount(popCopy, popParent, popCopy.priceAlteration);
      }
    });
  }

  protected computeEntryPriceTypes(cartPrices: TmaCartPrice[], id?: string): void {
    cartPrices.forEach((price: TmaCartPrice) => {
      if (Array.isArray(price.cartPrice)) {
        this.computeEntryPriceTypes(price.cartPrice, price.id);
        return;
      }
      if (this.isOneTimePrice(price.chargeType)) {
        this.computeOneTimePrice(price);
      }
      if (this.isRecurringPrice(price.chargeType)) {
        this.cartItemPrice.recurringPrices.push(price);
      }
      if (this.isUsagePrice(price.chargeType)) {
        const newPrice = Object.assign({}, price);
        newPrice.parentId = id;
        this.cartItemPrice.usageChargePrices.push(newPrice);
      }
    });
  }

  protected isOneTimePrice(chargeType: string): boolean {
    return chargeType === TmaChargeType.ONE_TIME;
  }

  protected isRecurringPrice(chargeType: string): boolean {
    return chargeType === TmaChargeType.RECURRING;
  }

  protected isUsagePrice(chargeType: string): boolean {
    return chargeType === TmaChargeType.USAGE;
  }

  protected computeOneTimePrice(price: TmaCartPrice): void {
    if (price.recurringChargePeriod === TmaBillingTimeType.PAY_NOW) {
      if (price.priceType === TmaPriceType.DISCOUNT) {
        this.discountedPayOnCheckoutPrice += Number(price.taxIncludedAmount.value);
        return;
      }
      this.payOnCheckoutPrice += Number(price.taxIncludedAmount.value);
      this.computePayOnCheckoutDiscount(price);
      return;
    }
    this.cartItemPrice.oneTimeChargePrices.push(price);
  }

  /**
   * This method returns the price discount applied on payOncheckout charge
   *
   * @param price
   *              Charge for which discount are be to calculated
   *
   * @returns pay on checkout discount
   */
  protected computePayOnCheckoutDiscount(price: TmaCartPrice): number {
    let entryPrice = price.taxIncludedAmount.value;
    price.priceAlteration.forEach((discount: TmaCartPrice) => {
      if (discount.price.percentage) {
        this.payOnCheckoutDiscount += Number(entryPrice) * Number(discount.price.percentage) / 100;
        entryPrice = Number(entryPrice) * (1 - (Number(discount.price.percentage) / 100));
      }
      else {
        this.payOnCheckoutDiscount += Number(discount.price.taxIncludedAmount.value);
        entryPrice = Number(entryPrice) - Number(discount.price.taxIncludedAmount.value);
      }
    });
    return this.payOnCheckoutDiscount;
  }

  protected computeTotalCartPrice(cart: TmaCart | TmaOrder): void {
    this.cartTotalPrice.payOnCheckoutTotal = this.cartTotalPrice.payOnCheckoutSubTotal;
    const prices = 'cartCosts' in cart ? cart.cartCosts : (<TmaOrder>cart).orderCosts;

    if (!prices) {
      return;
    }

    prices.forEach((cartCost: TmaCartPrice) =>
      this.computeCartPrice(cartCost.cartPrice)
    );
  }

  protected computeCartPrice(priceList: TmaCartPrice[]): void {
    if (!priceList || priceList.length === 0) {
      return;
    }

    priceList.forEach((price: TmaCartPrice) => {
        this.computeCartPrice(price.cartPrice);

        if (price.recurringChargePeriod !== TmaBillingTimeType.PAY_NOW) {
          return;
        }

        this.cartTotalPrice.payOnCheckoutTotal += Number(price.taxIncludedAmount.value);

        if (price.priceType === TmaPriceType.DELIVERY_COST) {
          this.cartTotalPrice.deliveryCost = price.taxIncludedAmount.value;
        }
      }
    );
  }

  protected computeCartEntryPrice(cartPrice: TmaCartPrice[], quantity: number): number {
    let entryTotalPrice = 0;
    let discountedEntryTotalPrice = 0;

    cartPrice.forEach((price: TmaCartPrice) => {
      if (price.recurringChargePeriod === TmaBillingTimeType.PAY_NOW) {
        if (price.priceType === TmaPriceType.DISCOUNT) {
          discountedEntryTotalPrice += Number(price.taxIncludedAmount.value);
        }
        else {
          entryTotalPrice += Number(price.taxIncludedAmount.value);
        }
      }
    });

    entryTotalPrice = entryTotalPrice * quantity + discountedEntryTotalPrice;
    return entryTotalPrice;
  }

  protected groupBy(list: any[], field: string): any {
    return list.reduce(function (l: any[], f: string) {
      const group = l[f[field]] || [];
      group.push(f);
      l[f[field]] = group;
      return l;
    }, {});
  }

  protected isCartPriceParent(cartPrice: any): boolean {
    return cartPrice.cartPrice !== undefined;
  }

  /**
   * This method transforms the list of price/s or composite price/s structure to a simplified array of prices
   *
   * @param cartPrice
   *              The list of TmaCartPrices to be flattened
   * @param totalCartPrices
   *              The array containing all the prices resulted by flatten the cartPrice list
   */
  protected flattenCartPrice(cartPrice: TmaCartPrice[], totalCartPrices: TmaCartPrice[]): TmaCartPrice[] {
    if (cartPrice != null) {
      cartPrice.forEach(cartPrice => {
        if (this.isCartPriceParent(cartPrice)) {
          this.flattenCartPrice(cartPrice.cartPrice, totalCartPrices);
          return;
        }
        totalCartPrices.push(cartPrice)
      })
    }
    return totalCartPrices;
  }

  /**
   * This method computes the pay on checkout global discounts for a TmaCartPrice
   *
   * @param price
   *              The TmaCartPrice for which payOnCheckout global discounts are be to calculated
   *
   * @returns pay on checkout global discount value as number
   */
  protected computePayOnCheckoutGlobalDiscountsFor(price: TmaCartPrice): number {
    let entryPrice = price.taxIncludedAmount.value;
    let payOnCheckoutDiscount = 0
    if (price.priceAlteration !== undefined && price.chargeType === TmaChargeType.ONE_TIME)
    {
      price.priceAlteration.forEach((discount: TmaCartPrice) => {
        if (discount.price.percentage) {
          payOnCheckoutDiscount += Number(entryPrice) * Number(discount.price.percentage) / 100;
          entryPrice = Number(entryPrice) * (1 - (Number(discount.price.percentage) / 100));
        }
        else {
          payOnCheckoutDiscount += Number(discount.price.taxIncludedAmount.value);
          entryPrice = Number(entryPrice) - Number(discount.price.taxIncludedAmount.value);
        }
      });
    }
    return payOnCheckoutDiscount;
  }
}
