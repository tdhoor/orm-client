import { IExec } from "src/models/exec.model";
import { Timeout } from "./timeout";

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
            await new Timeout(2000).exec();
            await executable.exec();
        }
    }
}