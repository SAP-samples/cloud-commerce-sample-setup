// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved
import { LOCAL_STORAGE } from '../../../util';
import { TmfConfig } from '../../config/tmf-config';

const { LOCALHOST } = LOCAL_STORAGE.HTTP_LINKS;

export const defaultTmfProductOfferingQualificationConfig: TmfConfig = {
    backend: {
        tmf: {
            endpoints: {
                getProductOfferingQualification: {
                    baseUrl: LOCALHOST,
                    prefix: '/productqualificationtmfwebservices',
                    version: '/v1',
                    endpoint: '/productOfferingQualification'
                }
            }
        }
    }
}
