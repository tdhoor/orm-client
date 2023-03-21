import { createTestData } from "@core/functions/create-test-data.function";
import { IOrder } from "@core/models/entities/order.model";
import { AMOUNT_OF_TEST_EXECUTIONS } from "../../core/global.const";
import { ApiHttpClient } from "../../utils/api-http-client";
import { DataStorage } from "../../utils/data-storage";
import { FileWriter } from "../../utils/file-writer";
import { Framework } from "../../core/framework";
import { Test } from "../../models/test.model";
import { DbSize } from "../../core/db-size";
import { Db } from "../../core/db";

export class CreateOrder extends Test<IOrder> {
    readonly endpoint = "order";
    readonly method = "create";

    constructor(config: { dbSize: DbSize, db: Db, framework: Framework }) {
        super("create-order", config.dbSize, config.db, config.framework);
    }

    async exec(): Promise<void> {
        await super.exec();
        const data = DataStorage.instance.get(this);
        for (const entry of data) {
            const response = await ApiHttpClient.instance.post(this.endpoint, entry);
            if (response) {
                this.results.push(response)
            }
        }
        FileWriter.write(this);
    }

    createData(): any {
        const { orders } = createTestData.create.orders(AMOUNT_OF_TEST_EXECUTIONS, this.dbSize, this.dbSize);
        return orders;
    }
}

