import { DbSize } from "src/core/db-size";
import { ApiHttpClient } from "./api-http-client";

export class DbSeeder {
    static #instance: DbSeeder;

    #prevDbSize: DbSize;

    private constructor() {
    }

    static get instance(): DbSeeder {
        if (!DbSeeder.#instance) {
            DbSeeder.#instance = new DbSeeder();
        }
        return DbSeeder.#instance;
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