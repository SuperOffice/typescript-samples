# superoffice-ts-samples

This mono repo contains TypeScript code samples for SuperOffice.
It uses the [@superoffice/webapi](https://www.npmjs.com/package/@superoffice/webapi) to do requests towards the REST API.

## [mass-operations](./packages/mass-operations/)

This sample-code inserts dummy-data into SuperOffice using the [mass-operations api](https://docs.superoffice.com/en/api/netserver/bulk-operations/mass-operations/index.html).
It requires a valid SOTicket and SO-Apptoken to get access to use the DatabaseTable Agent.

For Online: To get a valid SOTicket you can use the included service [getSystemUserTicket](./services/systemuser/getSystemUserTicket.ts). The SO-AppToken is your application client_secret.

After inserting your valid SOTicket and SO-Apptoken into [mass-operations.ts](./packages/mass-operations/src/mass-operations.ts), you can go ahead and compile the project from root of this repo:

`pnpm run build:mass-operations`

We use Node to actually run the compiled .js.file:

`pnpm run start:mass-operations`
