import * as crypto from 'crypto';
import * as jose from 'jose';
import { SystemUserServiceTypes } from './types';

export namespace SystemUser {
    export import types = SystemUserServiceTypes;

    export class Service {
        private systemUserToken: string;
        private privateKey: string;
        private environment: SystemUserServiceTypes.Environment;
        private clientSecret: string;
        private contextIdentifier: string;
      
      
        constructor({ systemUserToken, privateKey, environment, clientSecret, contextIdentifier }: SystemUserServiceTypes.SystemUserTokenParams) {
          this.systemUserToken = systemUserToken;
          this.privateKey = privateKey;
          this.environment = environment;
          this.clientSecret = clientSecret;
          this.contextIdentifier = contextIdentifier;
        }
      
      
        /**
         * Generates a signed System User Token for the current timestamp.
         */
        private generateSignedToken(): string {
          const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 12); // YYYYMMDDHHmm
          const tokenWithTimestamp = `${this.systemUserToken}.${timestamp}`;
          const signature = crypto.createSign('RSA-SHA256');
          signature.update(tokenWithTimestamp);
          const signedToken = signature.sign(this.privateKey, 'base64');
          return `${tokenWithTimestamp}.${signedToken}`;
        }
      
       /**
         * Validates the JWT using the JWKS endpoint obtained from the OpenID Connect configuration.
         */
        private async validateJwt(jwt: string): Promise<void> {
          try {
            const jwksUri = `https://${this.environment}.superoffice.com/Login/.well-known/jwks`;
            
            // Use fetch to get the JWKS data
            const response = await fetch(jwksUri);
            if (!response.ok) {
              throw new Error(`Failed to fetch JWKS: ${response.status} ${response.statusText}`);
            }      
            // Create a remote JWK set
            const keyStore = jose.createRemoteJWKSet(new URL(jwksUri));
      
            // Validate the JWT
            await jose.jwtVerify(jwt, keyStore);
            console.log('JWT validation successful');
          } catch (error: unknown) {
            if (error instanceof Error) {
              throw new Error(`JWT validation failed: ${error.message}`);
            } else {
              throw new Error('JWT validation failed: Unknown error');
            }
          }
        }
      
      
        /**
         * Requests the System User Ticket by signing the token and calling the SuperOffice PartnerSystemUser endpoint.
         */
        async getSystemUserTicket(): Promise<string> {
          try {
              const signedToken = this.generateSignedToken();
              const partnerSystemUserEndpoint = `https://${this.environment}.superoffice.com/Login/api/PartnerSystemUser/Authenticate`;
      
              const response = await fetch(partnerSystemUserEndpoint, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      Accept: 'application/json',
                  },
                  body: JSON.stringify({
                      SignedSystemToken: signedToken,
                      ApplicationToken: this.clientSecret,
                      ContextIdentifier: this.contextIdentifier,
                      ReturnTokenType: 'JWT',
                  }),
              });
      
              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
              }

             // Parse response JSON
            const responseData: SystemUserServiceTypes.TicketResponse = await response.json();
            const jwt: string = responseData.Token;

            // Validate the JWT
            await this.validateJwt(jwt);
      
            // Decode the JWT and extract the System Ticket
            const systemUserJwt = jose.decodeJwt(jwt);
            const ticket = systemUserJwt[SystemUserServiceTypes.Claims.SystemTicket] as string;
            return ticket;
          } catch (error: unknown) {
            if (error instanceof Error) {
              throw new Error(`Failed to obtain System User Ticket: ${error.message}`);
            } else {
              throw new Error('Failed to obtain System User Ticket: Unknown error');
            }
          }
        }
      }
    
}