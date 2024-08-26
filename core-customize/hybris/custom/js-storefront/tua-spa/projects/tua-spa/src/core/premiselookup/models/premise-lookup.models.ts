// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

export namespace PremiseLookup {

    /**
     * Premise Lookup - Premise Details
     */
    export interface TmaPremiseDetails {
      premiseAddress?: TmaPremiseAddress;
      serialNumber?: string;
      division?: string;
    }
    /**
     * Premise Lookup - Premise Address
     */
    export interface TmaPremiseAddress {
      streetDetail?: TmaStreetDetails;
      townDetail?: TmaTownDetails;
    }
    /**
     * Premise Lookup - Street Details
     */
    export interface TmaStreetDetails {
      name?: string;
      number?: string;
      suite?: string;
    }
    /**
     * Premise Lookup - Town Details
     */
    export interface TmaTownDetails {
      code?: string;
      country?: string;
      name?: string;
      regionCode?: string;
    }

    /**
     * Premise Lookup - Technical Resource
     */
    export interface TmaPremiseLookupTechnicalResource {
      id?: string;
      type?: TmaPremiseLookupTechnicalResourceType;
    }

    /**
     * Premise Lookup - Technical Resource Types
     */
    export enum TmaPremiseLookupTechnicalResourceType {
      DIVISION = 'DIVISION',
      INSTALLATION = 'INSTALLATION'
    }
  }
