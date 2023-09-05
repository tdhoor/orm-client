import { createTestData } from "@core/functions/create-test-data.function";
import { IProduct } from "@core/models/entities/product.model";
import { AMOUNT_OF_TEST_EXECUTIONS } from "../../core/global.const";
import { ApiHttpClient } from "../../utils/api-http-client";
import { MockDataService } from "../../utils/mock-data.service";
import { TesteResultConverter } from "../../utils/test-result-converter";
import { Framework } from "../../core/framework";
import { Test } from "../../models/test.model";
import { DbSize } from "../../core/db-size";
import { Db } from "../../core/db";
import { calcProductCategoriesSize } from "../../functions/calc-product-categories-size.function";

export class ReadProductsFromCategory extends Test<IProduct[]> {
    readonly endpoint = "product/category/:name";
    readonly method = "read";

    constructor(config: { dbSize: DbSize, db: Db, framework: Framework }) {
        super("read-products-from-category", config.dbSize, config.db, config.framework);
    }

    async exec(): Promise<void> {
        await super.exec();
        const data: string[] = MockDataService.instance.getMockData(this);

        for (const entry of data) {
            const response = await ApiHttpClient.instance.get<IProduct[]>(this.endpoint.replace(":name", entry + ""));
            if (response) {
                this._results.push({
                    time: response.time,
                    data: {
                        length: response.data.length,
                        // @ts-ignore 
                        ids: response.data.map(product => product.id)
                    }
                })
            }
        }
        this.amountOfDbEntities = await this.countTuplesPerTable();
        TesteResultConverter.convertAndStoreResults(this);
    }

    createMockData(): any {
        return createTestData.read.categoryNames(AMOUNT_OF_TEST_EXECUTIONS, calcProductCategoriesSize(this.dbSize));
    }
}

