import { WebApi } from "@superoffice/webapi";

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

async function getContactEntityAsync(contactId: number): Promise<void> {
    const contactAgent = webApi.getContactAgent();
    const contactEntity = await contactAgent.getContactAsync(4);
    console.log(contactEntity.name);
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

let webApi = new WebApi("");
webApi.authenticateWithTicket("");
webApi.applicationToken("");

//getContactEntityAsync(4); // This can me run to test fetching a contact

insertIntoDatabaseTableAsync();

