import * as crypto from 'crypto';

interface SystemUserTokenParams {
  systemUserToken: string;
  privateKey: string;
  environment: Environment;
  clientSecret: string;
  contextIdentifier: string;
}

export enum Environment {
  SOD = 'sod',
  QAONLINE = 'qaonline',
  ONLINE = 'online'
}


export class SystemUserTicketService {
  private systemUserToken: string;
  private privateKey: string;
  private environment: Environment;
  private clientSecret: string;
  private contextIdentifier: string;


  constructor({ systemUserToken, privateKey, environment, clientSecret, contextIdentifier }: SystemUserTokenParams) {
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

        const data = await response.json();
        return data.ticket;
    } catch (error) {
        throw new Error(`Failed to obtain System User Ticket: ${error.message}`);
    }
  }
}


// Usage example:
const systemUserTicketService = new SystemUserTicketService({
  systemUserToken: 'yourSystemUserToken',
  privateKey: 'yourRSAPrivateKey',
  environment: Environment.ONLINE,
  clientSecret: 'yourClientSecret',
  contextIdentifier: 'yourCustomerId',
});

systemUserTicketService.getSystemUserTicket()
  .then(ticket => console.log('System User Ticket:', ticket))
  .catch(error => console.error('Error:', error));

