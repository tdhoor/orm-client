import { IExec } from "src/models/exec.model";

export class TestRunner {
    executables: IExec[] = [];

    register(executable: IExec) {
        this.executables.push(executable);
        return this;
    }

    async exec() {
        await this.init();

        for (const executable of this.executables) {
            await executable.exec();
        }
    }

    private async init(): Promise<void> {
        return new Promise(r => {
            setTimeout(() => {
                console.log('init');
                r();
            }, 2000);
        })
    }
}