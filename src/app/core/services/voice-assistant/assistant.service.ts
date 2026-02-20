import {effect, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssistantService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  calendarProcessing: WritableSignal<boolean> = signal(false);
  bookingProcessing: WritableSignal<boolean> = signal(false);
  priceInquiryProcessing: WritableSignal<boolean> = signal(false);
  serviceInfoProcessing: WritableSignal<boolean> = signal(false);
  cancelAppointmentProcessing: WritableSignal<boolean> = signal(false);
  rescheduleAppointmentProcessing: WritableSignal<boolean> = signal(false);
  handoffToHumanProcessing: WritableSignal<boolean> = signal(false);
  requestsLimit: WritableSignal<number | undefined> = signal(undefined);

  public systems = [
    {
      title: 'Calendar',
      key: 'calendar',
      description: 'Appointment scheduling',
      active: false,
      status: 'Idle ...',
    },
    {
      title: 'CRM SYSTEM',
      description: 'Client Information database.',
      key: 'booking',
      active: false,
      status: 'Idle ...',
    },
    // {
    //   title: 'Data base',
    //   description: 'provides data for your needs.',
    //   key: '',
    //   active: false,
    //   status: 'Idle ...',
    // },
    {
      title: 'Price List Data',
      description: 'provides prices for services.',
      key: 'price_inquiry',
      active: false,
      status: 'Idle ...',
    },
    {
      title: 'Services Database',
      description: 'provides list of services.',
      key: 'service_info',
      active: false,
      status: 'Idle ...',
    },
    {
      title: 'Cancel appointment',
      description: 'cancels an appointment.',
      key: 'cancel_appointment',
      active: false,
      status: 'Idle ...',
    },
    {
      title: 'Reschedule appointment',
      description: 'reschedules an appointment.',
      key: 'reschedule_appointment',
      active: false,
      status: 'Idle ...',
    },
    {
      title: 'Transfer call to manager',
      description: 'hands off to a human.',
      key: 'handoff_to_human',
      active: false,
      status: 'Idle ...',
    },
    {
      title: 'Other or Unknown',
      description: 'Other - Unrelated inquiries.',
      key: 'other',
      active: false,
      status: 'Idle ...',
    },
  ];

  constructor() {
    effect(() => {
      const calendarIndex = this.systems.findIndex(system => system.key === 'calendar')
      this.systems[calendarIndex].active = this.calendarProcessing();

      const bookingIndex = this.systems.findIndex(system => system.key === 'booking')
      this.systems[bookingIndex].active = this.bookingProcessing();

      const priceInquiryIndex = this.systems.findIndex(system => system.key === 'price_inquiry')
      this.systems[priceInquiryIndex].active = this.priceInquiryProcessing();

      const serviceInfoIndex = this.systems.findIndex(system => system.key === 'service_info')
      this.systems[serviceInfoIndex].active = this.serviceInfoProcessing();

      const cancelAppointmentIndex = this.systems.findIndex(system => system.key === 'cancel_appointment')
      this.systems[cancelAppointmentIndex].active = this.cancelAppointmentProcessing();

      const rescheduleAppointmentIndex = this.systems.findIndex(system => system.key === 'reschedule_appointment')
      this.systems[rescheduleAppointmentIndex].active = this.rescheduleAppointmentProcessing();

      const handoffToHumanIndex = this.systems.findIndex(system => system.key === 'handoff_to_human')
      this.systems[handoffToHumanIndex].active = this.handoffToHumanProcessing();
    });
  }

  getLimits(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/automation/calls`)
  }
}
