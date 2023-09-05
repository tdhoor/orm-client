import { createTestData } from "@core/functions/create-test-data.function";
import { AMOUNT_OF_TEST_EXECUTIONS } from "../../core/global.const";
import { ICustomer } from "@core/models/entities/customer.model";
import { ApiHttpClient } from "../../utils/api-http-client";
import { MockDataService } from "../../utils/mock-data.service";
import { TesteResultConverter } from "../../utils/test-result-converter";
import { Framework } from "../../core/framework";
import { Test } from "../../models/test.model";
import { DbSize } from "../../core/db-size";
import { Db } from "../../core/db";

export class CreateCustomerWithAddress extends Test<ICustomer> {
    readonly endpoint = "customer";
    readonly method = "create";

    constructor(config: { dbSize: DbSize, db: Db, framework: Framework }) {
        super("create-customer-with-address", config.dbSize, config.db, config.framework);
    }

    async exec(): Promise<void> {
        await super.exec();
        const data = MockDataService.instance.getMockData(this);

        for (const entry of data) {
            const response = await ApiHttpClient.instance.post<ICustomer>(this.endpoint, entry);
            if (response) {
                this._results.push(response)
            }
        }
        this.amountOfDbEntities = await this.countTuplesPerTable();
        TesteResultConverter.convertAndStoreResults(this);
    }

    createMockData(): any {
        return createTestData.create.customersWithAddress(AMOUNT_OF_TEST_EXECUTIONS);
    }
}

