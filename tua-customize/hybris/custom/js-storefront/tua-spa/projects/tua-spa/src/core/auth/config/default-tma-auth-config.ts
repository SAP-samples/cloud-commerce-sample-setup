// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { AuthConfig } from '@spartacus/core';

export const defaultTmaAuthConfig: AuthConfig = {
  authentication: {
    client_id: 'trusted_client',
    client_secret: 'secret',
    tokenEndpoint: '/oauth/token',
    revokeEndpoint: '/oauth/revoke',
    loginUrl: '/oauth/authorize',
    OAuthLibConfig: {
      scope: '',
      customTokenParameters: ['token_type'],
      strictDiscoveryDocumentValidation: false,
      skipIssuerCheck: true,
      disablePKCE: true,
      oidc: false,
      clearHashAfterLogin: false,
    },
  },
};
