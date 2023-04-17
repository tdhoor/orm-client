import { IExec } from "../models/exec.model";
import { Timeout } from "./timeout";
import { TEST_TIMEOUT } from "../core/global.const";

export class TestRunner {
    executables: IExec[] = [];

    register(executable: IExec | IExec[]) {
        if (Array.isArray(executable)) {
            executable.forEach(e => this.executables.push(e));
        } else {
            this.executables.push(executable);
        }
        return this;
    }

    async exec() {
        for (const executable of this.executables) {
            await new Timeout(TEST_TIMEOUT).exec();
            await executable.exec();
        }
    }
}