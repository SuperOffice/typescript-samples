import { WebApi } from "@superoffice/webapi";
import { SystemUser } from '@superoffice-ts-samples/systemuserservice/src/service';

async function getContactEntityAsync(contactId: number): Promise<void> {
    const contactAgent = webApi.getContactAgent();
    const contactEntity = await contactAgent.getContactAsync(contactId);
    console.log(contactEntity.name);
}

// Helper functions to generate random values
function randomCategory(): string {
    const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const rnd = Math.floor(Math.random() * ids.length);
    return ids[rnd].toString();
}

function randomBusiness(): string {
    const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const rnd = Math.floor(Math.random() * ids.length);
    return ids[rnd].toString();
}

function randomCountry(): string {
    const ids = [208, 203, 191, 250, 276, 300, 52, 36, 4, 246, 352];
    const rnd = Math.floor(Math.random() * ids.length);
    return ids[rnd].toString();
}

async function insertIntoDatabaseTableAsync(): Promise<void>{
    const databaseTableAgent = webApi.getDatabaseTableAgent();

    // Define table columns (non-nullable columns)
    const columns: string[] = ["name", "country_id", "business_idx", "category_idx"];

    // Define data
    const data: string[][] = [
        ["Red", randomCountry(), randomBusiness(), randomCategory()],
        ["Orange", randomCountry(), randomBusiness(), randomCategory()],
        ["Yellow", randomCountry(), randomBusiness(), randomCategory()],
        ["Green", randomCountry(), randomBusiness(), randomCategory()],
        ["Blue", randomCountry(), randomBusiness(), randomCategory()],
        ["Indigo", randomCountry(), randomBusiness(), randomCategory()],
        ["Violet", randomCountry(), randomBusiness(), randomCategory()],
    ];

    const result = await databaseTableAgent.insertAsync("contact", columns, data);
    console.log("The operation returned " + result.success);
}


const systemUserTicketService = new SystemUser.Service({
  systemUserToken: 'SystemUserApp-iOTr...',
  privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIICWAIBAAKBgNbuf6aRDWQbXWPg9JG7rzFTldtgICJBmSowF1580mkLb53BexRc
Z+HY3/qRET+8MOJK0zAHTfDogvrOr4zQOwPCjrxtUCVROpDtcSWDdQgk0fn6AGa5
zfVmMRqRZQO7brEYL
8tat21lamFhew4c+bz2tcPhGTtY0ktDHvcbyqA==
-----END RSA PRIVATE KEY-----`,
  environment: SystemUser.types.Environment.SOD,
  clientSecret: '13f2132133b77f7',
  contextIdentifier: 'Cust1337',
});

let webApi = new WebApi("https://sod.superoffice.com/Cust1337/api"); //This could/should either be fetched from the jwt during systemuser flow, or updated through the state endpoint
webApi.applicationToken("13f2132133b77f7"); //Client secret

async function main() {
    try {
        const ticket = await systemUserTicketService.getSystemUserTicket();
        console.log('System User Ticket:', ticket);

        webApi.authenticateWithTicket(ticket);
        await getContactEntityAsync(4)
        //insertIntoDatabaseTableAsync(); This will create some dummy-companies in the database. Commented out to prevent accidently creating a lot of companies.

    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  main().then(() => console.log('Done'));

