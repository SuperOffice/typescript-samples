# superoffice-ts-samples

This mono repo (through pnpm) contains TypeScript code samples for SuperOffice.
It uses the [@superoffice/webapi](https://www.npmjs.com/package/@superoffice/webapi) to do requests towards the REST API.

`tsconfig.base.json` - This file is inherited by all the projects in the repo. This is done to keep the code consistent across projects in the repo.

`package.json` - Contains the `devDependencies` shared across packages. Also contains scripts that builds each package, for simplicity.

We accept pull requests with new/other code-samples!

## [SystemUserService](./services/systemuser/)

The SystemUserService handles authenticating a systemuser, validate the returned jwt and getting the SOTicket from the claims.
The SOTicket can then be used with the [@superoffice/webapi](https://www.npmjs.com/package/@superoffice/webapi)-package to do requests towards the REST API.

## [mass-operations](./packages/mass-operations/)

This sample-code inserts dummy-data into SuperOffice using the [mass-operations api](https://docs.superoffice.com/en/api/netserver/bulk-operations/mass-operations/index.html).
It requires a valid SOTicket and SO-Apptoken to get access to use the DatabaseTable Agent, togerher with a your api URL.

### How to run

Compile the mass-operations project:
`pnpm run build:mass-operations`
This command will build/compile the `SystemUserService` and `mass-operations`.

You can then use node to run the compiled .js-file:
`pnpm run start:mass-operations`

All of these can be run in each project/package directly, and will only execute the commands defined in each projects package.json.

Please note that the `insertIntoDatabaseTableAsync()`, which actually inserts the data into SuperOffice, is commented out to prevent accidentally creating data in SuperOffice while testing/setting up. The project will `GET` contact with ID and print out the contactName through `await getContactEntityAsync(4)`.

## Quick-start for a new project

If you want to use the SystemUserService you will have to populate the variables for the `SystemUser.Service`.

```typescript
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
```

If you want to use the [@superoffice/webapi](https://www.npmjs.com/package/@superoffice/webapi)-package you will also have to set the webapi client:

```typescript
let webApi = new WebApi("https://sod.superoffice.com/Cust1337/api"); //This could/should either be fetched from the jwt during systemuser flow, or updated through the state endpoint
webApi.applicationToken("13f2132133b77f7"); //Client secret
```
