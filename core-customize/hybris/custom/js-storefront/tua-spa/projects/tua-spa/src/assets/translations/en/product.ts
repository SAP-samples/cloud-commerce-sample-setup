// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

export const product = {
  productDetails: {
    id: 'ID',
    averageCost: 'Average Cost',
    year: 'year',
    month: 'month',
    contractTerm: 'Contract Term',
    cancellationFee: 'Cancellation Fee',
    onetimeFees: 'One-time Fees',
    payNowPrices: 'Pay Now',
    onFirstBillPrices: 'On First Bill',
    recurringPrices: 'Recurring Prices',
    usageChargePrices: 'Charge Prices',
    overage: 'Overage',
    months: 'Months',
    costEstimationWarningMessage: 'The average cost can properly be determined only for prices that have a single usage unit!',
    loginNeeded: 'Please login to proceed with add to cart.',
    price: {
      contractDuration: 'Contract Duration',
      multipleContractTerms: 'Offer is available for multiple contract durations.',
      common: {
        usage_charge_cost: 'cost per {{unit}}',
        off: 'OFF',
        fixedDiscount: '-{{price}} {{currency}} OFF',
        percentageDiscount: '-{{price}} % OFF',
        hierarchical_price: 'Hierarchical Price',
        from: 'From',
        to: 'to',
        upTo: 'up to',
        onwards: 'onwards',
        each: 'each',
        discount: 'You Save',
        applicableDiscount: 'Discounts / ',
        for: 'for',
        newItemPrice: "New Item Price"
      },
      priceTypes: {
        payNow: 'Pay Now',
        recurringCharges: 'Recurring Charges',
        billingEvents: {
          billingEvent_paynow: 'On Checkout',
          billingEvent_oncancellation: 'On Cancellation',
          billingEvent_onfirstbill: 'On First Bill',
          billingEvent_monthly: 'monthly',
          billingEvent_yearly: 'yearly',
          billingEvent_quarterly: 'quarterly',
          oneTime: 'Pay Now',
          oneTime_paynow: 'Pay Now',
          oneTime_oncancellation: 'cancellation',
          oneTime_onfirstbill: 'first bill fee'
        },
        oneTimeFees: 'One Time Fees',
        usageCharges: 'Usage Charges'
      },
      recurringCharges: {
        forFirst: 'for first',
        forNext: 'for next',
        forLast: 'for last',
        month: '{{count}} month',
        month_plural: '{{count}} months',
        billingFrequency: {
          abbreviation: 'mo',
          abbreviation_month: 'mo',
          abbreviation_monthly: 'mo',
          abbreviation_year: 'yr',
          abbreviation_yearly: 'yr',
          abbreviation_annual: 'yr',
          abbreviation_annually: 'yr',
          abbreviation_quarter: 'qr',
          abbreviation_quarterly: 'qr'
        }
      },
      usageCharge: {
        charges: {
          charge: 'Charges',
          charge_each_respective_tier: 'Charges',
          charge_highest_applicable_tier: 'Charged By'
        },
        usageTypes: {
          usageType_each_respective_tier: 'Charged By Each Respective Tier',
          usageType_highest_applicable_tier: 'Charged By Highest Applicable Tier',
          usageType: 'Each Respective Tier'
        },
        perUnit: 'Per Unit',
        perVolume: 'Per Volume'
      }
    },
    productSpecificCharacteristics: {
      selectBetweenMinAndMax: 'Please select at least {{min}} and at most {{max}} values.',
      selectAtLeast: 'Please select at least {{min}} values.',
      mandatoryField: 'Mandatory field',
      mandatoryFieldValues: 'Please select {{quantity}} values'
    }
  },
  productList: {
    viewDetails: 'View Details',
    viewDetailedPrices: 'View Detailed Prices',
    averageCostBaseOnConsumption: 'Average cost based on your consumption',
    updateConsumption: 'Update Your Consumption',
    seeDetails: 'See Details',
    title_Gas: 'Great Mixed {{productName}} Saving Plan {{consumption}} Cubic meter',
    title_Electricity: 'Great Mixed {{productName}} Saving Plan {{consumption}} KWh',
    perMonthWithOutDiscount: '/month without Bonus',
    perMonth: '/month',
    perYear: '/year',
    MonthlyFee: 'Monthly Fee:',
    UsageCharge: 'Usage Charge:',
    UsagePrice: 'Usage Price:',
    RegularPrice: 'Regular Price:',
    AnnualCharge: 'Annual Charge:',
    BaseCharge: 'Base Charge:',
    MonthlyBaseCharge: 'Monthly Base Charge:',
    withoutBonus: 'without Bonus',
    withBonus: 'with Bonus',
    bonus: 'Bonus',
    viewMore: 'View More',
    priceDetails: 'Price Details:',
    additionalCharges: 'Additional Charges:',
    oneTimeOnly: '(one time only)'
  },
  TabPanelContainer: {
    tabs: {
      ProductIncludedServicesTabComponent: 'Included Products and Services'
    }
  }
};
