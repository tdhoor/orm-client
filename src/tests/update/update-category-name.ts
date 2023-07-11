import { createTestData } from "@core/functions/create-test-data.function";
import { IProductCategory } from "@core/models/entities/product-category.model";
import { AMOUNT_OF_TEST_EXECUTIONS } from "../../core/global.const";
import { ApiHttpClient } from "../../utils/api-http-client";
import { DataStorage } from "../../utils/data-storage";
import { FileWriter } from "../../utils/file-writer";
import { Framework } from "../../core/framework";
import { Test } from "../../models/test.model";
import { DbSize } from "../../core/db-size";
import { Db } from "../../core/db";
import { calcProductCategoriesSize } from "../../functions/calc-product-categories-size.function";


export class UpdateProductCategoryName extends Test<IProductCategory> {
    readonly endpoint = "product-category";
    readonly method = "update";

    constructor(config: { dbSize: DbSize, db: Db, framework: Framework }) {
        super("update-product-category-name", config.dbSize, config.db, config.framework);
    }

    async exec(): Promise<void> {
        await super.exec();
        const data: IProductCategory[] = DataStorage.instance.get(this);

        for (const entry of data) {
            const response = await ApiHttpClient.instance.put<IProductCategory>(this.endpoint, entry);
            if (response) {
                this._results.push(response)
            }
        }
        this.amountOfDbEntities = await this.count();
        FileWriter.write(this);
    }

    createData(): any {
        return createTestData.update.productCategories(AMOUNT_OF_TEST_EXECUTIONS, calcProductCategoriesSize(this.dbSize));
    }
}

