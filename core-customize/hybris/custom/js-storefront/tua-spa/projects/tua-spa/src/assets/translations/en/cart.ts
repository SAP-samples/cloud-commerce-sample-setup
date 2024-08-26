// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

export const cart = {
  cartItems: {
    contractStartDate: 'Service Start Date:',
    meterNo: 'Meter NO',
    meterId: 'Meter ID:',
    subscription: 'Subscription',
    appointmentError: {
      getAppointmentByIdError:
        'There is a problem in fetching appointment details.Please try again later',
      appointmentByIdCartRemoval:
        'Your appointment cannot be displayed. Please remove the cart entry to proceed',
      errorPost: 'Something went wrong. Could not add item to the shopping cart.',
      cancelledAppointmentError:
        'There is a problem with appointment. Please  remove this entry from the cart to proceed.'
    },
    price: {
      common: {
        from: 'From',
        onwards: 'onwards'
      },
      month: 'month',
      months: 'Months',
      payOnCheckoutPrice: 'Pay On Checkout',
      recurringCharges: 'Recurring Charges',
      oneTimeCharges: 'One Time Charges',
      usageCharges: 'Usage Charges',
      billingFrequency: {
        abbreviation_month: 'month',
        abbreviation_monthly: 'month',
        abbreviation_year: 'year',
        abbreviation_yearly: 'year',
        abbreviation_quarter: 'quarter',
        abbreviation_quarterly: 'quarter'
      },
      itemPrice: 'Item Price',
      amountDue: 'Due Now',
      perMonth: 'per month'
    },
    consumption:'Average Consumption',
    itemDetails: 'More details:',
    relyOn: 'Relies on: {{relatedProductName}} subscription',
    relyOnParagraph: 'This product required {{relatedProductName}} plan to purchase. Since you already own a plan, you have chosen to select the following plan:',
    relyOnName: 'Related product name: ',
    relyOnId: 'Id: {{relatedProductName}}',
    relyOnMultipleSubscriptions: 'Relies on multiple subscriptions: ',
    removeItem: 'Remove cart item',
    removeItemSelection: 'Remove item from selection',
    editItem: 'Edit cart item',
    item: 'Item',
    areaCode: 'Area Code: {{postalCode}}',
    annualConsumption: 'Annual Consumption'
  },
  orderCost: {
    toBeDetermined: 'TBD',
    totalPayOnCheckout: 'Total Pay On Checkout',
    totalRecurringCharge: 'Total Recurring Charge:',
    amountDueToday: 'Amount Due Today'
  }
};
