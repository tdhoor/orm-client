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

export class ReadCustomerOrders extends Test<IOrder> {
    readonly endpoint = "customer/:id/orders";
    readonly method = "read";

    constructor(config: { dbSize: DbSize, db: Db, framework: Framework }) {
        super("read-customer-orders", config.dbSize, config.db, config.framework);
    }

    async exec(): Promise<void> {
        await super.exec();
        const data: number[] = DataStorage.instance.get(this);

        for (const entry of data) {
            const response = await ApiHttpClient.instance.get(this.endpoint.replace(":id", entry + ""));
            if (response) {
                this.results.push(response)
            }
        }
        FileWriter.write(this);
    }

    createData(): any {
        return createTestData.read.orderIds(AMOUNT_OF_TEST_EXECUTIONS, this.dbSize);
    }
}

