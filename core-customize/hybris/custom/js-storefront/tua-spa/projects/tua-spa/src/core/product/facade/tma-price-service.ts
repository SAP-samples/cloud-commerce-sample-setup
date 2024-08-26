// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable, OnDestroy } from '@angular/core';
import { TranslationService } from '@spartacus/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { TmaBillingFrequencyConfig, TmaBillingFrequencyMap } from '../../config';
import {
  TmaMoney,
  TmaPopBillingEventType,
  TmaPopChargeType,
  TmaPriceContext,
  TmaProduct,
  TmaProductOfferingPrice,
  TmaProductOfferingTerm,
  TmaProductSpecificationCharacteristicValue,
  TmaSubscriptionTerm,
  TmaUsageType,
  TmaUsageUnit
} from '../../model';
import { LOCAL_STORAGE } from '../../util';

const {
  RANGE
} = LOCAL_STORAGE.DECIMAL;

@Injectable({
  providedIn: 'root'
})
export class TmaPriceService implements OnDestroy {

  protected readonly ID: string = 'id';

  protected allPrices = [];

  /**
   * @deprecated since 2.1
   */
  public priceValue: TmaProductOfferingPrice[];

  protected subscription = new Subscription();

  constructor(
    protected billingFrequencyConfig: TmaBillingFrequencyConfig,
    protected translationService: TranslationService
  ) {
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Returns the highest priority price of a SPO product.
   *
   * @param product - The product for which the highest priority price will be returned
   *
   * @return A {@link TmaProductOfferingPrice} that has highest priority
   */
  getHighestPriorityPriceForSPO(product: TmaProduct): TmaProductOfferingPrice {
    const highestPrioritySPOPrice = product.productOfferingPrice.filter(
      (bundledPop: TmaProductOfferingPrice) =>
        bundledPop.isPriceOverride === false
    );
    if (highestPrioritySPOPrice.length === 1) {
      return highestPrioritySPOPrice[0];
    }
    let highestPriorityPrice = highestPrioritySPOPrice[0];
    if (highestPrioritySPOPrice.length > 0) {
      highestPrioritySPOPrice.forEach((pop: TmaProductOfferingPrice) => {
        if (pop.priority >= highestPriorityPrice.priority) {
          highestPriorityPrice = pop;
        }
      });
    }
    return highestPriorityPrice;
  }

  /**
   * Returns the discount prices of a SPO product.
   *
   * @param product - The product for which the discount prices will be returned
   *
   * @return A {@link TmaProductOfferingPrice} that contains the discount prices
   */
  getDiscountPricesForSPO(product: TmaProduct): TmaProductOfferingPrice[] {
    const discountPrices: TmaProductOfferingPrice[] = [];

    const prices = product.productOfferingPrice;

    prices.forEach((price: TmaProductOfferingPrice) => {
      price.bundledPop.forEach((bundledPop: TmaProductOfferingPrice) => {
        if(bundledPop.chargeType === TmaPopChargeType.DISCOUNT){
          discountPrices.push(bundledPop);
        }
      });
    });

    return discountPrices;
  }

  /**
   * Gets the eligible subscription terms.
   *
   * @param priceContexts - The price contexts for the product offering.
   *
   * @return A list of subscription terms as {@link TmaSubscriptionTerm}.
   */
  getEligibleSubscriptionTerms(
    productOfferingPrice: TmaProductOfferingPrice[]
  ): TmaSubscriptionTerm[] {
    const offeringTerms: TmaProductOfferingTerm[] = [];
    productOfferingPrice
      .filter((pop: TmaProductOfferingPrice) => !pop.isPriceOverride)
      .forEach((bundlePop: TmaProductOfferingPrice) => {
        offeringTerms.push(...bundlePop.productOfferingTerm);
      });
    const eligibleTerms: TmaSubscriptionTerm[] = Object.assign(
      [],
      offeringTerms.filter(
        (n, i) =>
          offeringTerms.findIndex((v) => v.id === n.id && v.name === n.name) ===
          i
      )
    );
    return eligibleTerms;
  }

  /**
   * Gets the highest priority price context for the given selected term.
   *
   * @param priceContexts - The price contexts for the product offering.
   * @param termId - The selected subscription term id
   *
   * @return A {@link TmaPriceContext} highest priority price context.
   */
  getHighestPriorityPriceContext(
    productOfferingPrices: TmaProductOfferingPrice[],
    termId: string
  ): TmaProductOfferingPrice {
    const eligiblePop: TmaProductOfferingPrice[] = [];
    productOfferingPrices
      .filter((pop: TmaProductOfferingPrice) => !pop.isPriceOverride)
      .forEach((pop: TmaProductOfferingPrice) => {
        const popForTerm: TmaProductOfferingPrice = this.getPopFor(
          termId,
          pop
        );
        if (popForTerm) {
          eligiblePop.push(popForTerm);
        }
      });
    if (eligiblePop.length === 1) {
      return eligiblePop[0];
    }
    let highestPriorityPop = eligiblePop[0];
    if (productOfferingPrices.length > 0) {
      eligiblePop.forEach((pop: TmaProductOfferingPrice) => {
        if (pop.priority >= highestPriorityPop.priority) {
          highestPriorityPop = pop;
        }
      });
    }
    return highestPriorityPop;
  }

  /**
   * Flattens the prices of a product and returns them in a list.
   *
   * @param price - The price which will be flattened
   * @return List of {@link TmaProductOfferingPrice}
   */
  getAllPriceList(price: TmaProductOfferingPrice): TmaProductOfferingPrice[] {
    this.allPrices = [];
    this.flattenPriceTreeWithDiscount(price, null, []);
    return this.allPrices;
  }

  /**
   * Returns a list containing only the cancellation fee prices.
   *
   * @param priceList - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} cancellation fees
   */
  getCancellationFeePrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ?
      priceList.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.billingEvent === TmaPopBillingEventType.ON_CANCELLATION) :
      [];
  }

  /**
   * Returns a list containing only the pay now prices.
   *
   * @param priceList - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} pay now prices
   */
  getPayNowPrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ?
      priceList.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.billingEvent === TmaPopBillingEventType.PAY_NOW) : [];
  }

  /**
   * Returns a list containing only the on first bill prices.
   *
   * @param priceList - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} on first bill prices
   */
  getOnFirstBillPrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ?
      priceList.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.billingEvent === TmaPopBillingEventType.ON_FIRST_BILL) :
      [];
  }

  /**
   * Returns a list containing only the one time charges.
   *
   * @param price - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} one time charges
   */
  getOneTimeCharges(price: TmaProductOfferingPrice): TmaProductOfferingPrice[] {
    return price && price.bundledPop && price.bundledPop.length !== 0 ?
      price.bundledPop.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === TmaPopChargeType.ONE_TIME) : [];
  }

  /**
   * Returns a list containing only the recurring charges.
   *
   * @param priceList - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} recurring charges
   */
  getRecurringPrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ?
      priceList.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === TmaPopChargeType.RECURRING)
        .sort((s1, s2) => {
          if (!s1.cycle || !s1.cycle.cycleEnd) {
            return 1;
          }
          if (!s2.cycle || !s2.cycle.cycleEnd) {
            return -1;
          }
          if (s1.cycle.cycleEnd === -1) {
            return 1;
          }
          if (s2.cycle.cycleEnd === -1) {
            return -1;
          }
          if (s1.cycle.cycleEnd < s2.cycle.cycleEnd) {
            return -1;
          }
          return 1;
        })
        .sort((s1, s2) => {
          if (!s1.cycle || !s1.cycle.cycleStart) {
            return 1;
          }
          if (!s2.cycle || !s2.cycle.cycleStart) {
            return 1;
          }
          if (s1.cycle.cycleStart < s2.cycle.cycleStart) {
            return -1;
          }
          return 1;
        }) :
      [];
  }

  /**
   * Returns a list containing only the each respective tier usage charges.
   *
   * @param priceList - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} with the each respective tier usage charges
   */
  getEachRespectiveTierUsagePrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ? this.groupBy(priceList
        .filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === TmaPopChargeType.USAGE)
        .filter((unitPrice: TmaProductOfferingPrice) => unitPrice.usageType === TmaUsageType.EACH_RESPECTIVE_TIER)
        .sort((s1, s2) => {
          if (!s1.tierEnd) {
            return 1;
          }
          if (!s2.tierEnd) {
            return -1;
          }
          if (s1.tierEnd < s2.tierEnd) {
            return -1;
          }
          return 1;
        })
        .sort((s1, s2) => {
          if (!s1.tierStart) {
            return 1;
          }
          if (!s2.tierStart) {
            return -1;
          }
          if (s1.tierStart < s2.tierStart) {
            return -1;
          }
          return 1;
        }), this.ID) :
      [];
  }

  /**
   * Returns a list containing only the highest applicable tier usage charges.
   *
   * @param priceList - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} with the highest applicable tier usage charges
   */
  getHighestApplicableTierUsagePrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ? this.groupBy(priceList
        .filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === TmaPopChargeType.USAGE)
        .filter((unitPrice: TmaProductOfferingPrice) => unitPrice.usageType === TmaUsageType.HIGHEST_APPLICABLE_TIER)
        .sort((s1, s2) => {
          if (!s1.tierEnd) {
            return 1;
          }
          if (!s2.tierEnd) {
            return -1;
          }
          if (s1.tierEnd < s2.tierEnd) {
            return -1;
          }
          return 1;
        })
        .sort((s1, s2) => {
          if (!s1.tierStart) {
            return 1;
          }
          if (!s2.tierStart) {
            return -1;
          }
          if (s1.tierStart < s2.tierStart) {
            return -1;
          }
          return 1;
        }), this.ID) :
      [];
  }

  /**
   * Returns a list containing only the usage charges without usage type.
   *
   * @param priceList - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} with the usage charges without usage type
   */
  getVolumeUsagePrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ? this.groupBy(priceList
        .filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === TmaPopChargeType.USAGE)
        .filter((unitPrice: TmaProductOfferingPrice) => !unitPrice.usageType)
        .sort((s1, s2) => {
          if (!s1.tierEnd) {
            return 1;
          }
          if (!s2.tierEnd) {
            return -1;
          }
          if (s1.tierEnd < s2.tierEnd) {
            return -1;
          }
          return 1;
        })
        .sort((s1, s2) => {
          if (!s1.tierStart) {
            return 1;
          }
          if (!s2.tierStart) {
            return -1;
          }
          if (s1.tierStart < s2.tierStart) {
            return -1;
          }
          return 1;
        }), this.ID) :
      [];
  }

  /**
   * Returns the contract term of the price provided.
   *
   * @param price - The price of the product
   * @return The product offering term of the price
   */
  getContractTerm(price: TmaProductOfferingPrice): TmaProductOfferingTerm {
    if (!price || !price.productOfferingTerm || price.productOfferingTerm.length === 0) {
      return null;
    }

    if (price.productOfferingTerm.length) {
      return price.productOfferingTerm[0];
    }

    return {};
  }

  /**
   * Returns the usage charge list.
   *
   * @param product - The product for which the usage charge will be returned
   * @return A {@link TmaProductOfferingPrice[]} containing usage charge list
   */
  getUsageCharge(product):TmaProductOfferingPrice[] {
    const highestPriorityPrice = this.getHighestPriorityPriceForSPO(product);
    const priceList = this.getAllPriceList(highestPriorityPrice);
    return this.getEachRespectiveTierUsagePrices(priceList);
  }

  /**
   * Returns the average cost per month based on the consumption and term provided.
   *
   * @param product - The product for which the average cost per month will be returned
   * @param currency - The currency of the price
   * @param consumption - The consumption for which the average cost per month will be computed
   * @param term - The duration of te contract
   * @param fullPriceWithOutDiscounts - To calculate price without discounts
   * @return A {@link TmaMoney} containing the average cost per month
   */
  getAverageCostPerMonth(product: TmaProduct, currency: string, consumption: number, term: number, fullPriceWithOutDiscounts?: boolean): TmaMoney {
    const highestPriorityPrice = this.getHighestPriorityPriceForSPO(product);
    const priceList = this.getAllPriceList(highestPriorityPrice);

    const onFirstBillOneTimeChargePriceList = this.getOnFirstBillPrices(priceList);
    const onCancellationOneTimeChargePriceList = this.getCancellationFeePrices(priceList);
    const payNowOneTimeChargePriceList = this.getPayNowPrices(priceList);
    const recurringChargePriceList = this.getRecurringPrices(priceList);
    const eachRespectiveTierUsageChargePriceList = this.getEachRespectiveTierUsagePrices(priceList);
    const highestApplicableTierUsageChargePriceList = this.getHighestApplicableTierUsagePrices(priceList);
    const volumeUsageChargePriceList = this.getVolumeUsagePrices(priceList);

    let fullPriceWithOutDiscount = 0;
    const contractTerm = this.getContractTerm(highestPriorityPrice);
    if (!priceList || priceList.length === 0) {
      return { value: '0.0', currencyIso: currency };
    }

    let averageCost = 0;

    let oneTimeChargeValue = 0;

    onFirstBillOneTimeChargePriceList.forEach((childPrice: TmaProductOfferingPrice) => {
      fullPriceWithOutDiscount += this.getDiscountedPrice(undefined, Number(childPrice.price.value));
      const onFirstBillValue = this.getDiscountedPrice(childPrice.alterations, Number(childPrice.price.value));
      oneTimeChargeValue += onFirstBillValue;
    });

    onCancellationOneTimeChargePriceList.forEach((childPrice: TmaProductOfferingPrice) => {
      fullPriceWithOutDiscount += this.getDiscountedPrice(undefined, Number(childPrice.price.value));
      const onCancellationFeeValue = this.getDiscountedPrice(childPrice.alterations, Number(childPrice.price.value));
      oneTimeChargeValue += onCancellationFeeValue;
    });

    payNowOneTimeChargePriceList.forEach((childPrice: TmaProductOfferingPrice) => {
      fullPriceWithOutDiscount += this.getDiscountedPrice(undefined, Number(childPrice.price.value));
      const payNowValue = this.getDiscountedPrice(childPrice.alterations, Number(childPrice.price.value));
      oneTimeChargeValue += payNowValue;
    });

    const contractTermDurationInMonths = this.getContractTermDurationInMonths(contractTerm);

    let recurringChargeValue = 0;
    let fullRecurringPriceWithOutDiscount = 0;
    recurringChargePriceList.forEach((childPrice: TmaProductOfferingPrice) => {
      const isCycleEndNegativeOne = childPrice.cycle.cycleEnd === -1;
      const cycleEndValue = isCycleEndNegativeOne ? contractTermDurationInMonths : childPrice.cycle.cycleEnd;
      const cycleEnd = childPrice.cycle && childPrice.cycle.cycleEnd ? cycleEndValue : contractTermDurationInMonths;
      fullRecurringPriceWithOutDiscount += this.getDiscountedPrice(undefined, Number(childPrice.price.value), childPrice.cycle.cycleStart, cycleEnd);
      const discountedPrice: number = this.getDiscountedPrice(childPrice.alterations, Number(childPrice.price.value), childPrice.cycle.cycleStart, cycleEnd);
      recurringChargeValue += discountedPrice;
    });

    if (!consumption) {
      averageCost = (oneTimeChargeValue / contractTermDurationInMonths) + (recurringChargeValue / contractTermDurationInMonths);
      return { value: averageCost.toFixed(2).toString(), currencyIso: currency };
    }

    let eachRespectiveTierValue = 0;
    Object.keys(eachRespectiveTierUsageChargePriceList).forEach((key: string) => {
      eachRespectiveTierUsageChargePriceList[key].forEach((childPrice: TmaProductOfferingPrice) => {

        const billingFrequency: number = this.getBillingFrequency(childPrice.billingEvent);
        const consumptionIncluded: number = this.getConsumptionIncludedInPlan(highestPriorityPrice, product);
        const extraConsumption: number = consumption / (term / billingFrequency) - consumptionIncluded;

        if (extraConsumption <= 0) {
          return;
        }

        let consumptionTier = extraConsumption;

        if (eachRespectiveTierValue !== 0) {
          if (childPrice.tierEnd <= extraConsumption) {
            const lastTierConsumption = extraConsumption - childPrice.tierEnd;
            consumptionTier = extraConsumption - (childPrice.tierStart - 1) - lastTierConsumption;
          } else if (childPrice.tierEnd >= extraConsumption || childPrice.tierEnd === undefined) {
            consumptionTier = extraConsumption - childPrice.tierStart + 1;
          }
        }

        if (Number(childPrice.tierStart) <= extraConsumption) {
          const isLastTier = childPrice.tierEnd <= extraConsumption && eachRespectiveTierValue === 0;
          const tierEnd = isLastTier ? childPrice.tierEnd : consumptionTier;
          fullPriceWithOutDiscount += this.getDiscountedPrice(
            undefined,
            Number(childPrice.price.value),
            childPrice.tierStart,
            isLastTier ? tierEnd : childPrice.tierEnd,
            tierEnd
          );
          const discountedPrice = this.getDiscountedPrice(
            childPrice.alterations,
            Number(childPrice.price.value),
            childPrice.tierStart,
            isLastTier ? tierEnd : childPrice.tierEnd,
            tierEnd
          );

          eachRespectiveTierValue += discountedPrice;
          eachRespectiveTierValue /= billingFrequency;
        }
      });
    });

    let highestApplicableTierValue = 0;
    Object.keys(highestApplicableTierUsageChargePriceList).forEach((key: string) => {
      const maxTierForHighestApplicableTierPrice = highestApplicableTierUsageChargePriceList[key].length !== 0 ?
        highestApplicableTierUsageChargePriceList[key].reduce((prev, current) => {
          if (!current.tierEnd) {
            return prev;
          }
          if (prev.tierEnd === -1) {
            return prev;
          }
          if (current.tierEnd === -1) {
            return current;
          }
          if (prev.tierEnd > current.tierEnd) {
            return prev;
          }
          return current;
        }).tierEnd : 0;

      let priceForConsumption = highestApplicableTierUsageChargePriceList[key]
        .find((childPrice: TmaProductOfferingPrice) => {
          const billingFrequencyTemp: number = this.getBillingFrequency(childPrice.billingEvent);
          const consumptionIncludedTemp: number = this.getConsumptionIncludedInPlan(highestPriorityPrice, product);
          const extraConsumptionTemp: number = consumption / (term / billingFrequencyTemp) - consumptionIncludedTemp;

          if (extraConsumptionTemp <= 0) {
            return false;
          }

          return Number(childPrice.tierStart) <= extraConsumptionTemp && (!childPrice.tierEnd || Number(childPrice.tierEnd) >= extraConsumptionTemp || Number(childPrice.tierEnd) === -1);
        });

      priceForConsumption = priceForConsumption ? priceForConsumption :
        highestApplicableTierUsageChargePriceList[key].find((childPrice: TmaProductOfferingPrice) => childPrice.tierEnd === maxTierForHighestApplicableTierPrice);

      const billingFrequency: number = this.getBillingFrequency(priceForConsumption.billingEvent);
      const consumptionIncluded: number = this.getConsumptionIncludedInPlan(highestPriorityPrice, product);
      const extraConsumption: number = consumption / (term / billingFrequency) - consumptionIncluded;

      if (extraConsumption <= 0) {
        return;
      }

      const tierEnd = !priceForConsumption.tierEnd || priceForConsumption.tierEnd === -1 ?
        extraConsumption : priceForConsumption.tierEnd;
      fullPriceWithOutDiscount += priceForConsumption ?
        this.getDiscountedPrice(undefined, Number(priceForConsumption.price.value), priceForConsumption.tierStart, tierEnd, extraConsumption) :
        0;
      const discountedPrice: number = priceForConsumption ?
        this.getDiscountedPrice(priceForConsumption.alterations, Number(priceForConsumption.price.value), priceForConsumption.tierStart, tierEnd, extraConsumption) :
        0;

      highestApplicableTierValue += discountedPrice;
      highestApplicableTierValue /= billingFrequency;
    });


    let volumePriceValue = 0;
    Object.keys(volumeUsageChargePriceList).forEach((key: string) => {
      volumeUsageChargePriceList[key].forEach((childPrice: TmaProductOfferingPrice) => {

        const billingFrequency: number = this.getBillingFrequency(childPrice.billingEvent);
        const consumptionIncluded: number = this.getConsumptionIncludedInPlan(highestPriorityPrice, product);
        const extraConsumption: number = consumption / (term / billingFrequency) - consumptionIncluded;

        if (extraConsumption <= 0) {
          return;
        }

        if (Number(childPrice.tierStart) <= extraConsumption) {
          const tierEnd = !childPrice.tierEnd || childPrice.tierEnd === -1 ?
            extraConsumption : childPrice.tierEnd;

          fullPriceWithOutDiscount += childPrice.price.value ?
            this.getDiscountedPrice(undefined, Number(childPrice.price.value), childPrice.tierStart, tierEnd, null, true) :
            0;
          const discountedPrice: number = childPrice.price.value ?
            this.getDiscountedPrice(childPrice.alterations, Number(childPrice.price.value), childPrice.tierStart, tierEnd, null, true) :
            0;

          volumePriceValue += discountedPrice;
          volumePriceValue /= billingFrequency;
        }
      });
    });

    const usageChargeValue = eachRespectiveTierValue + highestApplicableTierValue + volumePriceValue;

    averageCost = (oneTimeChargeValue / contractTermDurationInMonths) + (recurringChargeValue / contractTermDurationInMonths) + usageChargeValue;
    if (fullPriceWithOutDiscounts) {
      return { value: ((fullRecurringPriceWithOutDiscount / contractTermDurationInMonths) + fullPriceWithOutDiscount).toFixed(2).toString(), currencyIso: currency };
    }
    return { value: averageCost.toFixed(2).toString(), currencyIso: currency };
  }

  /**
   * Returns the average cost per year based on the consumption and term provided.
   *
   * @param product - The product for which the average cost per year will be returned
   * @param currency - The currency of the price
   * @param consumption - The consumption for which the average cost per year will be computed
   * @param term - The duration of te contract
   * @return A {@link TmaMoney} containing the average cost per year
   */
  getAverageCostPerYear(product: TmaProduct, currency: string, consumption: number, term: number): TmaMoney {
    return {
      value: (Number(this.getAverageCostPerMonth(product, currency, consumption, term).value) * 12).toFixed(2).toString(),
      currencyIso: currency
    };
  }

  /**
   * Calculate sum of the prices provided.
   *
   * @param productOfferingPriceList - List of prices to be added together
   * @return The sum of the prices
   */
  getSumOfPrices(productOfferingPriceList: TmaProductOfferingPrice[]): TmaMoney {
    let sum = 0;

    if (!productOfferingPriceList) {
      return { value: '0' };
    }

    productOfferingPriceList.forEach(
      (pop: TmaProductOfferingPrice) => (sum += Number(pop.price.value))
    );

    return {
      value: sum.toString(),
      currencyIso: productOfferingPriceList[0].price.currencyIso
    };
  }

  /**
   * Returns the formatted form of the price provided.
   *
   * @param price The price to be formatted
   * @return String containing the formatted price
   */
  getFormattedPrice(price: TmaMoney): string {
    let currencySymbol: string = null;

    if (!price || !price.currencyIso || !price.value) {
      return '-';
    }

    this.subscription.add(
      this.translationService.translate('common.currencies.currency', { context: price.currencyIso })
        .pipe(
          first((currency: string) => currency != null)
        )
        .subscribe((currency: string) => currencySymbol = currency)
      );

    return currencySymbol + price.value;
  }

  /**
   * Returns the formatted form of the contract term provided.
   *
   * @param contractTerm The term to be formatted
   * @return String containing the formatted term
   */
  getFormattedContractTerm(contractTerm: TmaProductOfferingTerm): string {
    if (!contractTerm || !contractTerm.duration || !contractTerm.duration.amount || !contractTerm.duration.units) {
      return '';
    }

    let contractTermUnit = contractTerm.duration.amount > 1 ?
      contractTerm.duration.units.replace(/ly$/, 's') :
      contractTerm.duration.units.replace(/ly$/, '');
    contractTermUnit = contractTermUnit[0].toUpperCase() + contractTermUnit.substr(1).toLowerCase();

    return contractTerm.duration.amount + ' ' + contractTermUnit;
  }

  /**
   * Returns the usage units for the product provided.
   *
   * @param product - The product provided
   * @return The highest tier end
   */
  getUsageUnits(product: TmaProduct): TmaUsageUnit[] {
    const highestPriorityPrice = this.getHighestPriorityPriceForSPO(product);
    const priceList = this.getAllPriceList(highestPriorityPrice);
    const usageUnits = priceList
      .filter((price: TmaProductOfferingPrice) => price.chargeType === TmaPopChargeType.USAGE)
      .map((price: TmaProductOfferingPrice) => price.usageUnit);

    return usageUnits.filter((n, i) => usageUnits.findIndex(v => v.id === n.id && v.name === n.name) === i);
  }

  /**
   * Returns a list containing usage product offering prices.
   *
   * @param priceList - List containing all prices of a product
   * @return List of {@link TmaProductOfferingPrice} usage charges
   */
  getUsagePrices(priceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    return priceList && priceList.length !== 0 ? this.groupBy(priceList
        .filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === TmaPopChargeType.USAGE)
        .filter((unitPrice: TmaProductOfferingPrice) => unitPrice.id !== null)
        .sort((s1, s2) => {
          if (!s1.tierEnd) {
            return 1;
          }
          if (!s2.tierEnd) {
            return -1;
          }
          if (s1.tierEnd < s2.tierEnd) {
            return -1;
          }
          return 1;
        })
        .sort((s1, s2) => {
          if (!s1.tierStart) {
            return 1;
          }
          if (!s2.tierStart) {
            return -1;
          }
          if (s1.tierStart < s2.tierStart) {
            return -1;
          }
          return 1;
        }), this.ID) :
      [];
  }

  /**
   * Returns the cumulative sum of prices after alternations
   *
   * @param productOfferingPriceList - List of prices to be calculated
   * @return The actual calculated price (@link TmaMoney)
   */
  calculatePrice(productOfferingPriceList: TmaProductOfferingPrice[]): TmaMoney {
    const sumPrice = this.getSumOfPrices(productOfferingPriceList);
    let discountCharges: TmaProductOfferingPrice[] = [];
    productOfferingPriceList.forEach((bundledPop: TmaProductOfferingPrice) => {
      discountCharges = bundledPop.alterations;
    });
    if (discountCharges && discountCharges.length > 0) {
      return {
        value: this.calculatePriceWithDiscounts(
          Number(sumPrice.value),
          discountCharges
        ).toFixed(RANGE),
        currencyIso: productOfferingPriceList[0].price.currencyIso
      };
    }
    return sumPrice;
  }

  /**
   * Return the total discount applied on a price
   * (OriginalPrice is 10, and has discountedPrice is 8 , so total discount available is 2)
   *
   * @param originalPrice
   *                Original Price of an offering
   * @param discountedPrice
   *                Discounted Price of an offering
   * @return Total applied discount on the original price
   */
  calculateTotalDiscount(originalPrice: number, discountedPrice: number): number {
    return (Number(originalPrice) - Number(discountedPrice));
  }


  /**
   * Returns the list of discount charges for product offering prices
   *
   * @param productOfferingPriceList(TmaProductOfferingPrice[])- List of prices of an offering
   * @return (TmaProductOfferingPrice[]) discount charges for a product offering prices
   */
  getDiscounts(productOfferingPriceList: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    let discountCharges: TmaProductOfferingPrice[] = [];
    productOfferingPriceList.forEach((bundledPop: TmaProductOfferingPrice) => {
      discountCharges = bundledPop.alterations;
    });
    if (discountCharges && discountCharges.length > 0 && discountCharges.find((charge: TmaProductOfferingPrice) => charge.cycle) === undefined) {
      return discountCharges;
    }
    return [];
  }

  /**
   * Returns the sum of the charges with discounts filter out .
   *
   * @param productOfferingPriceList - List of charges to be added together
   * @return The sum of the charges
   */
  sumOfCharges(productOfferingPriceList: TmaProductOfferingPrice[]): TmaMoney {
    const otherCharges = productOfferingPriceList.filter(
      (bundledPop: TmaProductOfferingPrice) =>
        bundledPop.chargeType !== TmaPopChargeType.DISCOUNT
    );
    return this.getSumOfPrices(otherCharges);
  }

  /**
   * Returns the list of all alternations for a price , if any alternation has cycle attached.
   *
   * @param productOfferingPriceList - Price for which alterations are to be listed
   * @return @return List of {@link TmaProductOfferingPrice} alterations of charges
   */
   getCycledPriceAlterations(price: TmaProductOfferingPrice): TmaProductOfferingPrice[] {
     return (price.alterations.find((alteration: TmaProductOfferingPrice) => alteration.cycle)) ? price.alterations.reverse() : [];
  }

  /**
   * Fetch standalone prices for a given product.
   *
   * @param product
   *         The identifier of the base site as {@link TmaProduct}
   * @return
   *         The product offering prices as {@link Observable} of {@link TmaProductOfferingPrice}
   */
  getStandalonePrices(product: TmaProduct): TmaProductOfferingPrice[] {
    const tmaProductOfferingPrices: TmaProductOfferingPrice[] = [];
    const eligibleContext: TmaPriceContext[] = product.priceContext.filter(
      (priceContext: TmaPriceContext) => priceContext.isPriceOverride === false
    );
    product.productOfferingPrice.forEach((price: TmaProductOfferingPrice) => {
      const productOfferingPrice: TmaProductOfferingPrice = this.populateStandalonePrices(
        eligibleContext,
        price
      );
      if (productOfferingPrice) {
        tmaProductOfferingPrices.push(productOfferingPrice);
      }
    });
    return tmaProductOfferingPrices;
  }

  /**
   * @deprecated since 2.1
   */
  protected flattenPriceTree(price: TmaProductOfferingPrice, parent: TmaProductOfferingPrice): void {
    if (!price) {
      return;
    }

    if (!price.bundledPop || price.bundledPop.length === 0) {
      this.allPrices.push(price);
      return;
    }

    price.bundledPop.forEach((pop: TmaProductOfferingPrice) => {
      const popCopy = Object.assign({}, parent ? { ...pop, ...parent } : pop);
      const popParent = pop.bundledPop && pop.bundledPop.length !== 0 ? Object.assign({}, pop) : null;
      if (pop.bundledPop) {
        popCopy.bundledPop = pop.bundledPop;
      }
      if (popParent) {
        popParent.bundledPop = null;
      }

      this.flattenPriceTree(popCopy, popParent);
    });
  }

  /**
   * @deprecated since 2.1
   */
  protected compareInstances(instance1: TmaProductOfferingPrice, instance2: TmaProductOfferingPrice): number {
    const instance1RecurringPriceList = this.getRecurringChargesUnsorted(instance1);
    const instance2RecurringPriceList = this.getRecurringChargesUnsorted(instance2);

    if ((instance1RecurringPriceList && instance1RecurringPriceList.length !== 0) ||
      (instance2RecurringPriceList && instance2RecurringPriceList.length !== 0)) {
      return this.compareCharges(instance1RecurringPriceList, instance2RecurringPriceList);
    }
    return this.compare(this.getOtcPrice(instance1), this.getOtcPrice(instance2));
  }

  /**
   * @deprecated since 2.1
   */
  protected compareCharges(charges1: TmaProductOfferingPrice[], charges2: TmaProductOfferingPrice[]): number {
    if (!charges1 || charges1.length === 0 || !charges1[0].price || !charges1[0].price.value) {
      return -1;
    }

    if (!charges2 || charges2.length === 0 || !charges2[0].price || !charges2[0].price.value) {
      return 1;
    }

    return this.compare(Number(charges1[0].price.value), Number(charges2[0].price.value));
  }

  /**
   *  Returns the value of the price with price alterations applied based on the provided parameters.
   *
   * @param priceAlterations - The list of price alterations
   * @param price - The price value on which the price alteration will be applied
   * @param cycleStart - The cycle start of the price on which the price alteration will be applied
   * @param cycleEnd - The cycle end of the price on which the price alteration will be applied
   * @param consumptionValue - The value of the consumption (if provided this will be used instead of cycleStart and cycleEnd)
   * @param isVolumePrice - Flag indicating that the price alteration is calculated to a volume price
   */
  protected getDiscountedPrice(priceAlterations: TmaProductOfferingPrice[], price: number, cycleStart?: number, cycleEnd?: number, consumptionValue?: number, isVolumePrice: boolean = false): number {
    if (!priceAlterations || priceAlterations.length === 0) {
      if (consumptionValue) {
        return price * consumptionValue;
      }

      return price * (cycleEnd - cycleStart + 1);
    }

    if (!cycleStart && !cycleEnd) {
      return this.getDiscountedOtcPrice(priceAlterations, price);
    }

    if (cycleStart <= 0 || (cycleEnd && cycleEnd !== -1 && cycleEnd < cycleStart)) {
      return price;
    }

    if (consumptionValue && consumptionValue < 0) {
      return price;
    }

    if (isVolumePrice) {
      return this.getDiscountedVolumePrice(priceAlterations, price, cycleStart, cycleEnd);
    }

    const uniquePeriodList: { cycleStart: number; cycleEnd: number }[] = this.createPeriodListForDiscounts(cycleStart, cycleEnd, priceAlterations);

    if (!uniquePeriodList || uniquePeriodList.length === 0) {
      if (consumptionValue) {
        return price * consumptionValue;
      }

      return price * (cycleEnd - cycleStart + 1);
    }

    let discountedPrice = 0;
    uniquePeriodList.forEach((uniquePeriod: { cycleStart: number; cycleEnd: number }) => {
      const applicablePriceAlterations: TmaProductOfferingPrice[] = this.getApplicablePriceAlterations(uniquePeriod.cycleStart, uniquePeriod.cycleEnd, priceAlterations);

      if (!applicablePriceAlterations || applicablePriceAlterations.length === 0) {
        if (consumptionValue) {
          discountedPrice += price * consumptionValue;
          return;
        }

        discountedPrice += price * (uniquePeriod.cycleEnd - uniquePeriod.cycleStart + 1);
        return;
      }

      let tempPrice = price;
      applicablePriceAlterations.forEach((priceAlteration: TmaProductOfferingPrice) => {
        if (tempPrice <= 0) {
          return;
        }

        if (priceAlteration.isPercentage) {
          tempPrice -= tempPrice * Number(priceAlteration.price.value) / 100;
          return;
        }

        tempPrice -= Number(priceAlteration.price.value);
      });

      if (consumptionValue) {
        discountedPrice += tempPrice * consumptionValue;
        return;
      }

      discountedPrice += tempPrice * (uniquePeriod.cycleEnd - uniquePeriod.cycleStart + 1);
    });

    return discountedPrice > 0 ? discountedPrice : 0;
  }

  /**
   * Returns the value of the one time charge price with price alterations applied based on the provided parameters.
   *
   * @param priceAlterations - The list of price alterations
   * @param price -  The price on which the price alterations will be applied
   */
  protected getDiscountedOtcPrice(priceAlterations: TmaProductOfferingPrice[], price: number): number {
    priceAlterations.forEach((priceAlteration: TmaProductOfferingPrice) => {
      if (price <= 0) {
        return;
      }

      if (priceAlteration.isPercentage) {
        price -= price * Number(priceAlteration.price.value) / 100;
        return;
      }

      price -= Number(priceAlteration.price.value);
    });

    return price > 0 ? price : 0;
  }

  /**
   * Returns the value of the volume price with price alterations applied based on the provided parameters.
   *
   * @param priceAlterations - The list of price alterations
   * @param price - The price value on which the price alteration will be applied
   * @param cycleStart - The cycle start of the price on which the price alteration will be applied
   * @param cycleEnd - The cycle end of the price on which the price alteration will be applied
   */
  protected getDiscountedVolumePrice(priceAlterations: TmaProductOfferingPrice[], price: number, cycleStart: number, cycleEnd: number): number {
    priceAlterations.forEach((priceAlteration: TmaProductOfferingPrice) => {
      if (price <= 0 || !priceAlteration.cycle || !priceAlteration.cycle.cycleStart) {
        return;
      }

      if ((!cycleEnd || cycleEnd === -1) && (priceAlteration.cycle.cycleEnd || priceAlteration.cycle.cycleEnd !== -1)) {
        return;
      }

      if (cycleStart < priceAlteration.cycle.cycleStart || (priceAlteration.cycle.cycleEnd && priceAlteration.cycle.cycleEnd !== -1 && cycleEnd > priceAlteration.cycle.cycleEnd)) {
        return;
      }

      if (priceAlteration.isPercentage) {
        price -= price * Number(priceAlteration.price.value) / 100;
        return;
      }

      price -= Number(priceAlteration.price.value);
    });

    return price > 0 ? price : 0;
  }

  /**
   * @deprecated since 2.1
   */
  protected getRecurringChargesUnsorted(price: TmaProductOfferingPrice): TmaProductOfferingPrice[] {
    return price && price.bundledPop ?
      price.bundledPop.filter((bundledPop: TmaProductOfferingPrice) => bundledPop.chargeType === TmaPopChargeType.RECURRING) : [];
  }

  protected getOtcPrice(price: TmaProductOfferingPrice): number {
    if (price && price.price && price.price.value) {
      return Number(price.price.value);
    }

    const oneTimeCharges: TmaProductOfferingPrice[] = this.getOneTimeCharges(price);
    if (price && oneTimeCharges && oneTimeCharges.length !== 0) {
      return Number(oneTimeCharges[0].price.value);
    }

    return 0;
  }

  protected getBillingFrequency(billingEvent: string): number {
    if (!billingEvent) {
      return 1;
    }

    const billingFrequency: TmaBillingFrequencyMap = this.billingFrequencyConfig.billingFrequency
      .find((frequency: TmaBillingFrequencyMap) => frequency.key === billingEvent);

    if (billingFrequency) {
      return billingFrequency.value;
    }

    return 1;
  }

  /**
   * Returns the consumption included in the product offering.
   *
   * @param price - The price of the product offering
   * @param product - The product offering
   * @return The consumption included in the plan
   */
  protected getConsumptionIncludedInPlan(price: TmaProductOfferingPrice, product: TmaProduct): number {
    const unitOfMeasure: string = this.getUsageUnit(price);
    const pscvWithMatchingUnitOfMeasure: TmaProductSpecificationCharacteristicValue = product && product.productSpecCharValues ?
      product.productSpecCharValues.find((pscv: TmaProductSpecificationCharacteristicValue) => pscv.unitOfMeasure === unitOfMeasure) :
      null;
    return pscvWithMatchingUnitOfMeasure ? Number(pscvWithMatchingUnitOfMeasure.value) : 0;
  }

  /**
   * Returns the first usage unit found on the prices.
   *
   * @param price - The price which will be searched for the usage unit
   * @return The usage unit
   */
  protected getUsageUnit(price: TmaProductOfferingPrice): string {
    if (!price || !price.bundledPop || price.bundledPop.length === 0) {
      return null;
    }

    const priceWithUnitOfMeasure: TmaProductOfferingPrice = price.bundledPop.find((childPrice: TmaProductOfferingPrice) => childPrice.usageUnit);
    if (priceWithUnitOfMeasure) {
      return priceWithUnitOfMeasure.usageUnit.id;
    }

    let unitOfMeasure: string = null;
    price.bundledPop.forEach((childPrice: TmaProductOfferingPrice) => {
      if (unitOfMeasure || !childPrice.bundledPop || childPrice.bundledPop.length === 0) {
        return;
      }

      unitOfMeasure = this.getUsageUnit(childPrice);
    });

    return unitOfMeasure;
  }

  protected compare(n1: number, n2: number): number {
    const comparisonResult = n1 < n2 ? -1 : 1;
    return n1 === n2 ? 0 : comparisonResult;
  }

  protected groupBy(list: any[], field: string): any {
    return list.reduce(function (l: any[], f: string) {
      const fieldValue = f[field];
      l[fieldValue] = l[fieldValue] || [];
      l[fieldValue].push(f);
      return l;
    }, {});
  }

  protected calculatePriceWithDiscounts(price: number, discountCharges: TmaProductOfferingPrice[]): number {
    let discountPrice = price;
    if (discountCharges.find((charge: TmaProductOfferingPrice) => charge.cycle) === undefined) {
      discountCharges.forEach((discount: TmaProductOfferingPrice) => {
        discountPrice = this.calculatePriceWithDiscount(discountPrice, discount);
      });
    }
    return discountPrice;
  }

  protected calculatePriceWithDiscount(price: number, discountCharge: TmaProductOfferingPrice): number {
    let calculatedPrice: number;
    if (discountCharge.isPercentage) {
      calculatedPrice = Number(price) * (1 - (Number(discountCharge.price.value) / 100));
    }
    else {
      calculatedPrice = Number(price) - Number(discountCharge.price.value);
    }
    return calculatedPrice;
  }

  protected flattenPriceTreeWithDiscount(price: TmaProductOfferingPrice, parent: TmaProductOfferingPrice, priceAlterations: TmaProductOfferingPrice[]): void {
    if (!price) {
      return;
    }

    if (!price.bundledPop || price.bundledPop.length === 0) {
      price.alterations = price.alterations.filter(
        (alteration: TmaProductOfferingPrice) =>
          alteration.billingEvent === price.billingEvent
      );
      this.allPrices.push(price);
      return;
    }

    const productOfferingPrices = price.bundledPop.filter(
      (bundledPop: TmaProductOfferingPrice) =>
        bundledPop.chargeType === undefined ||
        bundledPop.chargeType !== TmaPopChargeType.DISCOUNT
    );

    const alterations = price.bundledPop.filter(
      (bundledPop: TmaProductOfferingPrice) =>
        bundledPop.chargeType === TmaPopChargeType.DISCOUNT
    );

    const newAlterations = alterations.concat(priceAlterations);

    productOfferingPrices.forEach((pop: TmaProductOfferingPrice) => {
      const popCopy = Object.assign({}, parent ? { ...pop, ...parent } : pop);
      popCopy.alterations = newAlterations;
      const popParent = pop.bundledPop && pop.bundledPop.length !== 0 ? Object.assign({}, pop) : null;

      if (pop.bundledPop) {
        popCopy.bundledPop = pop.bundledPop;
      }

      if (popParent) {
        popParent.bundledPop = null;
      }

      if (pop.chargeType !== TmaPopChargeType.DISCOUNT) {
        this.flattenPriceTreeWithDiscount(popCopy, popParent, popCopy.alterations);
      }
    });
  }

  protected getContractTermDurationInMonths(contractTerm: TmaProductOfferingTerm): number {
    if (!contractTerm || !contractTerm.duration) {
      return 1;
    }

    if (!contractTerm.duration.units) {
      return contractTerm.duration.amount ? contractTerm.duration.amount : 1;
    }

    if (!contractTerm.duration.amount) {
      return this.getBillingFrequency(contractTerm.duration.units);
    }

    return contractTerm.duration.amount * this.getBillingFrequency(contractTerm.duration.units);
  }

  private getApplicablePriceAlterations(cycleStart: number, cycleEnd: number, priceAlterations: TmaProductOfferingPrice[]): TmaProductOfferingPrice[] {
    if (!priceAlterations || priceAlterations.length === 0) {
      return [];
    }

    return priceAlterations.filter((priceAlteration: TmaProductOfferingPrice) =>
      priceAlteration && priceAlteration.cycle && priceAlteration.cycle.cycleStart && priceAlteration.cycle.cycleStart > 0 &&
      priceAlteration.cycle.cycleStart <= cycleStart &&
      (!priceAlteration.cycle.cycleEnd || priceAlteration.cycle.cycleEnd === -1 || priceAlteration.cycle.cycleEnd >= cycleEnd)
    );
  }

  private createPeriodListForDiscounts(cycleStart: number, cycleEnd: number, priceAlterations: TmaProductOfferingPrice[]): { cycleStart: number; cycleEnd: number }[] {
    let uniquePeriodList: { cycleStart: number; cycleEnd: number }[] = [];

    let newCycleEnd: number = cycleEnd;
    priceAlterations
      .map((priceAlteration: TmaProductOfferingPrice) => priceAlteration.cycle.cycleStart)
      .forEach((start: number) => {
        if (start < newCycleEnd && start > cycleStart) {
          newCycleEnd = start;
        }
      });

    if (newCycleEnd === cycleEnd) {
      uniquePeriodList = uniquePeriodList.concat(this.breakUpGroupsByCycleEnd(cycleStart, newCycleEnd, priceAlterations));
      return uniquePeriodList;
    }

    uniquePeriodList = uniquePeriodList.concat(this.breakUpGroupsByCycleEnd(cycleStart, newCycleEnd - 1, priceAlterations));
    uniquePeriodList = uniquePeriodList.concat(this.createPeriodListForDiscounts(newCycleEnd, cycleEnd, priceAlterations));

    return uniquePeriodList;
  }

  private breakUpGroupsByCycleEnd(cycleStart: number, cycleEnd: number, priceAlterations: TmaProductOfferingPrice[]): { cycleStart: number; cycleEnd: number }[] {
    let uniquePeriodList: { cycleStart: number; cycleEnd: number }[] = [];

    if (cycleStart === cycleEnd) {
      uniquePeriodList.push({ cycleStart: cycleStart, cycleEnd: cycleEnd });
      return uniquePeriodList;
    }

    let newCycleEnd: number = cycleEnd;
    priceAlterations
      .map((priceAlteration: TmaProductOfferingPrice) => priceAlteration.cycle.cycleEnd)
      .forEach((end: number) => {
        if (end >= cycleStart && end < cycleEnd && end < newCycleEnd) {
          newCycleEnd = end;
        }
      });

    uniquePeriodList.push({ cycleStart: cycleStart, cycleEnd: newCycleEnd });

    if (newCycleEnd === cycleEnd) {
      return uniquePeriodList;
    }

    uniquePeriodList = uniquePeriodList.concat(this.breakUpGroupsByCycleEnd(newCycleEnd + 1, cycleEnd, priceAlterations));

    return uniquePeriodList;
  }

  private populateStandalonePrices(
    eligibleContext: TmaPriceContext[],
    price: TmaProductOfferingPrice
  ): TmaProductOfferingPrice {
    let productOfferingPrice: TmaProductOfferingPrice;
    eligibleContext.forEach((priceContext: TmaPriceContext) => {
      if (priceContext.productOfferingPrice.id === price.id) {
        productOfferingPrice = price;
      }
    });
    return productOfferingPrice;
  }

  private getPopFor(
    termId: string,
    pop: TmaProductOfferingPrice
  ): TmaProductOfferingPrice {
    let productOfferingPrice: TmaProductOfferingPrice;
    pop.productOfferingTerm.forEach((term: TmaProductOfferingTerm) => {
      if (term.id === termId) {
        productOfferingPrice = pop;
      }
    });
    return productOfferingPrice;
  }
}
