import { IExec } from "./exec.model";

export abstract class Test implements IExec {
    abstract exec(): Promise<void>;
}