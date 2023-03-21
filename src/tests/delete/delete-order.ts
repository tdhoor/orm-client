import { createTestData } from "@core/functions/create-test-data.function";
import { AMOUNT_OF_TEST_EXECUTIONS } from "../../core/global.const";
import { ApiHttpClient } from "../../utils/api-http-client";
import { DataStorage } from "../../utils/data-storage";
import { FileWriter } from "../../utils/file-writer";
import { Framework } from "../../core/framework";
import { Test } from "../../models/test.model";
import { DbSize } from "../../core/db-size";
import { Db } from "../../core/db";
import { ICustomer } from "@core/models/entities/customer.model";

export class DeleteOrder extends Test<ICustomer> {
    readonly endpoint = "order";
    readonly method = "delete";

    constructor(config: { dbSize: DbSize, db: Db, framework: Framework }) {
        super("delete-order", config.dbSize, config.db, config.framework);
    }

    async exec(): Promise<void> {
        await super.exec();
        const data: number[] = DataStorage.instance.get(this);

        for (const id of data) {
            // console.log("exec: " + this.name + " i: " + this.results.length);

            const response = await ApiHttpClient.instance.delete(`${this.endpoint}/${id}`);
            if (response) {
                this.results.push(response)
            }
        }
        FileWriter.write(this);
    }

    createData(): any {
        return createTestData.delete.orderIds(AMOUNT_OF_TEST_EXECUTIONS, this.dbSize);
    }
}
