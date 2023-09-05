import fs from "fs";
import { Test } from "../models/test.model";

export class TesteResultConverter {
    static convertAndStoreResults(test: Test<any>) {
        // store response data (test results) as object
        try {
            const path = test.getPathToResponseData();
            this.createDirs(path);
            fs.writeFileSync(path, JSON.stringify(test.results, null, 2));
        } catch (e) {
            console.log(e)
        }

        // store response data (test results) as csv 
        const data = test.getResultCsvString();
        try {
            const path = test.getPathToResultPath();
            this.createDirs(path);
            fs.writeFileSync(path, data);
        } catch (e) {
            console.log(test.results);
            console.log(data);
            console.error(e);
        }
        console.log("wrote: " + test.name);
    }

    private static createDirs(path: string) {
        const paths = path.split("/");
        let currPath = "";

        paths.forEach((path, i) => {
            if (i !== paths.length - 1) {
                currPath += path + "/";
                if (!fs.existsSync(currPath)) {
                    fs.mkdirSync(currPath);
                }
            }
        });
    }
}
