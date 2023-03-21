import { createTestData } from "@core/functions/create-test-data.function";
import { IProduct } from "@core/models/entities/product.model";
import { AMOUNT_OF_TEST_EXECUTIONS } from "../../core/global.const";
import { ApiHttpClient } from "../../utils/api-http-client";
import { DataStorage } from "../../utils/data-storage";
import { FileWriter } from "../../utils/file-writer";
import { Framework } from "../../core/framework";
import { Test } from "../../models/test.model";
import { DbSize } from "../../core/db-size";
import { Db } from "../../core/db";

export class CreateProduct extends Test<IProduct> {
    readonly endpoint = "product";
    readonly results: any[] = [];
    readonly method = "create";

    constructor(config: { dbSize: DbSize, db: Db, framework: Framework }) {
        super("create-product", config.dbSize, config.db, config.framework);
    }

    async exec(): Promise<void> {
        await super.exec();

        const data = DataStorage.instance.get(this);

        for (const entry of data) {
            // console.log("exec: " + this.name + " i: " + this.results.length);

            const response = await ApiHttpClient.instance.post(this.endpoint, entry);
            if (response) {
                this.results.push(response)
            }
        }
        FileWriter.write(this);
    }

    createData(): any {
        return createTestData.create.products(AMOUNT_OF_TEST_EXECUTIONS);
    }
}
