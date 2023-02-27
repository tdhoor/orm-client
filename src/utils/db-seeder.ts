import { IExec } from "src/models/exec.model";

export class DbSeeder implements IExec {
    async exec(): Promise<void> {
        try {
            await fetch('http://localhost:3000/seed/1000')
        } catch (e) {
            console.error(e);
        }
    }
}