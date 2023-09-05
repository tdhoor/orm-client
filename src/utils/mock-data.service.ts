import fs from "fs";
import { Test } from "../models/test.model";

export class MockDataService {
    private static _instance: MockDataService | undefined;

    private constructor() { }

    static get instance() {
        if (!MockDataService._instance) {
            MockDataService._instance = new MockDataService();
        }
        return MockDataService._instance;
    }

    createAndSaveMockData(test: Test<any> | Test<any>[]) {
        if (Array.isArray(test)) {
            test.forEach((v) => this.createAndSaveMockData(v));
        } else {
            const path = test.getPathToMockData();

            if (!fs.existsSync(path)) {
                console.log("Creating test data for " + test.name, path);
                const data = test.createMockData();
                this.createDirs(path);
                this.createJsonFile(path, data);
            }
        }
    }

    getMockData(test: Test<any>) {
        return this.readJsonFile(test.getPathToMockData());
    }

    private createJsonFile(path: string, data: any) {
        fs.writeFileSync(path, JSON.stringify(data));
    }

    private readJsonFile(path: string) {
        return JSON.parse(fs.readFileSync(path, "utf-8"))
    }

    private createDirs(path: string) {
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