import { FileWriter } from "src/utils/file-writer";
import { Test } from "../models/test.model";
import { DbSize } from "src/core/db-size";
import { MockGenerator as DataStorage } from "src/utils/data-storage";
import { TestResultResponse } from "@core/models/test-result-response.model";
import { ICustomer } from "@core/models/entities/customer.model";
import { HttpClient } from "src/utils/http-client";

export class CreateCustomer extends Test {
    constructor(public dbSize: DbSize) {
        super();
    }

    async exec(): Promise<void> {
        let results: TestResultResponse<ICustomer>[] = [];
        const customers = DataStorage.instance.getData("create/customer-with-address", this.dbSize);

        for (const customer of customers) {
            const result: TestResultResponse<ICustomer> = await HttpClient.instance.post("customer", customer);
            results.push(result);
        }

        results.forEach(r => {
            FileWriter.addNewLine(CreateCustomer.name, r.time + "");
        })
    }
}