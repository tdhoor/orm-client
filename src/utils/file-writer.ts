import fs from "fs";
import { Test } from "src/models/test.model";

export class FileWriter {
    static write(test: Test<any>) {
        const data = test.getResultCsvString();
        try {
            const path = test.getResultPath();
            this.createDirs(path);
            fs.writeFileSync(path, data);
        } catch (e) {
            console.log(test.results);
            console.log(data);
            console.error(e);
        }
        console.log("wrote: " + test.name);
    }

    static createDirs(path: string) {
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
