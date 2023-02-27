import { FileWriter } from "src/utils/file-writer";
import { AMOUNT_OF_TEST_EXECUTIONS } from "../core/global.const";
import { Test } from "../models/test.model";

export class CreateCustomer extends Test {
    async exec(): Promise<void> {
        return new Promise(r => {
            const indexes = Array.from({length: AMOUNT_OF_TEST_EXECUTIONS}).map((v, i) => i);
            indexes.forEach(index => {
                FileWriter.addNewLine(CreateCustomer.name, index + "");
            })
            console.log('TestCreateCustomer');
            r();
        })
    }
}