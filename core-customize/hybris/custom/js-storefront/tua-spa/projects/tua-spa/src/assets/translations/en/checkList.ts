// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

export const checkList = {
  checkList: {
    appointment: {
      appointment: 'Appointment',
      appointmentDate: 'Appointment date',
      selectAppointmentDate: 'Select an appointment date: ',
      appointmentTime: 'Appointment time',
      selectAppointmentTime: 'Select an appointment time: ',
      headline: 'Please select an Appointment to proceed ',
      addressHeadline: 'Appointment Address',
      selectAppointment: 'Select an Appointment to proceed',
      timeSlotHeadline:'Appointment Time Slots',
      provideAddress: 'Please provide Appointment Address',
      unselectedDesiredDate: 'Please select a date',
      patchError:
        'Could not update the appointment at this time. Please try again later.',
      getTimeSlots: 'Get Time Slots',
      fetchTimeSlotsError:
      'There is a problem in fetching time slots. Please try again later.',
      timeSlot: {
        timeSlot: 'Time slot',
        noTimeSlotAvailable: 'There are no available time slots at the moment',
        selectTimeSlot: 'Select a time slot'
      },
      loginNeeded: 'Please login to proceed with the appointment.'
    },
    installationAddress: {
      installationAddress: 'Installation Address',
      headline: 'Select suitable details for your installation address',
      selectInstallationAddress: 'Select an Installation Address and Technical ID to proceed',
      serviceDetails: 'Service Details'
    },
    reasonForPurchase: {
      selectReasonForPurchase: 'Select a Reason For Purchase to proceed'
    },
    msisdn: {
      headline: 'Select your desired Phone Number',
      phoneNumber: 'Phone Number',
      selectNumber: 'Please select MSISDN'
    },
    errorMessage: {
      checklistActionsNotFullFiled: 'You need to complete the {{ sentence }} actions before adding the product to the cart.'
    }
  }
};
