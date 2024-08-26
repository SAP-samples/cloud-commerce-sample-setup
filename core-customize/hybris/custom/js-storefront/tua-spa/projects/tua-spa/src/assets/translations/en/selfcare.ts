// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

export const selfcare = {
  selfcare: {
    subscriptions: {
      title: 'Subscription details',
      name: 'Name',
      status: 'Status',
      id: 'Id',
      enabled: 'Active',
      disabled: 'Disabled',
      statusDetails:{
        active : 'Active',
        terminated : 'Terminated',
        pendingTerminate : 'Pending Terminate'
      },
      details: {
        serialNumber: 'Serial Number',
        duration: 'Contract Duration',
        price: 'Price',
        contract: 'Contract',
        startDate: 'Start date:',
        expiresOn: 'Expires on:',
        childProducts: {
          title: 'Child Products',
          subtitle: ''
        },
        account: {
          title: 'Billing Account',
          subtitle: '',
          emptyList: 'No account found'
        },
        agreement: {
          title: 'Billing Agreement',
          subtitle: '',
          emptyList: 'No agreement found.'
        },
        order: {
          title: 'Order Number',
          subtitle: '',
          emptyList: 'No order found'
        },
        address: {
          title: 'Address',
          subtitle: '',
          emptyList: 'No address found'
        }
      }
    },
    billingAccounts: {
      name: 'Name',
      title: 'Billing Account Details',
      subtitle: '',
      accountType: 'Type',
      paymentStatus: 'Status',
      id: 'Id',
      paid: 'Paid',
      due: 'Due',
      details: {
        accountType: 'Account Type',
        paymentStatus: 'Payment Status',
        ratingType: 'Rating Type',
        accountBalance: {
          title: 'Account Balance',
          subtitle: '',
          emptyList: 'Account not found',
          details: {
            title: 'Account Balance Details',
            subtitle: '',
            type: 'Balance Type',
            amount: 'Amount',
            validPeriod: 'Valid Period',
            startDate: 'Start Date',
            endDate: 'Expires on',
            emptyList: 'Account not found'
          }
        },
        billStructure: {
          title: 'Bill Structure',
          subtitle: '',
          emptyList: 'Bill Structure not found',
          details: {
            title: 'Bill Structure',
            subtitle: '',
            name: 'Name',
            id: 'Id',
            validPeriod: 'Valid Period',
            billingFrequency: 'Billing Frequency',
            startDate: 'Start Date',
            billFormat: 'Bill Format'
          }
        },
        contact: {
          title: 'Contact',
          subtitle: '',
          emptyList: 'Contact not found',
          details: {
            title: 'Contact Details',
            subtitle: '',
            phoneNumber: 'Phone Number',
            email: 'Email',
            address: 'Address',
            emptyList: 'Contact not found'
          }
        },
        creditLimit: {
          title: 'Credit Limit',
          subtitle: '',
          emptyList: 'Credit Limit not found'
        },
        paymentPlan: {
          title: 'Payment Plan',
          subtitle: '',
          emptyList: 'Payment Plan not found',
          details: {
            title: 'Payment Plan Details',
            subtitle: '',
            paymentFrequency: 'Payment Frequency',
            noOfPayments: 'Number of Payments',
            status: 'Status',
            totalAmount: 'Total Amount',
            emptyList: 'Payment Plan not found'
          }
        },
        relatedParty: {
          title: 'Related Party',
          subtitle: '',
          emptyList: 'Related Party not found'
        }
      }
    },
    billingAgreements: {
      name: 'Name',
      title: 'Billing Agreement Details',
      subtitle: '',
      agreementType: 'Type',
      status: 'Status',
      id: 'Id',
      description: 'Description',
      commercial: 'Commercial',
      approved: 'Approved',
      unapproved: 'Unapproved',
      details: {
        agreementType: 'Agreement Type',
        documentNumber: 'Document Number',
        agreementPeriod: 'Agreement Period',
        statementOfIntent: 'Statement of Intent',
        startDate: 'Start date:',
        expiresOn: 'Expires on:',
        agreementItem: {
          title: 'Agreement Item',
          subtitle: '',
          emptyList: 'Agreement Item not found'
        },
        agreementSpecification: {
          title: 'Agreement Specification',
          subtitle: '',
          emptyList: 'Agreement Specification not found'
        },
        engagedParty: {
          title: 'Engaged Party',
          subtitle: '',
          emptyList: 'Engaged Party not found'
        },
        agreementSpecificationDetails: {
          title: 'Agreement Specification Details',
          subtitle: '',
          emptyList: 'Agreement Specification Details not found'
        }
      }
    },
    customerBills: {
      id: 'Id',
      title: 'Bill Details',
      number: 'Number',
      nextBillDate: 'Next Bill Date',
      paymentDueDate: 'Due Date',
      amountDue: 'Amount Due',
      subtitle: '',
      category: 'Category',
      state: 'State',
      billNo: 'Number',
      new: 'New',
      onHold: 'On Hold',
      validated: 'Validated',
      sent: 'Sent',
      settled: 'Settled',
      partiallyPaid: 'Partially Paid',
      noState: 'No State',
      details: {
        account: {
          title: 'Billing Account',
          subtitle: '',
          emptyList: 'No account found'
        },
        billDocument: {
          title: 'Bill Documents',
          subtitle: '',
          emptyList: 'No bill document found',
          name: 'Name',
          id: 'ID',
          description: 'Description',
          details: {
            title: 'Bill Document Details',
            subtitle: ''
          }
        },
        relatedParty: {
          title: 'Related Party',
          subtitle: '',
          emptyList: 'Related Party not found'
        }
      }
    }
  }
};
