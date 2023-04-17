import { DbSize } from "../core/db-size";
import { IExec } from "./exec.model";
import { Db } from "../core/db";
import { Framework } from "../core/framework";
import { DATA_DIR, RESULT_DIR } from "../core/global.const";
import { TestResultResponse } from "@core/models/test-result-response.model";
import { DbSeeder } from "../utils/db-seeder";

export abstract class Test<Entity> implements IExec {
    abstract endpoint: string;
    abstract method: "create" | "read" | "update" | "delete";

    results: TestResultResponse<Entity>[] = [];
    name: string;
    dbSize: DbSize;
    db: Db;
    framework: Framework;

    constructor(name: string, dbSize: DbSize, db: Db, framework: Framework) {
        this.dbSize = dbSize;
        this.db = db;
        this.name = name + `-${dbSize}`;
        this.framework = framework;
    }

    abstract createData(): any;

    async exec(): Promise<void> {
        await DbSeeder.instance.seed(this.dbSize);
    }

    getResultCsvString() {
        try {
            // const header = `time${CSV_SEPARATOR}` + Object.keys(this.results[0].size).join(CSV_SEPARATOR) + "\n";
            const header = `time\n`;
            const body = [];

            this.results.forEach((result, i) => {
                // body.push(`${result.time}` + Object.values(result.size).map(v => `${CSV_SEPARATOR}${v}`).join(""));
                body.push(result.time + "");
            });
            return header + body.join("\n")
        } catch (error) {
            console.error(error);
        }
    }

    getResultPath(): string {
        const timestamp = new Date().toISOString().substring(0, 19).replace(/:/g, "-");
        // return `${RESULT_DIR}/${this.method}/${this.name}/${this.framework}.${this.db}.${timestamp}.csv`
        return `${RESULT_DIR}/${this.method}/${this.name}/${this.framework}.${this.db}.csv`
    }

    getResponsePath(): string {
        return `response/${this.method}/${this.name}/${this.framework}.${this.db}.json`
    }

    getDataPath(): string {
        return `${DATA_DIR}/${this.method}/${this.name}.json`
    }
}