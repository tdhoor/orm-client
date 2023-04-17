import { DbSize } from "../core/db-size";
import { ApiHttpClient } from "./api-http-client";

export class DbSeeder {
    static _instance: DbSeeder;

    #prevDbSize: DbSize;

    private constructor() {
    }

    static get instance(): DbSeeder {
        if (!DbSeeder._instance) {
            DbSeeder._instance = new DbSeeder();
        }
        return DbSeeder._instance;
    }

    reset() {
        this.#prevDbSize = undefined;
    }

    async seed(size: DbSize): Promise<void> {
        if (this.#prevDbSize !== size) {
            let p1 = performance.now();
            console.log("seed db with " + size + " records");
            await ApiHttpClient.instance.get("seed/" + size);
            console.log("db seeded in " + ((performance.now() - p1) / 1000) + " s");
        }
        this.#prevDbSize = size;
    }
}