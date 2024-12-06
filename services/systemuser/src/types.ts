export namespace SystemUserServiceTypes {
    // Enums
    export enum Claims {
      CompanyName = 'http://schemes.superoffice.net/identity/company_name',
      IdentityProvider = 'http://schemes.superoffice.net/identity/identityprovider',
      Email = 'http://schemes.superoffice.net/identity/email',
      Upn = 'http://schemes.superoffice.net/identity/upn',
      Ctx = 'http://schemes.superoffice.net/identity/ctx',
      IsAdmin = 'http://schemes.superoffice.net/identity/is_administrator',
      Serial = 'http://schemes.superoffice.net/identity/serial',
      NetServerUrl = 'http://schemes.superoffice.net/identity/netserver_url',
      WebApiUrl = 'http://schemes.superoffice.net/identity/webapi_url',
      SystemToken = 'http://schemes.superoffice.net/identity/system_token',
      SystemTicket = 'http://schemes.superoffice.net/identity/ticket',
    }
  
    export enum Environment {
      SOD = 'sod',
      QAONLINE = 'qaonline',
      ONLINE = 'online',
    }
  
    // Types
    export type SystemUserTokenParams = {
      systemUserToken: string;
      privateKey: string;
      environment: Environment;
      clientSecret: string;
      contextIdentifier: string;
    };
  
    // Interfaces
    export interface TicketResponse {
      Token: string;
    }
  }
  