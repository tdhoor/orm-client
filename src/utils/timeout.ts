import { IExec } from "../models/exec.model";

export class Timeout implements IExec {
    constructor(private ms: number) { }
    async exec(): Promise<void> {
        return new Promise(r => {
            setTimeout(() => {
                console.log('Timeout ms: ' + this.ms);
                r();
            }, this.ms);
        })
    }
}