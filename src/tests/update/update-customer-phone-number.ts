import { createTestData } from "@core/functions/create-test-data.function";
import { ICustomer } from "@core/models/entities/customer.model";
import { AMOUNT_OF_TEST_EXECUTIONS } from "../../core/global.const";
import { ApiHttpClient } from "../../utils/api-http-client";
import { DataStorage } from "../../utils/data-storage";
import { FileWriter } from "../../utils/file-writer";
import { Framework } from "../../core/framework";
import { Test } from "../../models/test.model";
import { DbSize } from "../../core/db-size";
import { Db } from "../../core/db";

export class UpdateCustomerPhoneNumber extends Test<ICustomer> {
    readonly endpoint = "customer";
    readonly method = "update";

    constructor(config: { dbSize: DbSize, db: Db, framework: Framework }) {
        super("update-customer-phone-number", config.dbSize, config.db, config.framework);
    }

    async exec(): Promise<void> {
        await super.exec();
        const data: ICustomer[] = DataStorage.instance.get(this);

        for (const entry of data) {
            // console.log("exec: " + this.name + " i: " + this.results.length);

            const response = await ApiHttpClient.instance.put(this.endpoint, entry);
            if (response) {
                this.results.push(response)
            }
        }
        FileWriter.write(this);
    }

    createData(): any {
        return createTestData.update.customers(AMOUNT_OF_TEST_EXECUTIONS, this.dbSize);
    }
}

