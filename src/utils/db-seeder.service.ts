import { DbSize } from "../core/db-size";
import { ApiHttpClient } from "./api-http-client";

export class DbSeederService {
    static _instance: DbSeederService;

    #prevDbSize: DbSize;

    private constructor() {
    }

    static get instance(): DbSeederService {
        if (!DbSeederService._instance) {
            DbSeederService._instance = new DbSeederService();
        }
        return DbSeederService._instance;
    }

    resetDbSeederService() {
        this.#prevDbSize = undefined;
    }

    async seedDatabase(size: DbSize): Promise<void> {
        if (this.#prevDbSize !== size) {
            let p1 = performance.now();
            console.log("seed db with " + size + " records");
            await ApiHttpClient.instance.get("seed/" + size);
            console.log("db seeded in " + ((performance.now() - p1) / 1000) + " s");
        }
        this.#prevDbSize = size;
    }
}