// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

export const DEFAULT_SCOPE = 'default';

/**
 * Structure for Tmf Appointment endpoint
 */
export interface TmfAppointmentEndpoint {
  baseUrl?: string;
  prefix?: string;
  endpoint?: string | TmfAppointmentEndpointWithScope;
}

/**
 * Structure for Tmf Appointment endpoint with scope
 */
export interface TmfAppointmentEndpointWithScope {
  default?: string;
  [scope: string]: string | undefined;
}

/**
 * Structure for Tmf Appointment endpoints
 */
export interface TmfAppointmentEndpointMap {
  [id: string]: TmfAppointmentEndpoint;
}
