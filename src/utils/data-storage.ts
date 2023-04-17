import fs from "fs";
import { Test } from "../models/test.model";

export class DataStorage {
    private static _instance: DataStorage | undefined;

    private constructor() { }

    static get instance() {
        if (!DataStorage._instance) {
            DataStorage._instance = new DataStorage();
        }
        return DataStorage._instance;
    }

    add(value: Test<any> | Test<any>[]) {
        if (Array.isArray(value)) {
            value.forEach((v) => this.add(v));
        } else {
            const path = value.getDataPath();

            if (!fs.existsSync(path)) {
                console.log("Creating data for " + value.name, path);
                const data = value.createData();
                this.createDirs(path);
                this.createJSON(path, data);
            }
        }
    }

    createJSON(path: string, data: any) {
        fs.writeFileSync(path, JSON.stringify(data));
    }

    get(test: Test<any>) {
        return this.readJSON(test.getDataPath());
    }

    readJSON(path: string) {
        return JSON.parse(fs.readFileSync(path, "utf-8"))
    }

    createDirs(path: string) {
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