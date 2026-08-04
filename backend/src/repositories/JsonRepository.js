import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class JsonRepository {

    constructor(fileName) {

        this.fileName = fileName;

        this.filePath = path.join(
            __dirname,
            "../data",
            fileName
        );

        this.data = null;
    }

    load() {

        if (this.data !== null) {
            return;
        }

        try {

            const file =
                fs.readFileSync(
                    this.filePath,
                    "utf-8"
                );

            this.data =
                JSON.parse(file);

        } catch (error) {

            console.error(
                `Erro ao carregar ${this.fileName}:`,
                error
            );

            this.data = [];

        }

    }

    findAll() {

        this.load();

        return this.data;

    }

    findById(id) {

        this.load();

        return this.data.find(
            item =>
                item.id === id
        );

    }

    create(item) {

        this.load();

        this.data.push(item);

        return item;

    }

    update(id, data) {

        this.load();

        const index =
            this.data.findIndex(
                item =>
                    item.id === id
            );

        if (index === -1) {
            return null;
        }

        this.data[index] = {
            ...this.data[index],
            ...data
        };

        return this.data[index];

    }

    delete(id) {

        this.load();

        const index =
            this.data.findIndex(
                item =>
                    item.id === id
            );

        if (index === -1) {
            return false;
        }

        this.data.splice(
            index,
            1
        );

        return true;

    }

}

export default JsonRepository;