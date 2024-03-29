import { DbSize } from "../core/db-size";
import { IExec } from "./exec.model";
import { Db } from "../core/db";
import { Framework } from "../core/framework";
import { DATA_DIR, RESULT_DIR } from "../core/global.const";
import { TestResultResponse } from "@core/models/test-result-response.model";
import { DbSeederService } from "../utils/db-seeder.service";
import { ApiHttpClient } from "src/utils/api-http-client";

export abstract class Test<Entity> implements IExec {
    abstract endpoint: string;
    abstract method: "create" | "read" | "update" | "delete";

    protected _results: TestResultResponse<Entity>[] = [];

    get results() {
        return {
            results: this._results,
            amountOfDbEntities: this.amountOfDbEntities
        }
    }

    name: string;
    dbSize: DbSize;
    db: Db;
    framework: Framework;
    amountOfDbEntities: any = {};

    constructor(name: string, dbSize: DbSize, db: Db, framework: Framework) {
        this.dbSize = dbSize;
        this.db = db;
        this.name = name + `-${dbSize}`;
        this.framework = framework;
    }

    abstract createMockData(): any;

    async exec(): Promise<void> {
        await DbSeederService.instance.seedDatabase(this.dbSize);
    }

    async countTuplesPerTable(): Promise<any> {
        return await ApiHttpClient.instance.get('seed/count');
    }

    getResultCsvString() {
        try {
            // const header = `time${CSV_SEPARATOR}` + Object.keys(this.results[0].size).join(CSV_SEPARATOR) + "\n";
            const header = `time\n`;
            const body = [];

            this._results.forEach((result, i) => {
                // body.push(`${result.time}` + Object.values(result.size).map(v => `${CSV_SEPARATOR}${v}`).join(""));
                body.push(result.time + "");
            });
            return header + body.join("\n")
        } catch (error) {
            console.error(error);
        }
    }

    getPathToResultPath(): string {
        const timestamp = new Date().toISOString().substring(0, 19).replace(/:/g, "-");
        // return `${RESULT_DIR}/${this.method}/${this.name}/${this.framework}.${this.db}.${timestamp}.csv`
        return `${RESULT_DIR}/${this.method}/${this.name}/${this.framework}.${this.db}.csv`
    }

    getPathToResponseData(): string {
        return `response/${this.method}/${this.name}/${this.framework}.${this.db}.json`
    }

    getPathToMockData(): string {
        return `${DATA_DIR}/${this.method}/${this.name}.json`
    }
}