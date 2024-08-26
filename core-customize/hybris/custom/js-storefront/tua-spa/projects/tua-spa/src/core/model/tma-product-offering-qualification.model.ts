import { TmaTmfProduct } from './tma-product.model';

export interface TmaEligibilityUnavailabilityReason {
  code: string;
  label: string;
}

export interface TmaQualificationItemRelationship {
  id: string;
  relationshipType: string;
}

export interface TmaProductOfferingQualificationItem {
  id: string;
  action: string;
  product?: TmaTmfProduct;
  qualificationItemRelationship?: TmaQualificationItemRelationship[];
  eligibilityUnavailabilityReason?: TmaEligibilityUnavailabilityReason[];
  productOffering: TmaTmfProduct;
}

export interface TmaProductOfferingQualification {
  '@type'?: string;
  '@baseType'?: string;
  '@schemaLocation'?: string;
  id?: string;
  href?: string;
  productOfferingQualificationItem?: TmaProductOfferingQualificationItem[];
}

export interface TmaQualificationMessage {
  code?: string,
  label?: string
}
