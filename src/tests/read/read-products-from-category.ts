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

export class ReadProductsFromCategory extends Test<IProduct> {
    readonly endpoint = "product/category/:name";
    readonly method = "read";

    constructor(config: { dbSize: DbSize, db: Db, framework: Framework }) {
        super("read-products-from-category", config.dbSize, config.db, config.framework);
    }

    async exec(): Promise<void> {
        await super.exec();
        const data: string[] = DataStorage.instance.get(this);

        for (const entry of data) {
            const response = await ApiHttpClient.instance.get(this.endpoint.replace(":name", entry + ""));
            if (response) {
                this.results.push(response)
            }
        }
        FileWriter.write(this);
    }

    createData(): any {
        return createTestData.read.categoryNames(AMOUNT_OF_TEST_EXECUTIONS, this.dbSize);
    }
}

