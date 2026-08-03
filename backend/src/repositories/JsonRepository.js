import { promises as fs } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default class JsonRepository {

    constructor(fileName) {
        this.file = `${__dirname}/../data/${fileName}`;
    }

    async read() {

        try {

            const data = await fs.readFile(this.file, "utf8");

            return JSON.parse(data);

        } catch {

            return [];

        }

    }

    async write(data) {

        await fs.writeFile(
            this.file,
            JSON.stringify(data, null, 4)
        );

    }

    async findAll() {

        return await this.read();

    }

    async findById(id) {

        const items = await this.read();

        return items.find(item => item.id === id);

    }

    async create(data) {

        const items = await this.read();

        const novo = {
            id: uuid(),
            ...data
        };

        items.push(novo);

        await this.write(items);

        return novo;

    }

    async update(id, data) {

        const items = await this.read();

        const index = items.findIndex(i => i.id === id);

        if (index === -1)
            return null;

        items[index] = {
            ...items[index],
            ...data
        };

        await this.write(items);

        return items[index];

    }

    async delete(id) {

        const items = await this.read();

        const novos = items.filter(i => i.id !== id);

        await this.write(novos);

    }

}