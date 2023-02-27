import fs from "fs";
import path from "path";

export class FileWriter {
    static #path = "";

    static setDir(name: string | any[]) {
        let dirs = [];

        if (Array.isArray(name)) {
            dirs = name
        } else {
            dirs = name.split("/");
        }

        const curr: string[] = [];

        dirs.forEach((dir) => {
            curr.push(dir + "");
            this.#createDir(path.join(...curr));
        });

        this.#path = path.join(...curr);
    }

    static addNewLine(file: string, line: any) {
        fs.appendFileSync(this.#path + "/" + file + ".txt", line + "\n");
    }

    static #createDir(name: string) {
        if (!fs.existsSync(name)) {
            fs.mkdirSync(name);
        }
    }
}