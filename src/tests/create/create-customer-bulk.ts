import { createTestData } from "@core/functions/create-test-data.function";
import { AMOUNT_OF_BULK_ENTRIES } from "../../core/global.const";
import { ICustomer } from "@core/models/entities/customer.model";
import { ApiHttpClient } from "../../utils/api-http-client";
import { DataStorage } from "../../utils/data-storage";
import { FileWriter } from "../../utils/file-writer";
import { Framework } from "../../core/framework";
import { Test } from "../../models/test.model";
import { DbSize } from "../../core/db-size";
import { Db } from "../../core/db";

export class CreateCustomerBulk extends Test<ICustomer> {
    readonly endpoint = "customer/bulk";
    readonly method = "create";

    constructor(config: { dbSize: DbSize, db: Db, framework: Framework }) {
        super("create-customer-bulk", config.dbSize, config.db, config.framework);
    }

    async exec(): Promise<void> {
        await super.exec();
        const data = DataStorage.instance.get(this);

        for (let i = 0; i < 100; i++) {
            const response = await ApiHttpClient.instance.post<ICustomer>(this.endpoint, data);
            if (response) {
                this._results.push(response)
            }
        }
        this.amountOfDbEntities = await this.count();
        FileWriter.write(this);
    }

    createData(): any {
        return createTestData.create.customers(AMOUNT_OF_BULK_ENTRIES);
    }
}

