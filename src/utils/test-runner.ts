import { IExec } from "../models/exec.model";
import { Timeout } from "./timeout";
import { TEST_TIMEOUT } from "../core/global.const";

export class TestRunner {
    executables: IExec[] = [];

    constructor(executable: IExec[]) {
        this.executables = executable;
    }

    async exec() {
        while (this.executables.length > 0) {
            const curr = this.executables.splice(0, 1)[0];
            await new Timeout(TEST_TIMEOUT).exec();
            await curr.exec();
        }
    }
}